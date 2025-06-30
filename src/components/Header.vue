<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="header">
    <router-link to="/" class="logo">
      <img :src="logo" alt="Mi Tienda" class="logo-img" />
    </router-link>
    <div class="spacer"></div>

    <!-- Si no hay user, mostramos login/register -->
    <template v-if="!user">
      <router-link to="/login" class="btn">Iniciar sesión</router-link>
      <router-link to="/register" class="btn">Registrarse</router-link>
    </template>

    <!-- Si hay user, un dropdown con opciones según rol -->
    <template v-else>
      <div class="dropdown" @click="toggle = !toggle" @blur="toggle = false" tabindex="0">
        <button class="btn options-btn">
          Opciones <span class="arrow" :class="{ open: toggle }">▾</span>
        </button>
        <ul v-if="toggle" class="dropdown-menu">
          <!-- Admin: estilos y usuarios -->
          <li v-if="role === 'admin'">
            <router-link to="/admin">Panel de Estilos</router-link>
          </li>
          <li v-if="role === 'admin'">
            <router-link to="/admin/users">Listado de Usuarios</router-link>
          </li>

          <!-- Usuario normal: editar perfil -->
          <li v-if="role === 'user'">
            <button class="dropdown-btn" @click="openProfile()">Editar perfil</button>
          </li>

          <!-- Siempre: cerrar sesión -->
          <li>
            <button class="dropdown-btn" @click.prevent="logout()">Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </template>
  </nav>

  <!-- Monta el wizard inline cuando se abra -->
  <UserWizard v-if="showProfileWizard" :userId="user.id" @close="closeWizard" />
</template>

<script setup>
import logo from '@/assets/Paso seguro.png'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import UserWizard from '@/components/UserWizard.vue'

const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.user)
const role = computed(() => userStore.user?.role)
const toggle = ref(false)
const showProfileWizard = ref(false)

function logout() {
  userStore.logout()
  router.push('/')
}

function openProfile() {
  showProfileWizard.value = true
  toggle.value = false
}
function closeWizard() {
  showProfileWizard.value = false
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--color-accent);
}
.logo-img {
  width: 80px;
  height: 90px;
  object-fit: contain;
}
.spacer {
  flex: 1;
}
.btn {
  margin-left: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: var(--color-secondary);
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  text-decoration: none;
}
.btn:hover {
  opacity: 0.9;
}
/* Dropdown */
.dropdown {
  position: relative;
  display: inline-block;
}
.options-btn {
  display: flex;
  align-items: center;
}
.arrow {
  display: inline-block;
  margin-left: 4px;
  transition: transform 0.2s;
}
.arrow.open {
  transform: rotate(180deg);
}
.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: var(--color-primary);
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  z-index: 10;
}
.dropdown-menu li {
  list-style: none;
}
.dropdown-menu a,
.dropdown-menu .dropdown-btn {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  color: var(--color-accent);
  text-decoration: none;
  cursor: pointer;
}
.dropdown-menu a:hover,
.dropdown-menu .dropdown-btn:hover {
  background: var(--color-secondary);
}
</style>
