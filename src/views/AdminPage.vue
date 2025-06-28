<template>
  <section class="admin-users">
    <h2>Usuarios registrados</h2>
    <DataTable class="display" :data="usuarios" :columns="columnas">
      <thead>
        <tr>
          <th>Email</th>
          <th>Rol</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>
      </thead>
    </DataTable>
  </section>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const usuarios = ref([])
const columnas = [
  { title: 'Email', data: 'email' },
  { title: 'Rol', data: 'role' },
  { title: 'Activo', data: 'activo', render: (data) => (data ? '✅' : '❌') },
  {
    title: 'Acciones',
    data: null,
    render: (data, type, row) => {
      return `
        <button class="btn-activar">${row.activo ? 'Deshabilitar' : 'Habilitar'}</button>
        <button class="btn-rol">Rol</button>
      `
    },
  },
]

onMounted(() => {
  usuarios.value = userStore.getAllUsers()
})

onUpdated(() => {
  document.querySelectorAll('.btn-activar').forEach((btn, i) => {
    btn.onclick = () => {
      const email = usuarios.value[i].email
      userStore.toggleUserActive(email)
      usuarios.value = userStore.getAllUsers()
    }
  })
  document.querySelectorAll('.btn-rol').forEach((btn, i) => {
    btn.onclick = async () => {
      const u = usuarios.value[i]
      const nuevo = u.role === 'admin' ? 'user' : 'admin'
      userStore.setUserRole(u.email, nuevo)
      usuarios.value = userStore.getAllUsers()
    }
  })
})
</script>

<style scoped>
.admin-users {
  max-width: 1000px;
  margin: 2rem auto;
}
</style>
