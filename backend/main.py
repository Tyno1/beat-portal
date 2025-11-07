"""
This is the main file for the backend of the application.
"""

from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ScanLibraryRequest, ScanLibraryResponse, LibraryOverview, Pagination, Playlist, PlaylistDetail, Track, TrackCreate, TrackUpdate, MetadataAnalysis, ConfidenceScores, DetectedMetadata


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1420", "http://127.0.0.1:1420"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """
    This is the root endpoint of the application.
    """
    return {"Hello": "World"}

@app.post("/library/scan")
def scan_library(request:):