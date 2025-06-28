import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomeView.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import AdminPage from '@/views/AdminPage.vue'
import { useUserStore } from '@/stores/user'
import StylesPanel from '@/components/StylesPanel.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  {
    path: '/admin/users',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin',
    component: StylesPanel,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // fallback
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard para /admin
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if (!userStore.loaded) await userStore.init() // espera a init()
  if (to.meta.requiresAdmin && userStore.user?.role !== 'admin') {
    return '/login'
  }
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  // 1) Espera a que sepamos si hay un user (init carga onAuthStateChanged)
  if (userStore.loading) {
    await userStore.init()
  }

  // 2) Si la ruta requiere autenticación y no hay user → /login
  if (to.meta.requiresAuth && !userStore.user) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 3) Si la ruta requiere rol admin y el user no lo es → /
  if (to.meta.requiresAdmin && userStore.user?.role !== 'admin') {
    return { path: '/' }
  }

  // 4) Por defecto, deja seguir
})
export default router
