import { useState } from 'react'
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react'
import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/api'
import { useCrud } from '../hooks/useCrud'
import { Modal, Alert, PageHeader, Card, EmptyState, ConfirmDialog, LoadingRow } from '../components/UI'

const empty = { nombre: '', apellido: '', email: '', telefono: '', direccion: '' }

export default function ClientesPage() {
  const { data: clientes, loading, error: fetchError, refetch } = useCrud(getClientes)
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [search, setSearch] = useState('')

  const openCreate = () => { setForm(empty); setError(''); setModal('create') }
  const openEdit = (c) => { setForm(c); setSelected(c); setError(''); setModal('edit') }
  const closeModal = () => { setModal(null); setSelected(null) }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      if (modal === 'create') await createCliente(form)
      else await updateCliente(selected.id_cliente, form)
      await refetch()
      closeModal()
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await deleteCliente(confirmId)
      await refetch()
    } catch {}
    setConfirmId(null)
  }

  const filtered = clientes.filter(c =>
    `${c.nombre} ${c.apellido} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <PageHeader
        title="Clientes"
        subtitle={`${clientes.length} registros`}
        action={
          <button className="btn btn-accent" onClick={openCreate}>
            <Plus size={15} /> Nuevo cliente
          </button>
        }
      />

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
        <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          className="form-input"
          style={{ paddingLeft: 34 }}
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Registro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? <LoadingRow cols={7} /> : filtered.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon={Users} message="No hay clientes registrados" /></td></tr>
              ) : filtered.map(c => (
                <tr key={c.id_cliente}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{c.id_cliente}</span></td>
                  <td style={{ fontWeight: 500 }}>{c.nombre} {c.apellido}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.email || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.telefono || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.direccion || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.fecha_registro || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(c)} title="Editar">
                        <Pencil size={13} />
                      </button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmId(c.id_cliente)} title="Eliminar">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal === 'create' ? 'Nuevo cliente' : 'Editar cliente'} onClose={closeModal}>
          <form className="modal-form" onSubmit={handleSave}>
            <Alert type="error" message={error} />
            <div className="modal-grid">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Apellido *</label>
                <input className="form-input" name="apellido" value={form.apellido} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" type="email" value={form.email || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input className="form-input" name="telefono" value={form.telefono || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input className="form-input" name="direccion" value={form.direccion || ''} onChange={handleChange} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn btn-accent" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message="¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
