import { useState } from 'react'
import { Truck, Plus, Pencil, Trash2 } from 'lucide-react'
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../services/api'
import { useCrud } from '../hooks/useCrud'
import { Modal, Alert, PageHeader, Card, EmptyState, ConfirmDialog, LoadingRow } from '../components/UI'

const empty = { nombre: '', telefono: '', email: '', direccion: '', ciudad: '', contacto: '' }

export default function ProveedoresPage() {
  const { data: proveedores, loading, refetch } = useCrud(getProveedores)
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
      if (modal === 'create') await createProveedor(form)
      else await updateProveedor(selected.id_proveedor, form)
      await refetch(); closeModal()
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deleteProveedor(confirmId); await refetch() } catch {}
    setConfirmId(null)
  }

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <PageHeader
        title="Proveedores"
        subtitle={`${proveedores.length} registros`}
        action={<button className="btn btn-accent" onClick={openCreate}><Plus size={15} /> Nuevo proveedor</button>}
      />

      <Card>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Nombre</th><th>Ciudad</th><th>Teléfono</th><th>Email</th><th>Contacto</th><th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? <LoadingRow cols={7} /> : proveedores.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon={Truck} message="No hay proveedores registrados" /></td></tr>
              ) : proveedores.map(p => (
                <tr key={p.id_proveedor}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{p.id_proveedor}</span></td>
                  <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.ciudad || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.telefono || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.email || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.contacto || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}><Pencil size={13} /></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmId(p.id_proveedor)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal === 'create' ? 'Nuevo proveedor' : 'Editar proveedor'} onClose={closeModal}>
          <form className="modal-form" onSubmit={handleSave}>
            <Alert type="error" message={error} />
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="modal-grid">
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input className="form-input" name="ciudad" value={form.ciudad || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" name="telefono" value={form.telefono || ''} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" type="email" value={form.email || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input className="form-input" name="direccion" value={form.direccion || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Persona de contacto</label>
              <input className="form-input" name="contacto" value={form.contacto || ''} onChange={handleChange} />
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
          message="¿Eliminar este proveedor?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
