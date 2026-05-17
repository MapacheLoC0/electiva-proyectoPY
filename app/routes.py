# IMPORTS
from fastapi import APIRouter, HTTPException, Depends
from db import get_connection
from models import *
from security import hash_password, verificar_password, crear_token
from auth import verificar_token


router = APIRouter(
    prefix="/api",
    tags=["Sistema Ventas"]
)

#Clientes
@router.post("/clientes")
def crear_cliente(
    cliente: Cliente,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO clientes
        (nombre, apellido, email, telefono, direccion)
        VALUES (%s,%s,%s,%s,%s)
    """, (
        cliente.nombre,
        cliente.apellido,
        cliente.email,
        cliente.telefono,
        cliente.direccion
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Cliente creado"}


@router.get("/clientes")
def obtener_clientes(
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM clientes")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


@router.put("/clientes/{id_cliente}")
def actualizar_cliente(
    id_cliente: int,
    cliente: Cliente,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE clientes
        SET nombre=%s,
            apellido=%s,
            email=%s,
            telefono=%s,
            direccion=%s
        WHERE id_cliente=%s
    """, (
        cliente.nombre,
        cliente.apellido,
        cliente.email,
        cliente.telefono,
        cliente.direccion,
        id_cliente
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Cliente actualizado"}


@router.delete("/clientes/{id_cliente}")
def eliminar_cliente(
    id_cliente: int,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM clientes WHERE id_cliente=%s",
        (id_cliente,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Cliente eliminado"}


#Categorias
@router.post("/categorias")
def crear_categoria(
    categoria: Categoria,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO categorias
        (nombre, descripcion, estado)
        VALUES (%s,%s,%s)
    """, (
        categoria.nombre,
        categoria.descripcion,
        categoria.estado
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Categoria creada"}


@router.get("/categorias")
def obtener_categorias(
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM categorias")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


@router.put("/categorias/{id_categoria}")
def actualizar_categoria(
    id_categoria: int,
    categoria: Categoria,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE categorias
        SET nombre=%s,
            descripcion=%s,
            estado=%s
        WHERE id_categoria=%s
    """, (
        categoria.nombre,
        categoria.descripcion,
        categoria.estado,
        id_categoria
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Categoria actualizada"}


@router.delete("/categorias/{id_categoria}")
def eliminar_categoria(
    id_categoria: int,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM categorias WHERE id_categoria=%s",
        (id_categoria,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Categoria eliminada"}


#Proveedores
@router.post("/proveedores")
def crear_proveedor(
    proveedor: Proveedor,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO proveedores
        (nombre, telefono, email, direccion, ciudad, contacto)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (
        proveedor.nombre,
        proveedor.telefono,
        proveedor.email,
        proveedor.direccion,
        proveedor.ciudad,
        proveedor.contacto
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Proveedor creado"}


@router.get("/proveedores")
def obtener_proveedores(
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM proveedores")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


@router.put("/proveedores/{id_proveedor}")
def actualizar_proveedor(
    id_proveedor: int,
    proveedor: Proveedor,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE proveedores
        SET nombre=%s,
            telefono=%s,
            email=%s,
            direccion=%s,
            ciudad=%s,
            contacto=%s
        WHERE id_proveedor=%s
    """, (
        proveedor.nombre,
        proveedor.telefono,
        proveedor.email,
        proveedor.direccion,
        proveedor.ciudad,
        proveedor.contacto,
        id_proveedor
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Proveedor actualizado"}


@router.delete("/proveedores/{id_proveedor}")
def eliminar_proveedor(
    id_proveedor: int,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM proveedores WHERE id_proveedor=%s",
        (id_proveedor,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Proveedor eliminado"}


#Productos
@router.post("/productos")
def crear_producto(
    producto: Producto,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO productos
        (nombre, descripcion, precio, stock,
        id_categoria, id_proveedor, imagen_url, estado)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
        producto.id_categoria,
        producto.id_proveedor,
        producto.imagen_url,
        producto.estado
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Producto creado"}


@router.get("/productos")
def obtener_productos(
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM productos")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


@router.put("/productos/{id_producto}")
def actualizar_producto(
    id_producto: int,
    producto: Producto,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE productos
        SET nombre=%s,
            descripcion=%s,
            precio=%s,
            stock=%s,
            id_categoria=%s,
            id_proveedor=%s,
            imagen_url=%s,
            estado=%s
        WHERE id_producto=%s
    """, (
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
        producto.id_categoria,
        producto.id_proveedor,
        producto.imagen_url,
        producto.estado,
        id_producto
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Producto actualizado"}


@router.delete("/productos/{id_producto}")
def eliminar_producto(
    id_producto: int,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM productos WHERE id_producto=%s",
        (id_producto,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Producto eliminado"}


#Ordenes
@router.post("/ordenes")
def crear_orden(
    orden: Orden,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO ordenes
        (id_cliente, estado, direc_envio, notas)
        VALUES (%s,%s,%s,%s)
    """, (
        orden.id_cliente,
        orden.estado,
        orden.direc_envio,
        orden.notas
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Orden creada"}


@router.get("/ordenes")
def obtener_ordenes(
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM ordenes")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


@router.put("/ordenes/{id_orden}")
def actualizar_orden(
    id_orden: int,
    orden: Orden,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE ordenes
        SET estado=%s,
            direc_envio=%s,
            notas=%s
        WHERE id_orden=%s
    """, (
        orden.estado,
        orden.direc_envio,
        orden.notas,
        id_orden
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Orden actualizada"}


@router.delete("/ordenes/{id_orden}")
def eliminar_orden(
    id_orden: int,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM ordenes WHERE id_orden=%s",
        (id_orden,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Orden eliminada"}


#Pagos
@router.post("/pagos")
def crear_pago(
    pago: Pago,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO pagos
        (id_orden, monto, metodo_pago, estado_pago)
        VALUES (%s,%s,%s,%s)
    """, (
        pago.id_orden,
        pago.monto,
        pago.metodo_pago,
        pago.estado_pago
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Pago registrado"}


@router.get("/pagos")
def obtener_pagos(
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM pagos")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


@router.put("/pagos/{id_pago}")
def actualizar_pago(
    id_pago: int,
    pago: Pago,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE pagos
        SET monto=%s,
            metodo_pago=%s,
            estado_pago=%s
        WHERE id_pago=%s
    """, (
        pago.monto,
        pago.metodo_pago,
        pago.estado_pago,
        id_pago
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Pago actualizado"}


@router.delete("/pagos/{id_pago}")
def eliminar_pago(
    id_pago: int,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM pagos WHERE id_pago=%s",
        (id_pago,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Pago eliminado"}


#Detalle Orden
@router.post("/detalle")
def crear_detalle(
    detalle: DetalleOrden,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO detalle_orden
        (id_orden, id_producto, cantidad, precio_unitario, descuento)
        VALUES (%s,%s,%s,%s,%s)
    """, (
        detalle.id_orden,
        detalle.id_producto,
        detalle.cantidad,
        detalle.precio_unitario,
        detalle.descuento
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Detalle agregado"}


@router.get("/detalle")
def obtener_detalle(
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM detalle_orden")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


@router.put("/detalle/{id_detalle}")
def actualizar_detalle(
    id_detalle: int,
    detalle: DetalleOrden,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE detalle_orden
        SET id_producto=%s,
            cantidad=%s,
            precio_unitario=%s,
            descuento=%s
        WHERE id_detalle=%s
    """, (
        detalle.id_producto,
        detalle.cantidad,
        detalle.precio_unitario,
        detalle.descuento,
        id_detalle
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Detalle actualizado"}


@router.delete("/detalle/{id_detalle}")
def eliminar_detalle(
    id_detalle: int,
    user=Depends(verificar_token)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM detalle_orden WHERE id_detalle=%s",
        (id_detalle,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Detalle eliminado"}


#Usuarios (Sin agregar el token)
@router.post("/usuarios/registro", tags=["Usuarios"])
def registrar_usuario(
    nombre: str,
    correo: str,
    password: str
):
    conn = get_connection()
    cursor = conn.cursor()

    password_hash = hash_password(password)

    cursor.execute("""
        INSERT INTO usuarios (nombre, correo, password)
        VALUES (%s, %s, %s)
    """, (
        nombre,
        correo,
        password_hash
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {
        "mensaje": "Usuario creado correctamente"
    }

#Login
@router.post("/usuarios/login", tags=["Usuarios"])
def login(
    correo: str,
    password: str
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id_usuario, password
        FROM usuarios
        WHERE correo = %s
        """,
        (correo,)
    )

    usuario = cursor.fetchone()

    if not usuario:
        raise HTTPException(
            status_code=400,
            detail="Usuario no existe"
        )

    if not verificar_password(password, usuario[1]):
        raise HTTPException(
            status_code=400,
            detail="Contraseña incorrecta"
        )

    token = crear_token({
        "sub": str(usuario[0])
    })

    cursor.close()
    conn.close()

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@router.get("/kpi/ventas", tags=["KPIs"])
def kpi_ventas(user=Depends(verificar_token)):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COALESCE(SUM(total),0)
        FROM ordenes
        WHERE estado = 'pagada'
    """)

    total = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return {
        "total_ventas": float(total)
    }

@router.get("/kpi/clientes", tags=["KPIs"])
def kpi_clientes(user=Depends(verificar_token)):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM clientes")

    total = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return {
        "total_clientes": total
    }

@router.get("/kpi/productos", tags=["KPIs"])
def kpi_productos(user=Depends(verificar_token)):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM productos")

    total = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return {
        "total_productos": total
    }

@router.get("/kpi/ordenes", tags=["KPIs"])
def kpi_ordenes(user=Depends(verificar_token)):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM ordenes")

    total = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return {
        "total_ordenes": total
    }

@router.get("/kpi/productos-mas-vendidos", tags=["KPIs"])
def productos_mas_vendidos(user=Depends(verificar_token)):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            p.nombre,
            SUM(d.cantidad) AS vendidos
        FROM detalle_orden d
        JOIN productos p
        ON d.id_producto = p.id_producto
        GROUP BY p.nombre
        ORDER BY vendidos DESC
        LIMIT 5
    """)

    data = cursor.fetchall()

    resultado = []

    for row in data:
        resultado.append({
            "producto": row[0],
            "vendidos": row[1]
        })

    cursor.close()
    conn.close()

    return resultado