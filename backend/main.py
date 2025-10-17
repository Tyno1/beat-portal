"""
This is the main file for the backend of the application.
"""

from typing import Union

from fastapi import FastAPI

app = FastAPI()


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
