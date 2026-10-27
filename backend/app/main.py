from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
from pathlib import Path

# Load environment variables if available
try:
    from dotenv import load_dotenv
    for env_file in [Path(__file__).resolve().parents[1] / ".env", Path(__file__).resolve().parents[2] / ".env"]:
        if env_file.exists():
            load_dotenv(env_file)
            break
except ImportError:
    pass

from app.accounts import router as accounts_router, init_db
from fastapi.middleware.cors import CORSMiddleware
from app.api.recommendations import router as recommendations_router
from app.api.crops import router as crops_router
from app.api.crop_health import router as crop_health_router
from app.api.realtime import router as realtime_router

@asynccontextmanager
async def lifespan(app):
    init_db()
    yield

app = FastAPI(
    lifespan=lifespan,
    title="Crop Decision AI API",
    version="1.0.0",
    description="Risk-aware, explainable crop recommendation API."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-Crop-Client"],
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(self), geolocation=(self)"
        return response

app.add_middleware(SecurityHeadersMiddleware)

app.include_router(recommendations_router, prefix="/api")
app.include_router(crops_router, prefix="/api")
app.include_router(accounts_router, prefix="/api")
app.include_router(crop_health_router, prefix="/api")
app.include_router(realtime_router, prefix="/api")

@app.middleware("http")
async def protect_account_requests(request: Request, call_next):
    # A custom header forces cross-origin scripts through the CORS allowlist.
    if request.method in {"POST", "PATCH", "DELETE", "PUT"} and (
        request.cookies.get("crop_session") or request.url.path.startswith("/api/auth/")
    ) and request.headers.get("X-Crop-Client") != "web":
        return JSONResponse(status_code=403, content={"detail": "Request not allowed."})
    response = await call_next(request)
    if request.url.path.startswith(("/api/me", "/api/history", "/api/journal", "/api/auth", "/api/crop-health")):
        response.headers["Cache-Control"] = "no-store"
    return response

import urllib.parse
import urllib.request
from fastapi import Query
from fastapi.responses import Response

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "crop-decision-ai"}

# Maximum TTS response size: 1 MB (prevents abuse via oversized upstream responses)
_TTS_MAX_BYTES = 1_048_576
_TTS_ALLOWED_LANGS = {"te", "hi", "kn", "ta", "mr", "en"}

@app.get("/api/tts")
def tts_endpoint(text: str = Query(..., max_length=500), lang: str = Query("en", max_length=15)):
    """
    Stream high-fidelity TTS audio (MP3) for Indian regional languages
    (Telugu, Hindi, Kannada, Tamil, Marathi, English).
    Provides guaranteed speech synthesis on systems without regional voice packs.
    """
    # Strict allowlist for language code — prevents injection into URL
    lang_code = "".join(c for c in lang.split("-")[0].lower() if c.isalpha())[:5]
    if lang_code not in _TTS_ALLOWED_LANGS:
        lang_code = "en"

    # Strip non-printable characters and newlines (CRLF injection prevention)
    clean_text = "".join(c for c in text if c.isprintable() and c not in '\r\n')[:300].strip()
    if not clean_text:
        return Response(status_code=400, content=b"")

    encoded = urllib.parse.quote(clean_text, safe="")
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl={lang_code}&client=tw-ob&q={encoded}"

    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    try:
        with urllib.request.urlopen(req, timeout=7) as resp:
            # Verify response is from expected host (SSRF protection)
            final_url = resp.geturl()
            if not final_url.startswith("https://translate.google.com/"):
                return Response(status_code=502, content=b"")
            # Read with size cap to prevent memory exhaustion
            audio_data = resp.read(_TTS_MAX_BYTES + 1)
            if len(audio_data) > _TTS_MAX_BYTES:
                return Response(status_code=502, content=b"")
            return Response(
                content=audio_data,
                media_type="audio/mpeg",
                headers={"Cache-Control": "public, max-age=86400"}
            )
    except Exception:
        return Response(status_code=502, content=b"")
