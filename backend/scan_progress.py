"""
Progress tracking for library scan operations.
"""
from typing import Dict
from uuid import UUID

from models import Status, ScanStatusResponse


class ScanProgressTracker:
    """Tracks progress of library scan operations."""

    def __init__(self):
        self._scans: Dict[UUID, ScanStatusResponse] = {}

    def create_scan(self, scan_id: UUID) -> ScanStatusResponse:
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
        )
        self._scans[scan_id] = scan_status
        return scan_status

    def update_scan(self, scan_id: UUID, files_scanned: int = None,
                   files_added: int = None, files_skipped: int = None,
                   error: str = None, progress: float = None,
                   status: Status = None, message: str = None):
        """Update scan progress."""
        if scan_id not in self._scans:
            return

        scan = self._scans[scan_id]

        if files_scanned is not None:
            scan.files_scanned = files_scanned
        if files_added is not None:
            scan.files_added = files_added
        if files_skipped is not None:
            scan.files_skipped = files_skipped
        if error is not None:
            if scan.errors is None:
                scan.errors = []
            scan.errors.append(error)
        if progress is not None:
            scan.progress = progress
        if status is not None:
            scan.status = status
        if message is not None:
            scan.message = message

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
