from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
from app.accounts import router as accounts_router, init_db
from fastapi.middleware.cors import CORSMiddleware
from app.api.recommendations import router as recommendations_router
from app.api.crops import router as crops_router

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
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendations_router, prefix="/api")
app.include_router(crops_router, prefix="/api")
app.include_router(accounts_router, prefix="/api")

@app.middleware("http")
async def protect_account_requests(request: Request, call_next):
    # A custom header forces cross-origin scripts through the CORS allowlist.
    if request.method in {"POST", "PATCH", "DELETE", "PUT"} and (
        request.cookies.get("crop_session") or request.url.path.startswith("/api/auth/")
    ) and request.headers.get("X-Crop-Client") != "web":
        return JSONResponse(status_code=403, content={"detail": "Request not allowed."})
    response = await call_next(request)
    if request.url.path.startswith(("/api/me", "/api/history", "/api/journal", "/api/auth")):
        response.headers["Cache-Control"] = "no-store"
    return response

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "crop-decision-ai"}
