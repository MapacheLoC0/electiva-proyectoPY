# 🛒 VentasOS — Frontend React

Frontend para el Sistema de Ventas construido con **React + Vite**, que consume la API FastAPI.

## Tecnologías
- React 18 + React Router v6
- Vite (dev server + build)
- Axios (HTTP client con interceptor JWT)
- Lucide React (iconos)

## Estructura
```
src/
├── context/       → AuthContext (JWT token)
├── services/      → api.js (todas las llamadas HTTP)
├── hooks/         → useCrud.js (hook reutilizable)
├── components/    → UI.jsx, ProtectedRoute.jsx
├── layouts/       → AppLayout.jsx (sidebar + main)
└── pages/
    ├── LoginPage.jsx
    ├── DashboardPage.jsx
    ├── ClientesPage.jsx
    ├── CategoriasPage.jsx
    ├── ProveedoresPage.jsx
    ├── ProductosPage.jsx
    ├── OrdenesPage.jsx
    ├── PagosPage.jsx
    └── DetallePage.jsx
```

## Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Asegúrate de que tu API FastAPI corre en localhost:8000
#    El proxy de Vite redirige /api → http://localhost:8000

# 3. Iniciar en desarrollo
npm run dev

# 4. Build para producción
npm run build
```

## Configuración

El proxy está en `vite.config.js`. Si tu API corre en otro puerto, cámbialo ahí.

Si vas a deployar en producción (sin Vite), cambia `BASE_URL` en `src/services/api.js`.

## Funcionalidades
- ✅ Login / Registro con JWT
- ✅ Rutas protegidas
- ✅ Dashboard con estadísticas
- ✅ CRUD completo: Clientes, Categorías, Proveedores, Productos, Órdenes, Pagos, Detalle Orden
- ✅ Búsqueda en Clientes
- ✅ Autocompletado de precio en Detalle Orden
- ✅ Estados con badges de color
- ✅ Confirmación antes de eliminar
- ✅ Skeleton loading
