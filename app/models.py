from pydantic import BaseModel
from typing import Optional


class Cliente(BaseModel):
    nombre: str
    apellido: str
    email: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None


class Categoria(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    estado: Optional[bool] = True


class Proveedor(BaseModel):
    nombre: str
    telefono: Optional[str] = None
    email: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    contacto: Optional[str] = None


class Producto(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    stock: int
    id_categoria: int
    id_proveedor: int
    imagen_url: Optional[str] = None
    estado: Optional[bool] = True


class Orden(BaseModel):
    id_cliente: int
    estado: Optional[str] = "pendiente"
    direc_envio: Optional[str] = None
    notas: Optional[str] = None


class Pago(BaseModel):
    id_orden: int
    monto: float
    metodo_pago: str
    estado_pago: Optional[str] = "pendiente"


class DetalleOrden(BaseModel):
    id_orden: int
    id_producto: int
    cantidad: int
    precio_unitario: float
    descuento: Optional[float] = 0