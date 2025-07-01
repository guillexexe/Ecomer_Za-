<template>
  <div class="results">
    <h2>Respuestas de {{ userEmail }}</h2>
    <div v-if="!loaded" class="loading">Cargando…</div>
    <div v-else-if="!data">
      <p>No hay respuestas guardadas para este usuario.</p>
    </div>
    <div v-else>
      <section class="block">
        <h3>Datos Personales</h3>
        <p>Nombre: {{ data.firstName }} {{ data.lastName }}</p>
        <p>Fecha Nac.: {{ data.birthDate }}</p>
        <p>Edad: {{ computedAge }} años</p>
        <p>Género: {{ data.gender }}</p>
      </section>

      <section class="block">
        <h3>Contacto</h3>
        <p>Email: {{ data.email }}</p>
        <p>Teléfono: {{ data.phone }}</p>
        <p>Usuario: {{ data.username }}</p>
      </section>

      <section class="block">
        <h3>Dirección Personal</h3>
        <p>Dirección: {{ data.address.address }}</p>
        <p>Ciudad: {{ data.address.city }}, {{ data.address.state }}, {{ data.address.country }}</p>
      </section>

      <section class="block">
        <h3>Apariencia</h3>
        <p>Altura: {{ data.height }} cm</p>
        <p>Peso: {{ data.weight }} kg</p>
        <p>Ojos: {{ data.eyeColor }}</p>
        <p>Cabello: {{ data.hair.color }} ({{ data.hair.type }})</p>
      </section>

      <section class="block">
        <h3>Empresa</h3>
        <p>Universidad/Depto: {{ data.university }}</p>
        <p>Dirección: {{ data.company.address.address }}</p>
        <p>
          Ciudad: {{ data.company.address.city }}, {{ data.company.address.state }},
          {{ data.company.address.country }}
        </p>
      </section>

      <section class="block">
        <h3>Finanzas</h3>
        <p>
          Tarjeta: {{ data.bank.cardType }} {{ data.bank.cardNumber }} (exp.
          {{ data.bank.cardExpire }})
        </p>
        <p>IBAN: {{ data.bank.iban }}</p>
        <p>Crypto: {{ data.crypto.coin }} (Wallet: {{ data.crypto.wallet }})</p>
      </section>
    </div>

    <div class="actions">
      <button @click="$emit('close')">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const props = defineProps({ userId: [String, Number], userEmail: String })

const data = ref(null)
const loaded = ref(false)

onMounted(() => {
  // cargamos del storage el objeto final guardado bajo 'wizard-{id}'
  const raw = localStorage.getItem('wizard-' + props.userId)
  data.value = raw ? JSON.parse(raw) : null
  loaded.value = true
})

const computedAge = computed(() => {
  if (!data.value?.birthDate) return 0
  const bd = new Date(data.value.birthDate)
  const today = new Date()
  let age = today.getFullYear() - bd.getFullYear()
  if (
    today.getMonth() < bd.getMonth() ||
    (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())
  ) {
    age--
  }
  return age
})
</script>

<style scoped>
.results {
  max-width: 600px;
  margin: 1rem auto;
  font-family: sans-serif;
}
.block {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.block h3 {
  margin-top: 0;
}
.loading {
  color: #888;
}
.actions {
  text-align: right;
}
.actions button {
  padding: 0.5rem 1rem;
  border: none;
  background: #2196f3;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>
