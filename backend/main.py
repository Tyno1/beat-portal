"""
This is the main file for the backend of the application.
"""

from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


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


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    """
    This is the item endpoint of the application.
    """
    return {"item_id": item_id, "q": q}
    # End-of-file (EOF)
