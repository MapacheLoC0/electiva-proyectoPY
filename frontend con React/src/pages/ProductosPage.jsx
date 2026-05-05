import { useState, useCallback } from 'react'
import { Package, Plus, Pencil, Trash2 } from 'lucide-react'
import { getProductos, createProducto, updateProducto, deleteProducto, getCategorias, getProveedores } from '../services/api'
import { useCrud } from '../hooks/useCrud'
import { Modal, Alert, PageHeader, Card, EmptyState, ConfirmDialog, LoadingRow } from '../components/UI'

const empty = { nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '', id_proveedor: '', imagen_url: '', estado: true }

export default function ProductosPage() {
  const { data: productos, loading, refetch } = useCrud(getProductos)
  const { data: categorias } = useCrud(getCategorias)
  const { data: proveedores } = useCrud(getProveedores)

  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const openCreate = () => { setForm(empty); setError(''); setModal('create') }
  const openEdit = (p) => { setForm(p); setSelected(p); setError(''); setModal('edit') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        id_categoria: parseInt(form.id_categoria),
        id_proveedor: parseInt(form.id_proveedor),
      }
      if (modal === 'create') await createProducto(payload)
      else await updateProducto(selected.id_producto, payload)
      await refetch(); closeModal()
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deleteProducto(confirmId); await refetch() } catch {}
    setConfirmId(null)
  }

  const getCatName = id => categorias.find(c => c.id_categoria === id)?.nombre || '—'
  const getProvName = id => proveedores.find(p => p.id_proveedor === id)?.nombre || '—'

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <PageHeader
        title="Productos"
        subtitle={`${productos.length} registros`}
        action={<button className="btn btn-accent" onClick={openCreate}><Plus size={15} /> Nuevo producto</button>}
      />

      <Card>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Proveedor</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? <LoadingRow cols={8} /> : productos.length === 0 ? (
                <tr><td colSpan={8}><EmptyState icon={Package} message="No hay productos registrados" /></td></tr>
              ) : productos.map(p => (
                <tr key={p.id_producto}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{p.id_producto}</span></td>
                  <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                    ${parseFloat(p.precio).toLocaleString('es-CO')}
                  </td>
                  <td>
                    <span className={`tag ${p.stock > 10 ? 'tag-green' : p.stock > 0 ? 'tag-amber' : 'tag-red'}`}>
                      {p.stock} uds
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{getCatName(p.id_categoria)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{getProvName(p.id_proveedor)}</td>
                  <td>
                    <span className={`tag ${p.estado ? 'tag-green' : 'tag-default'}`}>
                      {p.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}><Pencil size={13} /></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmId(p.id_producto)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal === 'create' ? 'Nuevo producto' : 'Editar producto'} onClose={closeModal}>
          <form className="modal-form" onSubmit={handleSave}>
            <Alert type="error" message={error} />
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-input" name="descripcion" value={form.descripcion || ''} onChange={handleChange} rows={2} style={{ resize: 'vertical' }} />
            </div>
            <div className="modal-grid">
              <div className="form-group">
                <label className="form-label">Precio *</label>
                <input className="form-input" name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Stock *</label>
                <input className="form-input" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
              </div>
            </div>
            <div className="modal-grid">
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <select className="form-input" name="id_categoria" value={form.id_categoria} onChange={handleChange} required>
                  <option value="">Seleccionar...</option>
                  {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Proveedor *</label>
                <select className="form-input" name="id_proveedor" value={form.id_proveedor} onChange={handleChange} required>
                  <option value="">Seleccionar...</option>
                  {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">URL Imagen</label>
              <input className="form-input" name="imagen_url" value={form.imagen_url || ''} onChange={handleChange} placeholder="https://..." />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="estado" name="estado" checked={form.estado} onChange={handleChange} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
              <label htmlFor="estado" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>Producto activo</label>
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
          message="¿Eliminar este producto?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
