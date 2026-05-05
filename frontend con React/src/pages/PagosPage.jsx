import { useState } from 'react'
import { CreditCard, Plus, Pencil, Trash2 } from 'lucide-react'
import { getPagos, createPago, updatePago, deletePago, getOrdenes } from '../services/api'
import { useCrud } from '../hooks/useCrud'
import { Modal, Alert, PageHeader, Card, EmptyState, ConfirmDialog, LoadingRow } from '../components/UI'

const empty = { id_orden: '', monto: '', metodo_pago: 'efectivo', estado_pago: 'pendiente' }
const metodos = ['efectivo', 'tarjeta', 'transferencia']
const estadosPago = ['pendiente', 'completado', 'fallido']
const estadoTag = { pendiente: 'tag-amber', completado: 'tag-green', fallido: 'tag-red' }

export default function PagosPage() {
  const { data: pagos, loading, refetch } = useCrud(getPagos)
  const { data: ordenes } = useCrud(getOrdenes)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const openCreate = () => { setForm(empty); setError(''); setModal('create') }
  const openEdit = (p) => { setForm(p); setSelected(p); setError(''); setModal('edit') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload = { ...form, id_orden: parseInt(form.id_orden), monto: parseFloat(form.monto) }
      if (modal === 'create') await createPago(payload)
      else await updatePago(selected.id_pago, payload)
      await refetch(); closeModal()
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deletePago(confirmId); await refetch() } catch {}
    setConfirmId(null)
  }

  const totalCompletado = pagos
    .filter(p => p.estado_pago === 'completado')
    .reduce((s, p) => s + parseFloat(p.monto || 0), 0)

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <PageHeader
        title="Pagos"
        subtitle={`${pagos.length} registros · Total completado: $${totalCompletado.toLocaleString('es-CO')}`}
        action={<button className="btn btn-accent" onClick={openCreate}><Plus size={15} /> Nuevo pago</button>}
      />

      <Card>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Orden</th><th>Monto</th><th>Método</th><th>Estado</th><th>Fecha</th><th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? <LoadingRow cols={7} /> : pagos.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon={CreditCard} message="No hay pagos registrados" /></td></tr>
              ) : pagos.map(p => (
                <tr key={p.id_pago}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{p.id_pago}</span></td>
                  <td><span className="tag tag-default">Orden #{p.id_orden}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--accent)' }}>
                    ${parseFloat(p.monto).toLocaleString('es-CO')}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{p.metodo_pago}</td>
                  <td><span className={`tag ${estadoTag[p.estado_pago] || 'tag-default'}`}>{p.estado_pago}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    {p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString('es-CO') : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}><Pencil size={13} /></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmId(p.id_pago)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal === 'create' ? 'Nuevo pago' : 'Editar pago'} onClose={closeModal}>
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
              <label className="form-label">Monto *</label>
              <input className="form-input" name="monto" type="number" step="0.01" min="0" value={form.monto} onChange={handleChange} required />
            </div>
            <div className="modal-grid">
              <div className="form-group">
                <label className="form-label">Método de pago</label>
                <select className="form-input" name="metodo_pago" value={form.metodo_pago} onChange={handleChange}>
                  {metodos.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-input" name="estado_pago" value={form.estado_pago} onChange={handleChange}>
                  {estadosPago.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog message="¿Eliminar este pago?" onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />
      )}
    </div>
  )
}
