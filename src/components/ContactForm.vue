<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')

function handleSubmit() {
  if (!name.value || !email.value || !message.value) {
    alert('Por favor, completa todos los campos.')
    return
  }
  // Aquí iría la lógica para enviar el formulario
  console.log('Enviando datos:', {
    name: name.value,
    email: email.value,
    message: message.value,
  })
  alert(`Gracias, ${name.value}. Hemos recibido tu mensaje.`)

  // Limpiar el formulario
  name.value = ''
  email.value = ''
  message.value = ''
}
</script>

<template>
  <section id="contacto" class="contact-section">
    <div class="container">
      <h2>Contáctanos</h2>
      <p>¿Tienes alguna pregunta? Envíanos un mensaje.</p>
      <form @submit.prevent="handleSubmit" class="contact-form">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="message">Mensaje</label>
          <textarea id="message" rows="5" v-model="message" required></textarea>
        </div>
        <button type="submit">Enviar Mensaje</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  padding: 4rem 1rem;
  background-color: var(--color-primary);
  color: var(--color-accent);
}
.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
.contact-form {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}
.form-group {
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}
input,
textarea {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  background-color: var(--color-accent);
}
button {
  padding: 1rem;
  background-color: var(--color-secondary);
  color: var(--color-accent);
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}
button:hover {
  background-color: var(--color-accent);
}
</style>
