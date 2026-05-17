import { useState } from 'react'
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../services/api'
import { useCrud } from '../hooks/useCrud'
import { Modal, Alert, PageHeader, Card, EmptyState, ConfirmDialog, LoadingRow } from '../components/UI'

const empty = { nombre: '', descripcion: '', estado: true }

export default function CategoriasPage() {
  const { data: categorias, loading, refetch } = useCrud(getCategorias)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const openCreate = () => { setForm(empty); setError(''); setModal('create') }
  const openEdit = (c) => { setForm(c); setSelected(c); setError(''); setModal('edit') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      if (modal === 'create') await createCategoria(form)
      else await updateCategoria(selected.id_categoria, form)
      await refetch(); closeModal()
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deleteCategoria(confirmId); await refetch() } catch {}
    setConfirmId(null)
  }

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <PageHeader
        title="Categorías"
        subtitle={`${categorias.length} registros`}
        action={<button className="btn btn-accent" onClick={openCreate}><Plus size={15} /> Nueva categoría</button>}
      />

      <Card>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? <LoadingRow cols={5} /> : categorias.length === 0 ? (
                <tr><td colSpan={5}><EmptyState icon={Tag} message="No hay categorías registradas" /></td></tr>
              ) : categorias.map(c => (
                <tr key={c.id_categoria}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{c.id_categoria}</span></td>
                  <td style={{ fontWeight: 500 }}>{c.nombre}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.descripcion || '—'}</td>
                  <td>
                    <span className={`tag ${c.estado ? 'tag-green' : 'tag-red'}`}>
                      {c.estado ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(c)}><Pencil size={13} /></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmId(c.id_categoria)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal === 'create' ? 'Nueva categoría' : 'Editar categoría'} onClose={closeModal}>
          <form className="modal-form" onSubmit={handleSave}>
            <Alert type="error" message={error} />
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-input" name="descripcion" value={form.descripcion || ''} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="estado" name="estado" checked={form.estado} onChange={handleChange} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
              <label htmlFor="estado" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>Categoría activa</label>
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
          message="¿Eliminar esta categoría? Los productos vinculados podrían verse afectados."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}