import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClientesPage from './pages/ClientesPage'
import CategoriasPage from './pages/CategoriasPage'
import ProveedoresPage from './pages/ProveedoresPage'
import ProductosPage from './pages/ProductosPage'
import OrdenesPage from './pages/OrdenesPage'
import PagosPage from './pages/PagosPage'
import DetallePage from './pages/DetallePage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="categorias" element={<CategoriasPage />} />
            <Route path="proveedores" element={<ProveedoresPage />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="ordenes" element={<OrdenesPage />} />
            <Route path="pagos" element={<PagosPage />} />
            <Route path="detalle" element={<DetallePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
