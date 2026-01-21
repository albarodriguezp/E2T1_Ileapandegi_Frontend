import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import InicioView from '../views/InicioView.vue'
import InventarioView from '../views/InventarioView.vue'
import ClientesView from '../views/ClientesView.vue'
import PortfolioView from '../views/PortfolioView.vue'
import CitasView from '../views/CitasView.vue'
import PerfilView from '../views/PerfilView.vue'

const routes = [
  { path: '/', name: 'login', component: LoginView },
  { path: '/home', name: 'inicio', component: InicioView, meta: { requiresAuth: true } },
  { path: '/inventario', name: 'inventario', component: InventarioView, meta: { requiresAuth: true } },
  { path: '/clientes', name: 'clientes', component: ClientesView, meta: { requiresAuth: true } },
  { path: '/portfolio', name: 'portfolio', component: PortfolioView, meta: { requiresAuth: true } },
  { path: '/citas', name: 'citas', component: CitasView, meta: { requiresAuth: true } },
  { path: '/perfil', name: 'perfil', component: PerfilView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ===== MODO DESARROLLO =====
// Cambia a false en producción para activar protección real
const isDev = true

router.beforeEach((to, from, next) => {
  if (isDev) return next()  // permite navegar a todas las rutas en desarrollo

  const token = localStorage.getItem('token')

  // Rutas protegidas: todas menos login
  if (to.name !== 'login' && !token) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token) {
    next({ name: 'inicio' }) // si ya logueado, ir a inicio
  } else {
    next()
  }
})

export default router
