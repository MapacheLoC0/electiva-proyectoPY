import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const login = (correo, password) =>
  api.post(`/api/usuarios/login?correo=${encodeURIComponent(correo)}&password=${encodeURIComponent(password)}`)

export const registro = (nombre, correo, password) =>
  api.post(`/api/usuarios/registro?nombre=${encodeURIComponent(nombre)}&correo=${encodeURIComponent(correo)}&password=${encodeURIComponent(password)}`)

// Clientes
export const getClientes = () => api.get('/api/clientes')
export const createCliente = (data) => api.post('/api/clientes', data)
export const updateCliente = (id, data) => api.put(`/api/clientes/${id}`, data)
export const deleteCliente = (id) => api.delete(`/api/clientes/${id}`)

// Categorías
export const getCategorias = () => api.get('/api/categorias')
export const createCategoria = (data) => api.post('/api/categorias', data)
export const updateCategoria = (id, data) => api.put(`/api/categorias/${id}`, data)
export const deleteCategoria = (id) => api.delete(`/api/categorias/${id}`)

// Proveedores
export const getProveedores = () => api.get('/api/proveedores')
export const createProveedor = (data) => api.post('/api/proveedores', data)
export const updateProveedor = (id, data) => api.put(`/api/proveedores/${id}`, data)
export const deleteProveedor = (id) => api.delete(`/api/proveedores/${id}`)

// Productos
export const getProductos = () => api.get('/api/productos')
export const createProducto = (data) => api.post('/api/productos', data)
export const updateProducto = (id, data) => api.put(`/api/productos/${id}`, data)
export const deleteProducto = (id) => api.delete(`/api/productos/${id}`)

// Órdenes
export const getOrdenes = () => api.get('/api/ordenes')
export const createOrden = (data) => api.post('/api/ordenes', data)
export const updateOrden = (id, data) => api.put(`/api/ordenes/${id}`, data)
export const deleteOrden = (id) => api.delete(`/api/ordenes/${id}`)

// Pagos
export const getPagos = () => api.get('/api/pagos')
export const createPago = (data) => api.post('/api/pagos', data)
export const updatePago = (id, data) => api.put(`/api/pagos/${id}`, data)
export const deletePago = (id) => api.delete(`/api/pagos/${id}`)

// Detalle Orden
export const getDetalle = () => api.get('/api/detalle')
export const createDetalle = (data) => api.post('/api/detalle', data)
export const updateDetalle = (id, data) => api.put(`/api/detalle/${id}`, data)
export const deleteDetalle = (id) => api.delete(`/api/detalle/${id}`)

export default api
