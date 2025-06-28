<template>
  <div class="auth-page">
    <h2>Registrarse</h2>
    <form @submit.prevent="onSubmit">
      <input v-model.trim="email" type="email" placeholder="Correo electrónico" required />
      <input
        v-model.trim="password"
        type="password"
        placeholder="Contraseña (mín. 6 caracteres)"
        minlength="6"
        required
      />
      <button type="submit">Crear cuenta</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const userStore = useUserStore()
const router = useRouter()

async function onSubmit() {
  try {
    userStore.register(email.value, password.value)
    await Swal.fire({
      icon: 'success',
      title: '¡Cuenta creada!',
      text: `Bienvenido, ${email.value}`,
      timer: 1800,
      showConfirmButton: false,
    })
    router.push('/') // redirige a Home
  } catch (err) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message,
    })
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
