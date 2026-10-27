"""
Crop Health & Lifecycle Pathology API Endpoints
"""

import base64
import json
import secrets
import time
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import Path as PathParam
from pydantic import BaseModel, Field

from app.accounts import connect, optional_user, require_user
from app.services.crop_health import diagnose_crop_health

router = APIRouter()


class HealthAnalysisRequest(BaseModel):
    crop_name: str = Field(default="Tomato", max_length=100)
    growth_stage: str = Field(default="Vegetative", max_length=50)
    scan_date: Optional[str] = None
    image_base64: Optional[str] = Field(default=None, max_length=10_485_760, description="Data URL or base64 encoded image string (max ~7.5 MB image)")
    user_notes: Optional[str] = Field(default="", max_length=1000)
    force_disease: Optional[str] = Field(default=None, max_length=100)
    save_to_log: bool = Field(default=True)
    language: Optional[str] = Field(default="en", max_length=10, description="Target language code (e.g. en, te, hi, kn, ta, mr)")


@router.post("/crop-health/analyze")
def analyze_health(req: HealthAnalysisRequest, user=Depends(optional_user)):
    """
    Analyzes an uploaded crop photo for disease/pathology symptoms,
    computes health metrics, immediate remedies, and start-to-end cycle guidance.
    Optionally persists the diagnosis to the user's timeline.
    """
    image_bytes = None
    stored_image_url = ""

    if req.image_base64:
        clean_b64 = req.image_base64
        stored_image_url = req.image_base64
        if "base64," in clean_b64:
            clean_b64 = clean_b64.split("base64,")[1]
        try:
            image_bytes = base64.b64decode(clean_b64)
        except Exception:
            image_bytes = None

    # Run AI diagnostic engine
    diagnosis = diagnose_crop_health(
        image_bytes=image_bytes,
        crop_name=req.crop_name,
        growth_stage=req.growth_stage,
        user_notes=req.user_notes or "",
        force_disease=req.force_disease,
        language=req.language or "en"
    )

    scan_date = req.scan_date or time.strftime("%Y-%m-%d")
    record_id = None

    # If user is authenticated and asked to save, record to database
    if user and req.save_to_log:
        record_id = secrets.token_hex(16)
        with connect() as db:
            db.execute("""
                INSERT INTO crop_health_logs (
                    id, user_id, crop_name, growth_stage, scan_date,
                    image_url, health_status, health_score, disease_detected,
                    severity, symptoms, diagnosis_details, lifecycle_plan, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                record_id,
                user["id"],
                diagnosis["crop_name"],
                diagnosis["growth_stage"],
                scan_date,
                stored_image_url[:120000] if stored_image_url else "",
                diagnosis["health_status"],
                diagnosis["health_score"],
                diagnosis["disease_detected"],
                diagnosis["severity"],
                json.dumps(diagnosis["symptoms"]),
                json.dumps({
                    "category": diagnosis.get("category"),
                    "confidence": diagnosis.get("confidence"),
                    "metrics": diagnosis.get("metrics"),
                    "remedies": diagnosis.get("remedies"),
                    "forecast": diagnosis.get("forecast")
                }),
                json.dumps(diagnosis["lifecycle_plan"]),
                int(time.time())
            ))

    return {
        "id": record_id,
        "scan_date": scan_date,
        "image_url": stored_image_url if stored_image_url else None,
        "saved": bool(record_id),
        **diagnosis
    }


@router.get("/crop-health/logs")
def get_health_logs(crop_name: Optional[str] = Query(None), user=Depends(require_user)):
    """
    Retrieves all past crop health diagnostics for the logged-in user.
    """
    with connect() as db:
        if crop_name:
            rows = db.execute("""
                SELECT * FROM crop_health_logs
                WHERE user_id=? AND LOWER(crop_name)=LOWER(?)
                ORDER BY scan_date DESC, created_at DESC
            """, (user["id"], crop_name.strip())).fetchall()
        else:
            rows = db.execute("""
                SELECT * FROM crop_health_logs
                WHERE user_id=?
                ORDER BY scan_date DESC, created_at DESC
            """, (user["id"],)).fetchall()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "crop_name": r["crop_name"],
            "growth_stage": r["growth_stage"],
            "scan_date": r["scan_date"],
            "image_url": r["image_url"],
            "health_status": r["health_status"],
            "health_score": r["health_score"],
            "disease_detected": r["disease_detected"],
            "severity": r["severity"],
            "symptoms": json.loads(r["symptoms"]),
            "diagnosis_details": json.loads(r["diagnosis_details"]),
            "lifecycle_plan": json.loads(r["lifecycle_plan"]),
            "created_at": r["created_at"]
        })
    return result


@router.get("/crop-health/timeline/{crop_name}")
def get_crop_timeline(crop_name: str, user=Depends(optional_user)):
    """
    Returns chronological timeline metrics over time for a given crop.
    """
    if not user:
        return {"crop_name": crop_name, "timeline": []}

    with connect() as db:
        rows = db.execute("""
            SELECT * FROM crop_health_logs
            WHERE user_id=? AND LOWER(crop_name)=LOWER(?)
            ORDER BY scan_date ASC, created_at ASC
        """, (user["id"], crop_name.strip())).fetchall()

    timeline = []
    for r in rows:
        diag = json.loads(r["diagnosis_details"])
        timeline.append({
            "id": r["id"],
            "scan_date": r["scan_date"],
            "growth_stage": r["growth_stage"],
            "health_score": r["health_score"],
            "health_status": r["health_status"],
            "disease_detected": r["disease_detected"],
            "severity": r["severity"],
            "symptoms": json.loads(r["symptoms"]),
            "remedies": diag.get("remedies", {}),
            "metrics": diag.get("metrics", {}),
            "image_url": r["image_url"]
        })

    # Compute trajectory statistics
    score_trend = 0
    if len(timeline) >= 2:
        score_trend = timeline[-1]["health_score"] - timeline[0]["health_score"]

    return {
        "crop_name": crop_name,
        "total_scans": len(timeline),
        "score_trend": score_trend,
        "current_score": timeline[-1]["health_score"] if timeline else None,
        "current_status": timeline[-1]["health_status"] if timeline else None,
        "timeline": timeline
    }


@router.delete("/crop-health/logs/{record_id}")
def delete_health_log(record_id: str = PathParam(..., pattern=r"^[0-9a-f]{32}$"), user=Depends(require_user)):
    """
    Deletes a specific health check scan record.
    """
    with connect() as db:
        res = db.execute("DELETE FROM crop_health_logs WHERE id=? AND user_id=?", (record_id, user["id"]))
        if res.rowcount != 1:
            raise HTTPException(404, "Health record not found.")
    return {"ok": True}


@router.get("/crop-health/presets")
def get_presets():
    """
    Provides default sample crop health scenarios with full lifecycle insights
    so users can immediately test the diagnostic capabilities without having to take a picture.
    """
    return [
        {
            "id": "tomato_early_blight",
            "crop_name": "Tomato",
            "growth_stage": "Vegetative",
            "label": "Tomato — Early Blight Outbreak",
            "notes": "Concentric rings and yellow halos on bottom leaves after recent rains.",
            "disease_key": "early_blight"
        },
        {
            "id": "rice_blast",
            "crop_name": "Rice",
            "growth_stage": "Tillering / Vegetative",
            "label": "Rice — Spindle Blast Lesions",
            "notes": "Diamond shaped grey spots with brownish borders across leaf blades.",
            "disease_key": "blast"
        },
        {
            "id": "cotton_leaf_spot",
            "crop_name": "Cotton",
            "growth_stage": "Flowering / Square Formation",
            "label": "Cotton — Angular Bacterial Leaf Spot",
            "notes": "Angular water-soaked leaf spots bordered by leaf veinlets.",
            "disease_key": "angular_leaf_spot"
        },
        {
            "id": "tomato_healthy",
            "crop_name": "Tomato",
            "growth_stage": "Fruiting",
            "label": "Tomato — Healthy Vigorous Canopy",
            "notes": "Deep green foliage, active shoot growth, clean leaf undersides.",
            "disease_key": "healthy"
        }
    ]
