from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import os
import uvicorn

# FastAPIアプリケーションインスタンスを作成
app = FastAPI()

# HTMLファイルへのパスを取得
html_file_path = os.path.join(os.path.dirname(__file__), "client.html")


@app.get("/", response_class=HTMLResponse)
async def read_html():
    """
    ルートパス ("/") へのGETリクエストに対して、
    指定されたHTMLファイルの内容を返すエンドポイント。
    """

    # HTMLファイルを読み込む
    with open(html_file_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    # HTMLResponseとして内容を返す
    return HTMLResponse(content=html_content, status_code=200)


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
