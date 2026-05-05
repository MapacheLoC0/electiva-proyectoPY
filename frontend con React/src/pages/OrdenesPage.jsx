import { useState } from 'react'
import { ShoppingCart, Plus, Pencil, Trash2 } from 'lucide-react'
import { getOrdenes, createOrden, updateOrden, deleteOrden, getClientes } from '../services/api'
import { useCrud } from '../hooks/useCrud'
import { Modal, Alert, PageHeader, Card, EmptyState, ConfirmDialog, LoadingRow } from '../components/UI'

const empty = { id_cliente: '', estado: 'pendiente', direc_envio: '', notas: '' }
const estados = ['pendiente', 'pagada', 'enviada', 'cancelada']
const estadoTag = { pendiente: 'tag-amber', pagada: 'tag-green', enviada: 'tag-blue', cancelada: 'tag-red' }

export default function OrdenesPage() {
  const { data: ordenes, loading, refetch } = useCrud(getOrdenes)
  const { data: clientes } = useCrud(getClientes)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const openCreate = () => { setForm(empty); setError(''); setModal('create') }
  const openEdit = (o) => { setForm(o); setSelected(o); setError(''); setModal('edit') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload = { ...form, id_cliente: parseInt(form.id_cliente) }
      if (modal === 'create') await createOrden(payload)
      else await updateOrden(selected.id_orden, payload)
      await refetch(); closeModal()
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deleteOrden(confirmId); await refetch() } catch {}
    setConfirmId(null)
  }

  const getClienteName = id => {
    const c = clientes.find(c => c.id_cliente === id)
    return c ? `${c.nombre} ${c.apellido}` : `#${id}`
  }

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <PageHeader
        title="Órdenes"
        subtitle={`${ordenes.length} registros`}
        action={<button className="btn btn-accent" onClick={openCreate}><Plus size={15} /> Nueva orden</button>}
      />

      <Card>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Dirección envío</th><th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? <LoadingRow cols={7} /> : ordenes.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon={ShoppingCart} message="No hay órdenes registradas" /></td></tr>
              ) : ordenes.map(o => (
                <tr key={o.id_orden}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{o.id_orden}</span></td>
                  <td style={{ fontWeight: 500 }}>{getClienteName(o.id_cliente)}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    {o.fecha_orden ? new Date(o.fecha_orden).toLocaleDateString('es-CO') : '—'}
                  </td>
                  <td><span className={`tag ${estadoTag[o.estado] || 'tag-default'}`}>{o.estado}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                    ${parseFloat(o.total || 0).toLocaleString('es-CO')}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.direc_envio || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(o)}><Pencil size={13} /></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmId(o.id_orden)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal === 'create' ? 'Nueva orden' : 'Editar orden'} onClose={closeModal}>
          <form className="modal-form" onSubmit={handleSave}>
            <Alert type="error" message={error} />
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <select className="form-input" name="id_cliente" value={form.id_cliente} onChange={handleChange} required>
                <option value="">Seleccionar cliente...</option>
                {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="form-input" name="estado" value={form.estado} onChange={handleChange}>
                {estados.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dirección de envío</label>
              <input className="form-input" name="direc_envio" value={form.direc_envio || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Notas</label>
              <textarea className="form-input" name="notas" value={form.notas || ''} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message="¿Eliminar esta orden? El detalle asociado también se eliminará (CASCADE)."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
