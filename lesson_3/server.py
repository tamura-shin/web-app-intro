from fastapi import FastAPI, Response
from fastapi.responses import HTMLResponse
import os
import uvicorn
import mimetypes

app = FastAPI()

BASE_DIR = os.path.dirname(__file__)


# ここから下は書き換えない
@app.get("/", response_class=HTMLResponse)
async def read_html():
    html_file_path = os.path.join(BASE_DIR, "client.html")
    with open(html_file_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/style.css")
def read_css():
    css_file_path = os.path.join(BASE_DIR, "style.css")
    with open(css_file_path, "r", encoding="utf-8") as f:
        css_content = f.read()
    return Response(content=css_content, media_type="text/css")


@app.get("/assets/{filename}")
async def read_asset(filename: str):
    asset_path = os.path.join(BASE_DIR, "assets", filename)

    # Check if the file exists and is actually a file (not a directory)
    if not os.path.exists(asset_path) or not os.path.isfile(asset_path):
        return Response(status_code=404)

    # Guess the MIME type of the file
    media_type, _ = mimetypes.guess_type(asset_path)
    if media_type is None:
        # Default to octet-stream if MIME type cannot be guessed
        media_type = "application/octet-stream"

    # Read the file content in binary mode
    with open(asset_path, "rb") as f:
        content = f.read()

    return Response(content=content, media_type=media_type)


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
