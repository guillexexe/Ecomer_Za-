// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

import HomePage from '@/views/HomeView.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import AdminPage from '@/views/AdminPage.vue'
import StylesPanel from '@/components/StylesPanel.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin',
    name: 'admin-styles',
    component: StylesPanel,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  // Inicializa sólo la primera vez
  if (!userStore.loaded) await userStore.init()

  // 1) Si la ruta exige login y no hay user → /login
  if (to.meta.requiresAuth && !userStore.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 2) Si la ruta exige admin y el user no lo es → home
  if (to.meta.requiresAdmin && userStore.user?.role !== 'admin') {
    return { name: 'home' }
  }

  // 3) Por defecto, deja seguir
})

export default router
