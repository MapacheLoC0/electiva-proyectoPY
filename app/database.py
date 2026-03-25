import psycopg2
from psycopg2.extras import RealDictCursor

def obtener_conexion():
    """
    Función basada en tu código para conectar con PostgreSQL.
    """
    try:
        conn = psycopg2.connect(
            database="nombre_db",  # Cambia por el nombre de tu DB
            user="tu_usuario",     # Tu usuario de Postgres
            password="tu_contraseña", 
            host="localhost",      # O la IP si la DB está en otro PC
            port="5432"
        )
        print("✅ Conexión exitosa a PostgreSQL")
        return conn
    except Exception as e:
        print(f"❌ Error al conectar: {e}")
        return None