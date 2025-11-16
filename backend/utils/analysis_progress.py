"""Progress tracking for metadata analysis operations."""

from typing import Dict, Optional
from uuid import UUID
from models import BatchAnalyzeMetadataResponse


class AnalysisProgressTracker:
    """Tracks progress of metadata analysis operations."""

    def __init__(self):
        self._jobs: Dict[UUID, BatchAnalyzeMetadataResponse] = {}

    def create_job(self, job_id: UUID) -> BatchAnalyzeMetadataResponse:
        """Initialize a new analysis job."""
        job = BatchAnalyzeMetadataResponse(
            job_id=job_id, status="processing", errors=[]
        )
        self._jobs[job_id] = job
        return job

    def get_job_status(self, job_id: UUID) -> Optional[BatchAnalyzeMetadataResponse]:
        """Get current job status."""
        return self._jobs.get(job_id)

    def complete_job(self, job_id: UUID):
        """Mark job as completed."""
        if job_id in self._jobs:
            self._jobs[job_id].status = "completed"

    def fail_job(self, job_id: UUID, error: str):
        """Mark job as failed and record error message.

        Args:
            job_id: UUID of the job to mark as failed
            error: Error message to record
        """
        if job_id in self._jobs:
            self._jobs[job_id].status = "failed"
            if self._jobs[job_id].errors is None:
                self._jobs[job_id].errors = []
            self._jobs[job_id].errors.append(error)


# Global progress tracker
analysis_tracker = AnalysisProgressTracker()
