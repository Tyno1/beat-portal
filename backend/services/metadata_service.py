"""Service for analyzing audio metadata including BPM and key detection."""

import os
from typing import Optional, Dict, Any
from mutagen import File as MutagenFile

try:
    import librosa
    import numpy as np

    LIBROSA_AVAILABLE = True
except ImportError:
    LIBROSA_AVAILABLE = False


def analyze_bpm_from_audio(file_path: str) -> Optional[int]:
    """
    Analyze audio file to detect BPM using librosa.

    Args:
        file_path: Path to audio file

    Returns:
        Detected BPM as integer, or None if analysis fails
    """
    if not LIBROSA_AVAILABLE:
        return None

    if not os.path.exists(file_path):
        return None

    try:
        # Load audio file (librosa automatically handles resampling)
        y, sr = librosa.load(
            file_path, duration=60
        )  # Analyze first 60 seconds for speed

        # Use librosa's tempo detection
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

        # Round to nearest integer
        bpm = int(round(tempo))

        # Validate BPM range (typical music is 60-200 BPM)
        if 30 <= bpm <= 300:
            return bpm

        return None
    except (OSError, ValueError, RuntimeError):
        # If analysis fails (file errors, invalid audio, or librosa errors), return None
        return None


def analyze_key_from_audio(file_path: str) -> Optional[str]:
    """
    Analyze audio file to detect musical key using librosa.

    Args:
        file_path: Path to audio file

    Returns:
        Detected key as string (e.g., "C", "Am", "F#m"), or None if analysis fails
    """
    if not LIBROSA_AVAILABLE:
        return None

    if not os.path.exists(file_path):
        return None

    try:
        # Load audio file
        y, sr = librosa.load(file_path, duration=30)  # Analyze first 30 seconds

        # Extract chroma features (pitch class profile)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)

        # Average chroma across time
        chroma_mean = np.mean(chroma, axis=1)

        # Map chroma to key
        # Chroma order: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
        chroma_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

        # Find the strongest pitch class
        strongest_idx = np.argmax(chroma_mean)
        key = chroma_names[strongest_idx]

        # Determine if major or minor
        # Compare energy in major vs minor intervals
        # This is a simplified approach - more sophisticated methods exist
        # For now, default to major (can be enhanced later)

        return key
    except (OSError, ValueError, RuntimeError):
        # If analysis fails (file errors, invalid audio, or librosa errors), return None
        return None


def _extract_bpm_from_tags(tags) -> Optional[int]:
    """Extract BPM from audio file tags."""
    bpm_keys = ["TBPM", "BPM", "BPM "]
    for key in bpm_keys:
        if key in tags:
            try:
                bpm_str = str(tags[key][0])
                bpm = int(float(bpm_str))
                if 30 <= bpm <= 300:  # Validate range
                    return bpm
            except (ValueError, TypeError, IndexError):
                continue
    return None


def _extract_key_from_tags(tags) -> Optional[str]:
    """Extract musical key from audio file tags."""
    key_keys = ["TKEY", "KEY", "INITIALKEY", "KEY "]
    for key_tag in key_keys:
        if key_tag in tags:
            try:
                key = str(tags[key_tag][0]).strip().upper()
                if key:
                    return key
            except (IndexError, AttributeError):
                continue
    return None


def _read_metadata_from_tags(file_path: str) -> Dict[str, Any]:
    """Read BPM and key from audio file tags."""
    result = {"bpm": None, "key": None, "source": "none"}

    try:
        audio_file = MutagenFile(file_path)
        if audio_file and hasattr(audio_file, "tags") and audio_file.tags:
            tags = audio_file.tags

            # Extract BPM and key from tags
            bpm = _extract_bpm_from_tags(tags)
            key = _extract_key_from_tags(tags)

            if bpm or key:
                result["bpm"] = bpm
                result["key"] = key
                result["source"] = "tags"
    except (OSError, ValueError, AttributeError):
        # If tag reading fails (file errors or invalid format), return empty result
        pass

    return result


def _update_result_with_audio_analysis(
    result: Dict[str, Any], file_path: str
) -> Dict[str, Any]:
    """Update result with audio analysis if values are missing."""
    # Analyze BPM if missing
    if result["bpm"] is None:
        bpm = analyze_bpm_from_audio(file_path)
        if bpm:
            result["bpm"] = bpm
            if result["source"] == "none":
                result["source"] = "audio_analysis"
            elif result["source"] == "tags":
                result["source"] = "hybrid"

    # Analyze key if missing
    if result["key"] is None:
        key = analyze_key_from_audio(file_path)
        if key:
            result["key"] = key
            if result["source"] == "none":
                result["source"] = "audio_analysis"
            elif result["source"] == "tags":
                result["source"] = "hybrid"

    return result


def analyze_metadata(
    file_path: Optional[str] = None, use_audio_analysis: bool = True
) -> Dict[str, Any]:
    """
    Analyze metadata for a track using hybrid approach:
    1. First try reading from tags (fast)
    2. If missing and use_audio_analysis=True, analyze audio signal (slower)

    Args:
        file_path: Path to audio file
        use_audio_analysis: Whether to fall back to audio analysis if tags are missing

    Returns:
        Dictionary with detected metadata (bpm, key, etc.)
    """
    result = {"bpm": None, "key": None, "source": "none"}

    if not file_path or not os.path.exists(file_path):
        return result

    # Step 1: Try reading from tags (fast)
    result = _read_metadata_from_tags(file_path)

    # Step 2: If missing and audio analysis enabled, analyze audio signal
    if use_audio_analysis:
        result = _update_result_with_audio_analysis(result, file_path)

    return result
