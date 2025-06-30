<template>
  <form @submit.prevent="onSubmit">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <input v-model="confirm" type="password" placeholder="Confirmar contraseña" required />
    <button type="submit">Registrarse</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const confirm = ref('')
const userStore = useUserStore()

async function onSubmit() {
  if (password.value !== confirm.value) {
    return Swal.fire('Error', 'Las contraseñas no coinciden', 'error')
  }
  try {
    await userStore.register(email.value, password.value)
    Swal.fire('¡OK!', 'Usuario registrado', 'success')
  } catch (err) {
    Swal.fire('Error', err.message, 'error')
  }
}
</script>

<style scoped>
.auth-page {
  max-width: 320px;
  margin: 3rem auto;
  padding: 2rem;
  background: var(--color-secondary);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.auth-page h2 {
  margin-bottom: 1.5rem;
  color: var(--color-accent);
}
.auth-page input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.auth-page button {
  width: 100%;
  padding: 0.7rem;
  background: var(--color-accent);
  color: var(--color-primary);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
.auth-page button:hover {
  opacity: 0.9;
}
</style>
