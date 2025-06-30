<template>
  <div class="admin-page">
    <h1>Panel de Administración</h1>
    <!-- …aquí irían los controles de estilo… -->

    <!-- Gestión de usuarios -->
    <section class="user-management">
      <h2>Usuarios registrados</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.email">
            <td>{{ u.email }}</td>
            <td>{{ u.role }}</td>
            <td>{{ u.activo ? 'Sí' : 'No' }}</td>
            <td>
              <button class="btn-toggle" @click="confirmToggle(u.email, u.activo)">
                {{ u.activo ? 'Deshabilitar' : 'Habilitar' }}
              </button>
              <button class="btn-role" @click="confirmRole(u.email, u.role)">
                Rol: {{ u.role }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const users = ref([])

function loadUsers() {
  users.value = userStore.getAllUsers()
}

onMounted(() => {
  loadUsers()
})

async function confirmToggle(email, isActive) {
  const { value } = await Swal.fire({
    title: `${isActive ? 'Deshabilitar' : 'Habilitar'} usuario`,
    text: `¿Seguro que deseas ${isActive ? 'deshabilitar' : 'habilitar'} ${email}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  })
  if (value) {
    userStore.toggleUserActive(email)
    loadUsers()
    Swal.fire(
      '¡Hecho!',
      `El usuario ${email} ha sido ${isActive ? 'deshabilitado' : 'habilitado'}.`,
      'success',
    )
  }
}

async function confirmRole(email, currentRole) {
  const { value: role } = await Swal.fire({
    title: `Cambiar rol de ${email}`,
    input: 'select',
    inputOptions: { user: 'User', admin: 'Admin' },
    inputValue: currentRole,
    showCancelButton: true,
  })
  if (role && role !== currentRole) {
    userStore.setUserRole(email, role)
    loadUsers()
    Swal.fire('¡Hecho!', `El rol de ${email} es ahora ${role}.`, 'success')
  }
}
// en AdminPage.vue, dentro del método que dispara la exportación:
async function exportPDF() {
  const pdfMake = (await import('pdfmake/build/pdfmake')).default
  const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  // …el resto de tu configuración y llamada a pdfMake …
}
</script>

<style scoped>
.admin-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.user-management {
  margin-top: 2rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 0.5rem;
  border: 1px solid #ddd;
  text-align: left;
}
.btn-toggle,
.btn-role {
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-toggle {
  background: #e67e22;
  color: white;
}
.btn-role {
  background: #3498db;
  color: white;
}
</style>
