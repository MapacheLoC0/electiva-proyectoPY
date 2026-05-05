import { useState } from 'react'
import { FileText, Plus, Pencil, Trash2 } from 'lucide-react'
import { getDetalle, createDetalle, updateDetalle, deleteDetalle, getOrdenes, getProductos } from '../services/api'
import { useCrud } from '../hooks/useCrud'
import { Modal, Alert, PageHeader, Card, EmptyState, ConfirmDialog, LoadingRow } from '../components/UI'

const empty = { id_orden: '', id_producto: '', cantidad: '', precio_unitario: '', descuento: 0 }

export default function DetallePage() {
  const { data: detalle, loading, refetch } = useCrud(getDetalle)
  const { data: ordenes } = useCrud(getOrdenes)
  const { data: productos } = useCrud(getProductos)

  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const openCreate = () => { setForm(empty); setError(''); setModal('create') }
  const openEdit = (d) => { setForm(d); setSelected(d); setError(''); setModal('edit') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const autofillPrecio = (e) => {
    const id = parseInt(e.target.value)
    const prod = productos.find(p => p.id_producto === id)
    setForm(f => ({ ...f, id_producto: e.target.value, precio_unitario: prod ? prod.precio : f.precio_unitario }))
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        id_orden: parseInt(form.id_orden),
        id_producto: parseInt(form.id_producto),
        cantidad: parseInt(form.cantidad),
        precio_unitario: parseFloat(form.precio_unitario),
        descuento: parseFloat(form.descuento || 0),
      }
      if (modal === 'create') await createDetalle(payload)
      else await updateDetalle(selected.id_detalle, payload)
      await refetch(); closeModal()
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deleteDetalle(confirmId); await refetch() } catch {}
    setConfirmId(null)
  }

  const getProdName = id => productos.find(p => p.id_producto === id)?.nombre || `#${id}`

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <PageHeader
        title="Detalle de Órdenes"
        subtitle={`${detalle.length} líneas`}
        action={<button className="btn btn-accent" onClick={openCreate}><Plus size={15} /> Agregar ítem</button>}
      />

      <Card>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Orden</th><th>Producto</th><th>Cantidad</th><th>Precio unit.</th><th>Descuento</th><th>Subtotal</th><th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? <LoadingRow cols={8} /> : detalle.length === 0 ? (
                <tr><td colSpan={8}><EmptyState icon={FileText} message="No hay ítems de detalle" /></td></tr>
              ) : detalle.map(d => (
                <tr key={d.id_detalle}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{d.id_detalle}</span></td>
                  <td><span className="tag tag-default">Orden #{d.id_orden}</span></td>
                  <td style={{ fontWeight: 500 }}>{getProdName(d.id_producto)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{d.cantidad}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>${parseFloat(d.precio_unitario).toLocaleString('es-CO')}</td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {parseFloat(d.descuento || 0) > 0 ? `-$${parseFloat(d.descuento).toLocaleString('es-CO')}` : '—'}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 500 }}>
                    ${parseFloat(d.subtotal || 0).toLocaleString('es-CO')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(d)}><Pencil size={13} /></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmId(d.id_detalle)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal === 'create' ? 'Agregar ítem' : 'Editar ítem'} onClose={closeModal}>
          <form className="modal-form" onSubmit={handleSave}>
            <Alert type="error" message={error} />
            <div className="form-group">
              <label className="form-label">Orden *</label>
              <select className="form-input" name="id_orden" value={form.id_orden} onChange={handleChange} required>
                <option value="">Seleccionar orden...</option>
                {ordenes.map(o => <option key={o.id_orden} value={o.id_orden}>Orden #{o.id_orden} — {o.estado}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Producto *</label>
              <select className="form-input" name="id_producto" value={form.id_producto} onChange={autofillPrecio} required>
                <option value="">Seleccionar producto...</option>
                {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre} (Stock: {p.stock})</option>)}
              </select>
            </div>
            <div className="modal-grid">
              <div className="form-group">
                <label className="form-label">Cantidad *</label>
                <input className="form-input" name="cantidad" type="number" min="1" value={form.cantidad} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Precio unitario *</label>
                <input className="form-input" name="precio_unitario" type="number" step="0.01" min="0" value={form.precio_unitario} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Descuento</label>
              <input className="form-input" name="descuento" type="number" step="0.01" min="0" value={form.descuento || 0} onChange={handleChange} />
            </div>
            {form.cantidad && form.precio_unitario && (
              <div style={{
                padding: '12px 16px',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Subtotal estimado</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 600 }}>
                  ${Math.max(0, (parseFloat(form.cantidad) * parseFloat(form.precio_unitario)) - parseFloat(form.descuento || 0)).toLocaleString('es-CO')}
                </span>
              </div>
            )}
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog message="¿Eliminar este ítem del detalle?" onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />
      )}
    </div>
  )
}
