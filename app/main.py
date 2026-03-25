from fastapi import FastAPI, HTTPException
from database import obtener_conexion
from psycopg2.extras import RealDictCursor

app = FastAPI(title="Sistema ERP Pro")

@app.get("/productos")
def leer_productos():
    # 1. Llamamos a la conexión
    conexion = obtener_conexion()
    if conexion is None:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

    try:
        # 2. Creamos el cursor (usamos RealDictCursor para recibir diccionarios)
        cur = conexion.cursor(cursor_factory=RealDictCursor)
        
        # 3. Ejecutamos la consulta basada en tu tabla.sql
        cur.execute("SELECT id_producto, nombre, precio, stock FROM productos WHERE estado = TRUE;")
        productos = cur.fetchall()
        
        return productos

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    finally:
        # 4. Cerramos todo (como en tu imagen)
        cur.close()
        conexion.close()
        print("🔌 Conexión finalizada")