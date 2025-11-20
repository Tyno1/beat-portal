"""System and health check endpoints."""

from datetime import datetime
from fastapi import APIRouter
from models import HealthResponse

router = APIRouter(tags=["System"])


@router.get("/")
def read_root():
    """
    This is the root endpoint of the application.
    """
    return {"Hello": "World"}


@router.get("/health")
def health_check() -> HealthResponse:
    """
    Health check endpoint to verify API is running and healthy.
    """
    return HealthResponse(status="healthy", version="1.0.0", timestamp=datetime.now())
