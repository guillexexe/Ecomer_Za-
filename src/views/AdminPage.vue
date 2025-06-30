<!-- src/pages/AdminPage.vue -->
<template>
  <div class="admin-page">
    <h1>Panel de Administración</h1>

    <!-- Tabla de usuarios -->
    <section v-if="!showWizard" class="user-management">
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
              <button class="btn-edit" @click="openWizard(u.id)">Editar perfil</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Wizard de edición -->
    <UserWizard v-if="showWizard" :userId="wizardUserId" @close="closeWizard" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useUserStore } from '@/stores/user'
import UserWizard from '@/components/UserWizard.vue'

const userStore = useUserStore()
const users = ref([])

// Estado para el wizard
const showWizard = ref(false)
const wizardUserId = ref(null)

function loadUsers() {
  users.value = userStore.getAllUsers()
}

onMounted(loadUsers)

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
    Swal.fire('Hecho', `Usuario ${email} actualizado.`, 'success')
  }
}

async function confirmRole(email, currentRole) {
  const { value: role } = await Swal.fire({
    title: `Cambiar rol de ${email}`,
    input: 'select',
    inputOptions: {
      user: 'User',
      admin: 'Admin',
    },
    inputValue: currentRole,
    showCancelButton: true,
  })
  if (role && role !== currentRole) {
    userStore.setUserRole(email, role)
    loadUsers()
    Swal.fire('Hecho', `Rol actualizado a ${role}`, 'success')
  }
}

function openWizard(id) {
  wizardUserId.value = id
  showWizard.value = true
}

function closeWizard() {
  showWizard.value = false
  wizardUserId.value = null
  loadUsers()
}
</script>

<style scoped>
.admin-page {
  max-width: 900px;
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
}
td {
  vertical-align: middle;
}
button {
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}
.btn-toggle {
  background: #e67e22;
  color: white;
}
.btn-role {
  background: #3498db;
  color: white;
}
.btn-edit {
  background: #2ecc71;
  color: white;
}
</style>
