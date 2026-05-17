import axios from 'axios'

const API = 'http://127.0.0.1:8000/api'

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const obtenerKPIs = async () => {
  const [
    ventas,
    clientes,
    productos,
    ordenes
  ] = await Promise.all([
    axios.get(`${API}/kpi/ventas`, authHeaders()),
    axios.get(`${API}/kpi/clientes`, authHeaders()),
    axios.get(`${API}/kpi/productos`, authHeaders()),
    axios.get(`${API}/kpi/ordenes`, authHeaders())
  ])

  return {
    ventas_totales: ventas.data.total_ventas,
    clientes: clientes.data.total_clientes,
    productos: productos.data.total_productos,
    ordenes: ordenes.data.total_ordenes
  }
}