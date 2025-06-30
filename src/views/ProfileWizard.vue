<template>
  <form-wizard @on-complete="onSave">
    <tab-content title="Datos personales">
      <input v-model="form.firstName" placeholder="Nombre" required />
      <input v-model="form.lastName" placeholder="Apellido" required />
      <input v-model="form.email" placeholder="Email" required />
    </tab-content>

    <tab-content title="Ubicación">
      <div id="map" style="height: 300px"></div>
      <p>Lat: {{ form.lat }}, Lng: {{ form.lng }}</p>
    </tab-content>

    <tab-content title="Revisión">
      <pre>{{ form }}</pre>
    </tab-content>
  </form-wizard>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const userStore = useUserStore()
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  lat: 0,
  lng: 0,
})

// Carga datos existentes
Object.assign(form, userStore.profile || {})

// Inicia Leaflet
onMounted(() => {
  const map = L.map('map').setView([form.lat || 0, form.lng || 0], 2)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
  const marker = L.marker([form.lat, form.lng], { draggable: true }).addTo(map)
  marker.on('dragend', () => {
    const { lat, lng } = marker.getLatLng()
    form.lat = lat
    form.lng = lng
  })
})
function onSave() {
  userStore.updateProfile({ ...form })
  alert('Perfil guardado')
}
</script>
