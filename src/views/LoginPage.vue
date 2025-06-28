<template>
  <div class="auth-page">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Correo" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
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
const router = useRouter()
const userStore = useUserStore()

async function submit() {
  try {
    await userStore.login(email.value, password.value)
    Swal.fire('Bienvenido', 'Has iniciado sesión con éxito', 'success')
    // en LoginPage.vue, tras éxito:
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
    router.push('/') // vuelve a Home
  } catch (e) {
    Swal.fire('Error', e.message, 'error')
  }
}
</script>

<style scoped>
.auth-page {
  max-width: 300px;
  margin: 2rem auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
</style>
