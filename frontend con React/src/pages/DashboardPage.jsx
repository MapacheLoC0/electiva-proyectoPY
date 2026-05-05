import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Package, ShoppingCart, CreditCard, Tag, Truck, FileText, ArrowRight } from 'lucide-react'
import { getClientes, getProductos, getOrdenes, getPagos, getCategorias, getProveedores } from '../services/api'
import { StatCard } from '../components/UI'

const modules = [
  { label: 'Clientes', to: '/clientes', icon: Users, color: 'var(--green)' },
  { label: 'Categorías', to: '/categorias', icon: Tag, color: 'var(--blue)' },
  { label: 'Proveedores', to: '/proveedores', icon: Truck, color: 'var(--amber)' },
  { label: 'Productos', to: '/productos', icon: Package, color: 'var(--accent)' },
  { label: 'Órdenes', to: '/ordenes', icon: ShoppingCart, color: 'var(--blue)' },
  { label: 'Pagos', to: '/pagos', icon: CreditCard, color: 'var(--green)' },
  { label: 'Detalle Orden', to: '/detalle', icon: FileText, color: 'var(--amber)' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ clientes: '-', productos: '-', ordenes: '-', ingresos: '-', categorias: '-', proveedores: '-' })

  useEffect(() => {
    const load = async () => {
      try {
        const [c, p, o, pg, cat, prov] = await Promise.allSettled([
          getClientes(), getProductos(), getOrdenes(), getPagos(), getCategorias(), getProveedores()
        ])
        const ingresos = pg.status === 'fulfilled'
          ? pg.value.data.filter(p => p.estado_pago === 'completado').reduce((s, p) => s + parseFloat(p.monto || 0), 0)
          : 0
        setStats({
          clientes: c.status === 'fulfilled' ? c.value.data.length : '?',
          productos: p.status === 'fulfilled' ? p.value.data.length : '?',
          ordenes: o.status === 'fulfilled' ? o.value.data.length : '?',
          ingresos: `$${ingresos.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`,
          categorias: cat.status === 'fulfilled' ? cat.value.data.length : '?',
          proveedores: prov.status === 'fulfilled' ? prov.value.data.length : '?',
        })
      } catch {}
    }
    load()
  }, [])

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--accent)', letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 8
        }}>
          Sistema de Ventas
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Resumen general del sistema
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 40 }}>
        <StatCard label="Clientes" value={stats.clientes} icon={Users} color="var(--green)" />
        <StatCard label="Productos" value={stats.productos} icon={Package} color="var(--accent)" />
        <StatCard label="Órdenes" value={stats.ordenes} icon={ShoppingCart} color="var(--blue)" />
        <StatCard label="Ingresos" value={stats.ingresos} icon={CreditCard} color="var(--green)" />
        <StatCard label="Categorías" value={stats.categorias} icon={Tag} color="var(--blue)" />
        <StatCard label="Proveedores" value={stats.proveedores} icon={Truck} color="var(--amber)" />
      </div>

      {/* Modules grid */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>
          Módulos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {modules.map(({ label, to, icon: Icon, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                textAlign: 'left',
                transition: 'all var(--transition)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${color}40`
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: 36, height: 36,
                borderRadius: 'var(--radius-sm)',
                background: `${color}15`,
                border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={16} color={color} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
                <ArrowRight size={13} color="var(--text-muted)" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
