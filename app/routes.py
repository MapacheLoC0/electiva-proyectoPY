from fastapi import APIRouter
from db import get_connection
from models import *
router = APIRouter(prefix="/api", tags=["Sistema Ventas"])

#CLIENTES
# Crear Cliente
@router.post("/clientes")
def crear_cliente(cliente: Cliente):

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

# Ver Clientes
@router.get("/clientes")
def obtener_clientes():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM clientes")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado

# Actualizar Cliente
@router.put("/clientes/{id_cliente}")
def actualizar_cliente(id_cliente: int, cliente: Cliente):

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

# Eliminar Cliente
@router.delete("/clientes/{id_cliente}")
def eliminar_cliente(id_cliente: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM clientes WHERE id_cliente=%s", (id_cliente,))

    conn.commit()
    cursor.close()
    conn.close()

    return {"mensaje": "Cliente eliminado"}

#CATEGORIAS

@router.post("/categorias")
def crear_categoria(categoria: Categoria):

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
def obtener_categorias():

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
def actualizar_categoria(id_categoria: int, categoria: Categoria):

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
def eliminar_categoria(id_categoria: int):

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

# POST
@router.post("/proveedores")
def crear_proveedor(proveedor: Proveedor):

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


# GET
@router.get("/proveedores")
def obtener_proveedores():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM proveedores")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


# PUT
@router.put("/proveedores/{id_proveedor}")
def actualizar_proveedor(id_proveedor: int, proveedor: Proveedor):

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


# DELETE
@router.delete("/proveedores/{id_proveedor}")
def eliminar_proveedor(id_proveedor: int):

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

# POST
@router.post("/productos")
def crear_producto(producto: Producto):

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


# GET
@router.get("/productos")
def obtener_productos():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM productos")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


# PUT
@router.put("/productos/{id_producto}")
def actualizar_producto(id_producto: int, producto: Producto):

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


# DELETE
@router.delete("/productos/{id_producto}")
def eliminar_producto(id_producto: int):

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

# POST
@router.post("/ordenes")
def crear_orden(orden: Orden):

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


# GET
@router.get("/ordenes")
def obtener_ordenes():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM ordenes")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


# PUT
@router.put("/ordenes/{id_orden}")
def actualizar_orden(id_orden: int, orden: Orden):

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
    

# DELETE
@router.delete("/ordenes/{id_orden}")
def eliminar_orden(id_orden: int):

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

# POST
@router.post("/pagos")
def crear_pago(pago: Pago):

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


# GET
@router.get("/pagos")
def obtener_pagos():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM pagos")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


# PUT
@router.put("/pagos/{id_pago}")
def actualizar_pago(id_pago: int, pago: Pago):

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


# DELETE
@router.delete("/pagos/{id_pago}")
def eliminar_pago(id_pago: int):

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

# POST
@router.post("/detalle")
def crear_detalle(detalle: DetalleOrden):

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


# GET
@router.get("/detalle")
def obtener_detalle():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM detalle_orden")

    columnas = [col[0] for col in cursor.description]
    datos = cursor.fetchall()

    resultado = [dict(zip(columnas, fila)) for fila in datos]

    cursor.close()
    conn.close()

    return resultado


# PUT
@router.put("/detalle/{id_detalle}")
def actualizar_detalle(id_detalle: int, detalle: DetalleOrden):

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


# DELETE
@router.delete("/detalle/{id_detalle}")
def eliminar_detalle(id_detalle: int):

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