import axios from 'axios'

const API = 'http://127.0.0.1:8000/api'

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const obtenerKPIs = async () => {
  const [
    productoMasVendido,
    stockBajo,
    ultimaOrden
  ] = await Promise.all([
    axios.get(`${API}/kpi/productos-mas-vendidos`, authHeaders()),
    axios.get(`${API}/kpi/stock-bajo`, authHeaders()),
    axios.get(`${API}/kpi/ultima-orden`, authHeaders())
  ])

  return {
    producto_mas_vendido:
      productoMasVendido.data.producto,

    stock_bajo:
      stockBajo.data.length > 0
        ? stockBajo.data.map(p => `${p.producto} (${p.stock})`).join(', ')
        : 'Sin stock bajo',

    ultima_orden:
      ultimaOrden.data.ultima_orden
  }
}