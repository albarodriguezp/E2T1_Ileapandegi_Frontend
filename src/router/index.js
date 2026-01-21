import { createRouter, createWebHistory } from 'vue-router'
import { checkAuth, logout } from '@/utils/auth'

import LoginView from '../views/LoginView.vue'
import InicioView from '../views/InicioView.vue'
import InventarioView from '../views/InventarioView.vue'
import ClientesView from '../views/ClientesView.vue'
import PortfolioView from '../views/PortfolioView.vue'
import CitasView from '../views/CitasView.vue'
import PerfilView from '../views/PerfilView.vue'

// =====================
// RUTAS
// =====================
const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'inicio',
    component: InicioView,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventario',
    name: 'inventario',
    component: InventarioView,
    meta: { requiresAuth: true }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: ClientesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: PortfolioView,
    meta: { requiresAuth: true }
  },
  {
    path: '/citas',
    name: 'citas',
    component: CitasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: PerfilView,
    meta: { requiresAuth: true }
  }
]

// =====================
// ROUTER
// =====================
const router = createRouter({
  history: createWebHistory(),
  routes
})

// =====================
// GUARD DE AUTENTICACIÓN
// =====================
router.beforeEach(async (to, from, next) => {

  // Si va al login, siempre dejar pasar
  if (to.name === 'login') {
    return next()
  }

  // Solo protegemos rutas que lo pidan
  if (to.meta.requiresAuth) {
    const isValid = await checkAuth()

    if (!isValid) {
      await logout()
      return next({ name: 'login' })
    }
  }

  next()
})

export default router
