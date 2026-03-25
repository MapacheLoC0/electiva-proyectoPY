from fastapi import FastAPI, Depends, HTTPException
from .database import get_connection
from psycopg2.extras import RealDictCursor

app = FastAPI(title="API ERP Ciudadela Desepaz")

# --- CREATE (Insertar Producto) ---
@app.post("/productos/")
def crear_producto(nombre: str, precio: float, id_cat: int, id_prov: int, stock: int = 0, conn = Depends(get_connection)):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        try:
            query = """
                INSERT INTO productos (nombre, precio, stock, id_categoria, id_proveedor)
                VALUES (%s, %s, %s, %s, %s) RETURNING *;
            """
            cur.execute(query, (nombre, precio, stock, id_cat, id_prov))
            nuevo = cur.fetchone()
            conn.commit()
            return nuevo
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=400, detail=f"Error en la BD: {e}")

# --- READ (Listar todos los productos con su categoría) ---
@app.get("/productos/")
def listar_productos(conn = Depends(get_connection)):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Aquí hacemos un JOIN para que el reporte sea más profesional
        query = """
            SELECT p.id_producto, p.nombre, p.precio, p.stock, c.nombre as categoria
            FROM productos p
            JOIN categorias c ON p.id_categoria = c.id_categoria
            WHERE p.estado = TRUE;
        """
        cur.execute(query)
        return cur.fetchall()

# --- UPDATE (Actualizar Stock) ---
@app.put("/productos/{id_prod}/stock")
def actualizar_stock(id_prod: int, nuevo_stock: int, conn = Depends(get_connection)):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("UPDATE productos SET stock = %s WHERE id_producto = %s RETURNING *;", (nuevo_stock, id_prod))
        actualizado = cur.fetchone()
        conn.commit()
        if not actualizado:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return actualizado