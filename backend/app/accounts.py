"""Persistent accounts, opaque cookie sessions, and account-scoped farm records."""
import hashlib
import json
import os
import secrets
import sqlite3
import time
from datetime import date
from contextlib import contextmanager
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi import Path as PathParam
from pydantic import BaseModel, Field

router = APIRouter()
COOKIE = "crop_session"
SESSION_AGE = 7 * 24 * 3600
MAX_SESSIONS_PER_USER = 5


# ── Simple in-memory rate limiter for auth endpoints ─────────────────────────
import collections
_rate_store: dict[str, collections.deque] = {}
_RATE_LIMIT = 20   # max requests
_RATE_WINDOW = 60  # per 60 seconds

def _check_rate_limit(request: Request):
    """Raises 429 if the client IP exceeds the auth rate limit."""
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    window = _rate_store.setdefault(ip, collections.deque())
    # Purge old entries
    while window and window[0] < now - _RATE_WINDOW:
        window.popleft()
    if len(window) >= _RATE_LIMIT:
        raise HTTPException(429, "Too many requests. Please try again later.")
    window.append(now)


@contextmanager
def connect():
    is_vercel = bool(os.getenv("VERCEL"))
    default_db = "/tmp/crop.db" if is_vercel else str(Path(__file__).resolve().parents[1] / "data" / "crop.db")
    path = Path(os.getenv("DATABASE_PATH", default_db))
    path.parent.mkdir(parents=True, exist_ok=True)
    if is_vercel and not path.exists():
        seed = Path(__file__).resolve().parents[1] / "data" / "crop.db"
        if seed.exists():
            import shutil
            shutil.copyfile(seed, path)
    db = sqlite3.connect(path, timeout=15)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys=ON")
    try:
        with db:
            yield db
    finally:
        db.close()


def init_db():
    with connect() as db:
        db.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY, email TEXT NOT NULL, name TEXT NOT NULL,
            picture TEXT NOT NULL DEFAULT '', farm_name TEXT NOT NULL DEFAULT '',
            location TEXT NOT NULL DEFAULT '', farm_area REAL NOT NULL DEFAULT 2,
            bio TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS challenges (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
            created_at INTEGER NOT NULL, farm TEXT NOT NULL, result TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS crops (
            id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
            crop TEXT NOT NULL, planted_on TEXT NOT NULL, status TEXT NOT NULL,
            area REAL NOT NULL, notes TEXT NOT NULL, created_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS crop_health_logs (
            id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
            crop_name TEXT NOT NULL, growth_stage TEXT NOT NULL,
            scan_date TEXT NOT NULL, image_url TEXT NOT NULL,
            health_status TEXT NOT NULL, health_score INTEGER NOT NULL,
            disease_detected TEXT NOT NULL, severity TEXT NOT NULL,
            symptoms TEXT NOT NULL, diagnosis_details TEXT NOT NULL,
            lifecycle_plan TEXT NOT NULL, created_at INTEGER NOT NULL
        );
        ''')


def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()


def optional_user(request: Request):
    token = request.cookies.get(COOKIE)
    if not token:
        return None
    with connect() as db:
        row = db.execute("SELECT users.* FROM users JOIN sessions ON users.id=sessions.user_id WHERE sessions.token=? AND sessions.expires>?", (digest(token), int(time.time()))).fetchone()
    if not row:
        raise HTTPException(401, "Your session expired. Please sign in again.")
    return dict(row)


def require_user(user=Depends(optional_user)):
    if not user:
        raise HTTPException(401, "Sign in to access your farm.")
    return user


def set_cookie(response, name, value, age):
    is_secure = os.getenv("COOKIE_SECURE", "true" if os.getenv("VERCEL") else "false").lower() == "true"
    response.set_cookie(name, value, max_age=age, httponly=True, secure=is_secure, samesite="lax", path="/api")


@router.get("/auth/config")
def auth_config(request: Request, response: Response):
    _check_rate_limit(request)
    nonce = secrets.token_urlsafe(32)
    now = int(time.time())
    with connect() as db:
        db.execute("DELETE FROM challenges WHERE expires<?", (now,))
        db.execute("DELETE FROM sessions WHERE expires<?", (now,))
        db.execute("INSERT INTO challenges VALUES (?, ?)", (digest(nonce), now + 600))
    set_cookie(response, "crop_nonce", nonce, 600)
    response.headers["Cache-Control"] = "no-store"
    return {"client_id": os.getenv("GOOGLE_CLIENT_ID", ""), "nonce": nonce}


class GoogleLogin(BaseModel):
    credential: str = Field(min_length=1, max_length=12000)


@router.post("/auth/google")
def google_login(body: GoogleLogin, request: Request, response: Response):
    _check_rate_limit(request)
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(503, "Google sign-in has not been configured yet.")
    nonce = request.cookies.get("crop_nonce", "")
    with connect() as db:
        challenge = db.execute("SELECT token FROM challenges WHERE token=? AND expires>?", (digest(nonce), int(time.time()))).fetchone()
    if not nonce or not challenge:
        raise HTTPException(401, "Sign-in expired. Please try again.")
    try:
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token
        info = id_token.verify_oauth2_token(body.credential, google_requests.Request(), client_id)
        if info.get("nonce") != nonce or not info.get("sub") or info.get("email_verified") is not True:
            raise ValueError("Invalid identity")
    except (ValueError, KeyError):
        raise HTTPException(401, "Google sign-in could not be verified.")
    except Exception:
        raise HTTPException(503, "Google sign-in is temporarily unavailable. Please try again.")
    now = int(time.time())
    token = secrets.token_urlsafe(48)
    with connect() as db:
        if db.execute("DELETE FROM challenges WHERE token=?", (digest(nonce),)).rowcount != 1:
            raise HTTPException(401, "Please start sign-in again.")
        db.execute("INSERT INTO users(id,email,name,picture,created_at) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,picture=excluded.picture", (info["sub"], info.get("email", ""), info.get("name", "Farmer"), info.get("picture", ""), now))
        db.execute("DELETE FROM sessions WHERE expires<? OR token=?", (now, digest(request.cookies.get(COOKIE, ""))))
        # Enforce max sessions per user — purge oldest if over limit
        existing = db.execute("SELECT token FROM sessions WHERE user_id=? ORDER BY expires ASC", (info["sub"],)).fetchall()
        if len(existing) >= MAX_SESSIONS_PER_USER:
            for row in existing[:len(existing) - MAX_SESSIONS_PER_USER + 1]:
                db.execute("DELETE FROM sessions WHERE token=?", (row["token"],))
        db.execute("INSERT INTO sessions VALUES(?,?,?)", (digest(token), info["sub"], now + SESSION_AGE))
        user = dict(db.execute("SELECT * FROM users WHERE id=?", (info["sub"],)).fetchone())
    set_cookie(response, COOKIE, token, SESSION_AGE)
    response.delete_cookie("crop_nonce", path="/api")
    return user


@router.post("/auth/demo")
def demo_login(request: Request, response: Response):
    """Provides a 1-click test login for testing farm profiles, journal and history."""
    _check_rate_limit(request)
    now = int(time.time())
    demo_user_id = "demo_farmer_user"
    token = secrets.token_urlsafe(48)
    with connect() as db:
        db.execute("""
            INSERT INTO users(id, email, name, picture, farm_name, location, farm_area, created_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name=excluded.name
        """, (demo_user_id, "farmer@cropwise.local", "Farmer Ramesh", "", "Green Valley Farm", "Warangal, Telangana", 3.5, now))
        db.execute("INSERT INTO sessions VALUES(?,?,?)", (digest(token), demo_user_id, now + SESSION_AGE))
        user = dict(db.execute("SELECT * FROM users WHERE id=?", (demo_user_id,)).fetchone())
    set_cookie(response, COOKIE, token, SESSION_AGE)
    return user


@router.post("/auth/logout")
def logout(request: Request, response: Response):
    with connect() as db:
        db.execute("DELETE FROM sessions WHERE token=?", (digest(request.cookies.get(COOKIE, "")),))
    response.delete_cookie(COOKIE, path="/api")
    return {"ok": True}


@router.get("/me")
def me(user=Depends(require_user)):
    return user


class Profile(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    farm_name: str = Field(default="", max_length=100)
    location: str = Field(default="", max_length=200)
    farm_area: float = Field(default=2, ge=0.5, le=25)
    bio: str = Field(default="", max_length=1000)


@router.patch("/me")
def update_profile(body: Profile, user=Depends(require_user)):
    if not body.name.strip():
        raise HTTPException(422, "Please enter your name.")
    with connect() as db:
        db.execute("UPDATE users SET name=?,farm_name=?,location=?,farm_area=?,bio=? WHERE id=?", (body.name.strip(), body.farm_name, body.location, body.farm_area, body.bio, user["id"]))
        return dict(db.execute("SELECT * FROM users WHERE id=?", (user["id"],)).fetchone())


def save_recommendation(user_id, farm, result):
    record_id = secrets.token_hex(16)
    with connect() as db:
        db.execute("INSERT INTO history VALUES(?,?,?,?,?)", (record_id, user_id, int(time.time()), json.dumps(farm), json.dumps(result)))
    return record_id


@router.get("/history")
def history(user=Depends(require_user)):
    with connect() as db:
        rows = db.execute("SELECT * FROM history WHERE user_id=? ORDER BY created_at DESC, rowid DESC LIMIT 200", (user["id"],)).fetchall()
    return [{"id": row["id"], "created_at": row["created_at"], "farm": json.loads(row["farm"]), "result": json.loads(row["result"])} for row in rows]


class CropEntry(BaseModel):
    crop: str = Field(min_length=1, max_length=100)
    planted_on: date
    status: Literal["planned", "growing", "harvested"] = "planned"
    area: float = Field(gt=0, le=100000)
    notes: str = Field(default="", max_length=2000)


@router.get("/journal")
def journal(user=Depends(require_user)):
    with connect() as db:
        return [dict(row) for row in db.execute("SELECT id,crop,planted_on,status,area,notes,created_at FROM crops WHERE user_id=? ORDER BY planted_on DESC, rowid DESC", (user["id"],))]


@router.post("/journal", status_code=201)
def add_crop(body: CropEntry, user=Depends(require_user)):
    if not body.crop.strip():
        raise HTTPException(422, "Please enter a crop name.")
    record_id = secrets.token_hex(16)
    with connect() as db:
        db.execute("INSERT INTO crops VALUES(?,?,?,?,?,?,?,?)", (record_id, user["id"], body.crop.strip(), body.planted_on.isoformat(), body.status, body.area, body.notes, int(time.time())))
    return {"id": record_id, **body.model_dump(mode="json")}


@router.delete("/journal/{record_id}")
def delete_crop(record_id: str = PathParam(..., pattern=r"^[0-9a-f]{32}$"), user=Depends(require_user)):
    with connect() as db:
        if db.execute("DELETE FROM crops WHERE id=? AND user_id=?", (record_id, user["id"])).rowcount != 1:
            raise HTTPException(404, "Crop record not found.")
    return {"ok": True}


@router.patch("/journal/{record_id}")
def update_crop(record_id: str = PathParam(..., pattern=r"^[0-9a-f]{32}$"), body: CropEntry = ..., user=Depends(require_user)):
    if not body.crop.strip():
        raise HTTPException(422, "Please enter a crop name.")
    with connect() as db:
        changed = db.execute("UPDATE crops SET crop=?,planted_on=?,status=?,area=?,notes=? WHERE id=? AND user_id=?", (body.crop.strip(), body.planted_on.isoformat(), body.status, body.area, body.notes, record_id, user["id"]))
        if changed.rowcount != 1:
            raise HTTPException(404, "Crop record not found.")
    return {"id": record_id, **body.model_dump(mode="json")}
