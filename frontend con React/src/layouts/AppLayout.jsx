import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, Tag, Truck, Package,
  ShoppingCart, CreditCard, FileText, LogOut, Menu, X
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/categorias', icon: Tag, label: 'Categorías' },
  { to: '/proveedores', icon: Truck, label: 'Proveedores' },
  { to: '/productos', icon: Package, label: 'Productos' },
  { to: '/ordenes', icon: ShoppingCart, label: 'Órdenes' },
  { to: '/pagos', icon: CreditCard, label: 'Pagos' },
  { to: '/detalle', icon: FileText, label: 'Detalle Orden' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div style={{
        padding: '18px 20px 16px',
        borderBottom: '1px solid var(--border)',
        marginBottom: 8
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10, letterSpacing: 3,
          color: 'var(--accent)',
          textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
          VentasWJ
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 10px', flex: 1 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', padding: '6px 10px', marginBottom: 4 }}>
          Módulos
        </div>
        {navItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13,
              fontWeight: 400,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
              marginBottom: 2,
              transition: 'all var(--transition)',
              textDecoration: 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={15} color={isActive ? 'var(--accent)' : 'var(--text-muted)'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 10px',
      }}>
        <div style={{
          padding: '10px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-hover)',
          marginBottom: 6
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>Sesión activa</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user || 'Usuario'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13, color: 'var(--text-secondary)',
            background: 'none', border: 'none', cursor: 'pointer',
            transition: 'color var(--transition)',
            fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100vh',
        overflow: 'hidden',
      }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 100,
            display: 'flex'
          }}
          onClick={() => setMobileOpen(false)}
        >
          <aside
            style={{
              width: 240, height: '100%',
              background: 'var(--bg-panel)',
              borderRight: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column',
              animation: 'fadeUp 0.2s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile topbar */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-panel)',
          flexShrink: 0
        }} className="mobile-topbar">
          <button className="btn btn-ghost btn-icon" onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase' }}>
            VentasOS
          </span>
          <div style={{ width: 32 }} />
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '32px 36px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
