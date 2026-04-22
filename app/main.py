from fastapi import FastAPI
from db import get_connection
from dotenv import load_dotenv
import os

from routes import router


load_dotenv()

app = FastAPI()

app.include_router(router)


@app.get("/", tags=["Sistema"])
def home():
    return {"mensaje": "API Sistema de Ventas funcionando"}


@app.get("/test-db", tags=["Sistema"])
def test_db():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM productos;")
        data = cursor.fetchall()

        cursor.close()
        conn.close()

        return {
            "conexion": "exitosa",
            "datos": data
        }

    except Exception as e:
        return {"error": str(e)}