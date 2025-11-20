"""
Progress tracking for library scan operations.
"""

from typing import Dict, List
from uuid import UUID

from models import Status, ScanStatusResponse


class ScanProgressTracker:
    """Tracks progress of library scan operations."""

    def __init__(self):
        self._scans: Dict[UUID, ScanStatusResponse] = {}

    def create_scan(self, scan_id: UUID, paths: List[str] = None) -> ScanStatusResponse:
        """Initialize a new scan progress tracker."""
        scan_status = ScanStatusResponse(
            scan_id=scan_id,
            status=Status.DISCOVERING,
            message="Discovering audio files...",
            progress=0.0,
            files_scanned=0,
            files_added=0,
            files_skipped=0,
            errors=[],
            paths=paths or [],
        )
        self._scans[scan_id] = scan_status
        return scan_status

    def update_scan(self, scan_id: UUID, **kwargs):
        """Update scan progress."""
        if scan_id not in self._scans:
            return

        scan = self._scans[scan_id]

        if "files_scanned" in kwargs:
            scan.files_scanned = kwargs["files_scanned"]
        if "files_added" in kwargs:
            scan.files_added = kwargs["files_added"]
        if "files_skipped" in kwargs:
            scan.files_skipped = kwargs["files_skipped"]
        if "error" in kwargs:
            if scan.errors is None:
                scan.errors = []
            scan.errors.append(kwargs["error"])
        if "progress" in kwargs:
            scan.progress = kwargs["progress"]
        if "status" in kwargs:
            scan.status = kwargs["status"]
        if "message" in kwargs:
            scan.message = kwargs["message"]

    def complete_scan(self, scan_id: UUID):
        """Mark scan as completed."""
        if scan_id in self._scans:
            self._scans[scan_id].status = Status.COMPLETED
            self._scans[scan_id].progress = 100.0
            self._scans[scan_id].message = "Scan completed"

    def fail_scan(self, scan_id: UUID, error: str):
        """Mark scan as failed."""
        if scan_id in self._scans:
            self._scans[scan_id].status = Status.FAILED
            self._scans[scan_id].message = f"Scan failed: {error}"
            if self._scans[scan_id].errors is None:
                self._scans[scan_id].errors = []
            self._scans[scan_id].errors.append(error)

    def get_scan_status(self, scan_id: UUID) -> ScanStatusResponse:
        """Get current scan status."""
        return self._scans.get(scan_id)


# Global progress tracker
scan_tracker = ScanProgressTracker()
