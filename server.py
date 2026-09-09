#!/usr/bin/env python3
"""
2026/12 沖繩冬日海風自由行 - 本地輕量預覽伺服器
執行方式：python3 server.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server():
    global PORT
    while PORT < 8100:
        try:
            with socketserver.TCPServer(("", PORT), Handler) as httpd:
                url = f"http://localhost:{PORT}"
                print("=" * 60)
                print(f"🌺 2026/12 沖繩冬日海風自由行 介紹網站伺服器已啟動！")
                print(f"🔗 本地網址: {url}")
                print(f"📁 根目錄: {DIRECTORY}")
                print(f"💡 按 Ctrl+C 可停止伺服器")
                print("=" * 60)
                webbrowser.open(url)
                httpd.serve_forever()
        except OSError:
            PORT += 1

if __name__ == "__main__":
    run_server()
