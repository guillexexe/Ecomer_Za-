import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // sesión activa { email, role }
    loading: true,
  }),
  actions: {
    init() {
      const sesion = localStorage.getItem('sesion')
      this.user = sesion ? JSON.parse(sesion) : null
      this.loading = false
    },
    register(email, password) {
      const users = JSON.parse(localStorage.getItem('usuarios') || '[]')
      if (users.find((u) => u.email === email)) {
        throw new Error('Correo ya registrado')
      }
      const nuevo = { email, password, role: 'user', activo: true }
      users.push(nuevo)
      localStorage.setItem('usuarios', JSON.stringify(users))
      this.user = { email, role: 'user' }
      localStorage.setItem('sesion', JSON.stringify(this.user))
    },
    login(email, password) {
      const users = JSON.parse(localStorage.getItem('usuarios') || '[]')
      const u = users.find((u) => u.email === email && u.password === password)
      if (!u) throw new Error('Credenciales inválidas')
      if (!u.activo) throw new Error('Usuario deshabilitado')
      this.user = { email: u.email, role: u.role }
      localStorage.setItem('sesion', JSON.stringify(this.user))
    },
    logout() {
      this.user = null
      localStorage.removeItem('sesion')
    },

    // —— Admin actions ——
    getAllUsers() {
      return JSON.parse(localStorage.getItem('usuarios') || '[]')
    },
    toggleUserActive(email) {
      const users = this.getAllUsers()
      const i = users.findIndex((u) => u.email === email)
      if (i >= 0) {
        users[i].activo = !users[i].activo
        localStorage.setItem('usuarios', JSON.stringify(users))
      }
    },
    setUserRole(email, role) {
      const users = this.getAllUsers()
      const i = users.findIndex((u) => u.email === email)
      if (i >= 0) {
        users[i].role = role
        localStorage.setItem('usuarios', JSON.stringify(users))
      }
    },
  },
})
