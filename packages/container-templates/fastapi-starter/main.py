from fastapi import FastAPI
from fastapi.responses import JSONResponse
import sqlite3
import os
from datetime import datetime

app = FastAPI(title="CLI FastAPI Starter", version="1.0.0")

DB_PATH = os.environ.get("DATABASE_URL", "sqlite:///data/app.db").replace("sqlite:///", "")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.on_event("startup")
def startup():
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

@app.get("/")
def root():
    return {
        "status": "ok",
        "platform": "CLI",
        "message": "FastAPI backend is running. Ready for your AI app.",
        "docs": "/docs",
    }

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/items")
def list_items():
    conn = get_db()
    rows = conn.execute("SELECT * FROM items ORDER BY id DESC LIMIT 50").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/items")
def create_item(name: str):
    conn = get_db()
    cursor = conn.execute("INSERT INTO items (name) VALUES (?)", (name,))
    conn.commit()
    item_id = cursor.lastrowid
    row = conn.execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    return dict(row)
