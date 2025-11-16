"""Metadata analysis endpoints."""

import uuid
from typing import Dict, Any, List, Optional
from uuid import UUID
from fastapi import APIRouter, HTTPException, BackgroundTasks
from models import (
    AnalyzeMetadataRequest,
    AnalysisOptions,
    BatchAnalyzeMetadataRequest,
    BatchAnalyzeMetadataResponse,
    DetectedMetadata,
    ConfidenceScores,
    MetadataAnalysis,
)
from services.metadata_service import analyze_metadata
from storage.track_storage import storage
from utils.analysis_progress import analysis_tracker

router = APIRouter(prefix="/metadata", tags=["Metadata"])


def _should_use_audio_analysis(analysis_options: Optional[AnalysisOptions]) -> bool:
    """Determine if audio analysis should be used based on options."""
    if not analysis_options:
        return True
    return analysis_options.detect_bpm or analysis_options.detect_key


def _build_update_dict(
    result: Dict[str, Any], analysis_options: Optional[AnalysisOptions]
) -> Dict[str, Any]:
    """Build update dictionary from analysis result based on options."""
    update_dict = {}
    if result.get("bpm") and (not analysis_options or analysis_options.detect_bpm):
        update_dict["bpm"] = result["bpm"]
    if result.get("key") and (not analysis_options or analysis_options.detect_key):
        update_dict["key"] = result["key"]
    return update_dict


def _process_single_track(
    track_id: UUID, analysis_options: Optional[AnalysisOptions]
) -> tuple[bool, Optional[str]]:
    """Process metadata analysis for a single track.

    Returns:
        Tuple of (success: bool, error_message: Optional[str])
    """
    try:
        # Get track from database
        track = storage.get_track_by_id(track_id)
        if not track or not track.file_path:
            return False, f"Track {track_id} not found or missing file path"

        # Analyze metadata
        use_audio = _should_use_audio_analysis(analysis_options)
        result = analyze_metadata(
            file_path=track.file_path, use_audio_analysis=use_audio
        )

        # Update track with detected metadata
        update_dict = _build_update_dict(result, analysis_options)
        if update_dict:
            storage.update_track(track_id, update_dict)
            return True, None

        return False, None
    except (OSError, ValueError, RuntimeError) as e:
        return False, f"Error processing track {track_id}: {str(e)}"


def _process_analysis(
    job_id: UUID, track_ids: List[UUID], analysis_options: AnalysisOptions
):
    """Background task to process batch metadata analysis."""
    try:
        if analysis_tracker.get_job_status(job_id) is None:
            analysis_tracker.create_job(job_id)

        for track_id in track_ids:
            _, error = _process_single_track(track_id, analysis_options)
            if error:
                # Add error to job's error list
                job = analysis_tracker.get_job_status(job_id)
                if job and job.errors is not None:
                    job.errors.append(error)

        analysis_tracker.complete_job(job_id)
    except (OSError, ValueError, RuntimeError) as e:
        analysis_tracker.fail_job(job_id, str(e))


@router.post("/analyze")
def analyze_track_metadata(request: AnalyzeMetadataRequest) -> MetadataAnalysis:
    """
    Analyze metadata for a single audio file or track.
    Uses hybrid approach: reads from tags first, then analyzes audio if needed.
    """
    file_path = request.file_path

    # If file_path not provided, we'd need track_id (not in current schema, but handle gracefully)
    if not file_path:
        raise HTTPException(
            status_code=400, detail="file_path is required for analysis"
        )

    # Determine analysis options
    analysis_options = request.analysis_options or AnalysisOptions()
    use_audio_analysis = analysis_options.detect_bpm or analysis_options.detect_key

    # Perform analysis
    result = analyze_metadata(
        file_path=file_path, use_audio_analysis=use_audio_analysis
    )

    # Build response
    detected_metadata = DetectedMetadata(
        bpm=result.get("bpm"),
        key=result.get("key"),
    )

    # Confidence scores (simplified - could be enhanced)
    confidence_scores = None
    if result.get("bpm") or result.get("key"):
        # Higher confidence for tag-based, lower for audio analysis
        confidence_map = {
            "tags": 0.95,
            "audio_analysis": 0.75,
            "hybrid": 0.85,
        }
        confidence = confidence_map.get(result.get("source", "audio_analysis"), 0.75)
        confidence_scores = ConfidenceScores(
            bpm=confidence if result.get("bpm") else None,
            key=confidence if result.get("key") else None,
        )

    return MetadataAnalysis(
        file_path=file_path,
        detected_metadata=detected_metadata,
        confidence_scores=confidence_scores,
    )


@router.post("/batch-analyze", status_code=202)
def batch_analyze_metadata(
    request: BatchAnalyzeMetadataRequest,
    background_tasks: BackgroundTasks,
) -> BatchAnalyzeMetadataResponse:
    """
    Analyze metadata for multiple tracks in the background.
    """
    if not request.track_ids:
        raise HTTPException(status_code=400, detail="track_ids list is required")

    # Generate job ID
    job_id = uuid.uuid4()

    # Create job status
    analysis_tracker.create_job(job_id)

    # Default analysis options (detect BPM and key)
    analysis_options = AnalysisOptions(detect_bpm=True, detect_key=True)

    # Start background task
    background_tasks.add_task(
        _process_analysis,
        job_id,
        request.track_ids,
        analysis_options,
    )

    return BatchAnalyzeMetadataResponse(
        job_id=job_id,
        status="processing",
        errors=[],
    )
