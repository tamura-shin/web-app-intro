import os
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import uvicorn


app = FastAPI()
BASE_DIR = os.path.dirname(__file__)


@app.get("/", response_class=HTMLResponse)
async def read_html():
    html_file_path = os.path.join(BASE_DIR, "sample.html")
    with open(html_file_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)


if __name__ == "__main__":
    uvicorn.run("sample:app", host="127.0.0.1", port=8000, reload=True)
