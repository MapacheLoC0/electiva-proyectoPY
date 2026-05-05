import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login, registro } from '../services/api'
import { Alert } from '../components/UI'
import { ShoppingCart, Zap } from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ nombre: '', correo: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await login(form.correo, form.password)
        authLogin(res.data.access_token, form.correo)
        navigate('/')
      } else {
        await registro(form.nombre, form.correo, form.password)
        setSuccess('Cuenta creada. Ahora puedes iniciar sesión.')
        setMode('login')
        setForm(f => ({ ...f, nombre: '' }))
      }
    } catch (e) {
      setError(e.response?.data?.detail || 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(232,255,71,0.06) 0%, transparent 70%)',
        top: -100, right: -100,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(62,207,142,0.05) 0%, transparent 70%)',
        bottom: -50, left: 100,
        pointerEvents: 'none'
      }} />

      {/* Left panel */}
      <div style={{
        flex: 1,
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        borderRight: '1px solid var(--border)',
        background: 'var(--bg-panel)',
        '@media(min-width:768px)': { display: 'flex' }
      }} className="left-panel">
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--accent)', letterSpacing: 3,
            textTransform: 'uppercase', marginBottom: 32
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
            VentasOS v1.0
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 42, fontWeight: 700,
            lineHeight: 1.1, marginBottom: 16,
            color: 'var(--text-primary)'
          }}>
            Sistema de<br />
            <span style={{ color: 'var(--accent)' }}>Ventas</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 340 }}>
            Gestiona clientes, productos, órdenes y pagos desde un solo lugar.
          </p>
        </div>

        {[
          { icon: ShoppingCart, label: 'Gestión de inventario completa' },
          { icon: Zap, label: 'Procesamiento de órdenes en tiempo real' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 18px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            marginBottom: 10
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Icon size={15} color="var(--accent)" />
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Right panel - Form */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        margin: '0 auto'
      }}>
        <div style={{ width: '100%', animation: 'fadeUp 0.35s ease' }}>
          {/* Mobile logo */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--accent)', letterSpacing: 3,
            textTransform: 'uppercase', marginBottom: 32,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
            VentasOS
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
            {mode === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 32 }}>
            {mode === 'login' ? 'Ingresa tus credenciales para continuar' : 'Completa los datos para registrarte'}
          </p>

          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'registro' && (
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input className="form-input" name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="correo@ejemplo.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="form-input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            </div>

            <button className="btn btn-accent" type="submit" disabled={loading} style={{ marginTop: 8, padding: '12px 20px' }}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : (mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
            {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'registro' : 'login'); setError(''); setSuccess('') }}
              style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' }}
            >
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
