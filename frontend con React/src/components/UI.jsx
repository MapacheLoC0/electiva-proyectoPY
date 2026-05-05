import { X, AlertCircle, CheckCircle, Loader } from 'lucide-react'

export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Alert({ type = 'error', message }) {
  if (!message) return null
  const Icon = type === 'error' ? AlertCircle : CheckCircle
  return (
    <div className={`alert alert-${type}`}>
      <Icon size={15} />
      <span>{message}</span>
    </div>
  )
}

export function Spinner({ size = 18 }) {
  return (
    <div style={{
      width: size, height: size,
      border: '2px solid var(--border-strong)',
      borderTopColor: 'var(--accent)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      display: 'inline-block'
    }} />
  )
}

export function EmptyState({ icon: Icon, message }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={36} strokeWidth={1} color="var(--text-muted)" />}
      <p>{message || 'No hay datos'}</p>
    </div>
  )
}

export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--red-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <AlertCircle size={22} color="var(--red)" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 6 }}>Confirmar eliminación</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{message}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onCancel}>Cancelar</button>
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={onConfirm}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          {title}
        </h1>
        {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      ...style
    }}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, color = 'var(--accent)', icon: Icon }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      {Icon && (
        <div style={{
          width: 42, height: 42,
          borderRadius: 'var(--radius-md)',
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon size={18} color={color} />
        </div>
      )}
      <div>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{value}</div>
      </div>
    </div>
  )
}

export function LoadingRow({ cols = 5 }) {
  return (
    <>
      {[1,2,3,4,5].map(i => (
        <tr key={i} style={{ animation: `pulse 1.5s ease infinite`, animationDelay: `${i * 0.1}s` }}>
          {Array(cols).fill(0).map((_, j) => (
            <td key={j}>
              <div style={{ height: 14, background: 'var(--bg-hover)', borderRadius: 4, width: j === 0 ? '60%' : '80%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
