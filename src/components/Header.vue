<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="header">
    <router-link to="/" class="logo"
      ><img :src="logo" alt="Mi Tienda" class="Paso seguro.png" />
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
            <router-link to="/profile">Editar Perfil</router-link>
          </li>

          <!-- Siempre: cerrar sesión -->
          <li>
            <button @click.prevent="logout">Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </template>
  </nav>
</template>

<script setup>
import logo from '@/assets/Paso seguro.png' // Ajusta ruta si lo pusiste en src/assets/
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// estado dropdown
const toggle = ref(false)

// datos de usuario
const user = computed(() => userStore.user)
const role = computed(() => userStore.user?.role)

// acción de logout
function logout() {
  userStore.logout()
  router.push('/')
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
  width: var(--img-width);
  height: var(--img-height);
  object-fit: contain;
  transform-origin: center center;
  transform: scale(0.25); /* 50% */
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
.dropdown-menu button {
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
.dropdown-menu button:hover {
  background: var(--color-secondary);
}
</style>
