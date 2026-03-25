import os
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

try:
    # Creamos una "piscina" de 1 a 10 conexiones
    db_pool = pool.SimpleConnectionPool(
        1, 10,
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME")
    )
    print("✅ Conexión exitosa al Pool de PostgreSQL")
except Exception as e:
    print(f"❌ Error al conectar: {e}")

def get_connection():
    conn = db_pool.getconn()
    try:
        yield conn
    finally:
        db_pool.putconn(conn)