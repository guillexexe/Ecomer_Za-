<template>
  <div class="auth-page">
    <h2>Crear cuenta</h2>
    <form @submit.prevent="onSubmit" novalidate>
      <!-- Email (solo texto, asumido ya validado) -->
      <div class="field">
        <label>Email</label>
        <div class="input-wrapper">
          <input type="email" v-model.trim="email" placeholder="tucorreo@ejemplo.com" required />
          <span class="icon mail-icon"></span>
        </div>
      </div>

      <!-- Contraseña -->
      <div class="field">
        <label>Contraseña</label>
        <div class="input-wrapper">
          <input
            :type="showPass1 ? 'text' : 'password'"
            v-model.trim="password"
            placeholder="Mínimo 6 caracteres"
            minlength="6"
            required
          />
          <button type="button" class="toggle-btn" @click="showPass1 = !showPass1">
            <span :class="showPass1 ? 'icon eye-off' : 'icon eye'"></span>
          </button>
        </div>
      </div>

      <!-- Confirmar contraseña -->
      <div class="field">
        <label>Confirmar contraseña</label>
        <div class="input-wrapper">
          <input
            :type="showPass2 ? 'text' : 'password'"
            v-model.trim="confirm"
            placeholder="Repite tu contraseña"
            minlength="6"
            required
          />
          <button type="button" class="toggle-btn" @click="showPass2 = !showPass2">
            <span :class="showPass2 ? 'icon eye-off' : 'icon eye'"></span>
          </button>
        </div>
      </div>

      <!-- Mensaje de error -->
      <p v-if="error" class="error">{{ error }}</p>

      <!-- Submit -->
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registrando…' : 'Registrarse' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const confirm = ref('')
const showPass1 = ref(false)
const showPass2 = ref(false)
const error = ref('')
const loading = ref(false)

const userStore = useUserStore()

async function onSubmit() {
  error.value = ''

  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  try {
    await userStore.register(email.value, password.value)
    Swal.fire('¡Bienvenido!', 'Usuario registrado con éxito.', 'success')
  } catch (err) {
    error.value = err.message || 'Ha ocurrido un error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Variables extras */
:root {
  --accent-hover: #2980b9;
}

/* Contenedor principal */
.auth-page {
  max-width: 380px;
  margin: 3rem auto;
  padding: 2.5rem;
  background: var(--color-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.auth-page h2 {
  margin-bottom: 1.5rem;
  color: var(--color-accent);
  font-size: 1.6rem;
}

/* Campo individual */
.field {
  margin-bottom: 1.2rem;
  text-align: left;
}
.field label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

/* Wrapper input + icon */
.input-wrapper {
  position: relative;
}
.input-wrapper input {
  width: 100%;
  padding: 0.65rem 2.4rem 0.65rem 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.input-wrapper input:focus {
  border-color: var(--color-accent);
  outline: none;
}

/* Iconos (usa tus icon-font o sprites) */
.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #888;
}
.mail-icon {
  left: 0.8rem;
}
.eye,
.eye-off {
  right: 0.8rem;
}

/* Botón toggle (para password) */
.toggle-btn {
  position: absolute;
  top: 50%;
  right: 0.4rem;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

/* Mensaje de error */
.error {
  margin: 0.5rem 0 1rem;
  color: #e74c3c;
  font-size: 0.9rem;
}

/* Botón principal */
button[type='submit'] {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-accent);
  color: var(--color-primary);
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
button[type='submit'][disabled] {
  background: #ccc;
  cursor: default;
}
button[type='submit']:hover:not([disabled]) {
  background: var(--accent-hover);
}
</style>
