"""
Utility functions for scanning and processing audio files.
"""
import os
from pathlib import Path
from typing import List, Tuple, Optional
from mutagen import File as MutagenFile
from mutagen.id3 import ID3NoHeaderError

from models import TrackCreate


AUDIO_EXTENSIONS = {'.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac', '.wma', '.mp4', '.m4p'}


def _get_file_props(file_path: str) -> dict:
    """Create file properties dictionary."""
    file_stat = os.stat(file_path)
    suffix = Path(file_path).suffix
    file_format = suffix[1:].lower() if suffix else None
    return {
        'file_size': file_stat.st_size,
        'file_format': file_format,
        'duration': None,
        'bitrate': None,
        'sample_rate': None,
    }


def _extract_tag(tags, keys):
    """Extract tag value using multiple possible keys."""
    for key in keys:
        if key in tags:
            return str(tags[key][0])
    return None


def _extract_year(tags):
    """Extract year from date tags."""
    year_keys = ['TDRC', 'DATE', '©day']
    for key in year_keys:
        if key in tags:
            try:
                year_str = str(tags[key][0])
                return int(year_str[:4])
            except (ValueError, IndexError):
                continue
    return None


def _extract_tags(audio_file):
    """Extract metadata tags from audio file."""
    title = None
    artist = None
    album = None
    genre = None

    if not (hasattr(audio_file, 'tags') and audio_file.tags):
        return title, artist, album, None, genre

    tags = audio_file.tags
    title = _extract_tag(tags, ['TIT2', 'TITLE', '©nam'])
    artist = _extract_tag(tags, ['TPE1', 'ARTIST', '©ART'])
    album = _extract_tag(tags, ['TALB', 'ALBUM', '©alb'])
    genre = _extract_tag(tags, ['TCON', 'GENRE', '©gen'])
    year = _extract_year(tags)

    return title, artist, album, year, genre


def _extract_audio_properties(audio_file, file_props):
    """Extract audio properties from file info."""
    if not hasattr(audio_file, 'info'):
        return

    info = audio_file.info
    if hasattr(info, 'length'):
        file_props['duration'] = int(info.length)
    if hasattr(info, 'bitrate'):
        file_props['bitrate'] = info.bitrate
    if hasattr(info, 'sample_rate'):
        file_props['sample_rate'] = int(info.sample_rate)


def _create_error_response(file_path: str, error_msg: str) -> Tuple[TrackCreate, str, dict]:
    """Create error response with minimal file info."""
    file_props = _get_file_props(file_path)
    return (
        TrackCreate(file_path=file_path, title=Path(file_path).stem),
        error_msg,
        file_props,
    )


def find_audio_files(root_path: str, include_subfolders: bool = True) -> List[str]:
    """
    Recursively find all audio files in the given directory.

    Args:
        root_path: Root directory to scan
        include_subfolders: Whether to scan subdirectories

    Returns:
        List of full file paths to audio files
    """
    audio_files = []
    root = Path(root_path)

    if not root.exists() or not root.is_dir():
        return audio_files

    if include_subfolders:
        # Recursive scan
        for ext in AUDIO_EXTENSIONS:
            audio_files.extend(root.rglob(f'*{ext}'))
            audio_files.extend(root.rglob(f'*{ext.upper()}'))
    else:
        # Only top-level directory
        for item in root.iterdir():
            if item.is_file() and item.suffix.lower() in AUDIO_EXTENSIONS:
                audio_files.append(item)

    return [str(f) for f in audio_files]


def extract_metadata(file_path: str) -> Tuple[TrackCreate, Optional[str], dict]:
    """
    Extract metadata from an audio file using mutagen.

    Args:
        file_path: Path to the audio file

    Returns:
        Tuple of (TrackCreate object, error message if any, file properties dict)
    """
    try:
        audio_file = MutagenFile(file_path)
        if audio_file is None:
            return _create_error_response(file_path, f"Unable to read file: {file_path}")

        file_props = _get_file_props(file_path)
        title, artist, album, year, genre = _extract_tags(audio_file)
        _extract_audio_properties(audio_file, file_props)

        if not title:
            title = Path(file_path).stem

        track_data = TrackCreate(
            file_path=file_path,
            title=title,
            artist=artist,
            album=album,
            year=year,
            genre=genre,
        )

        return track_data, None, file_props

    except ID3NoHeaderError:
        return _create_error_response(file_path, "No ID3 header found")
    except (OSError, IOError, ValueError) as e:
        return _create_error_response(file_path, f"Error reading metadata: {str(e)}")
