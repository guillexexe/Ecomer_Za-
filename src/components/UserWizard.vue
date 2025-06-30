<!-- src/components/UserWizard.vue -->
<template>
  <div class="wizard" @keydown.enter.prevent="onEnter">
    <!-- 1) Progress Bar clicable -->
    <nav class="progress">
      <button
        v-for="(label, i) in stepLabels"
        :key="i"
        :class="{ active: step === i + 1, done: i + 1 < step }"
        @click="goTo(i + 1)"
      >
        {{ i + 1 }}. {{ label }}
      </button>
    </nav>

    <!-- 2) Instrucciones -->
    <p class="instruction">{{ instructions[step] }}</p>

    <!-- 3) Pasos -->
    <section v-if="step === 1" class="step">
      <label>
        Nombre*
        <input ref="firstInput" v-model.trim="form.firstName" />
        <span v-if="errors.firstName" class="err">{{ errors.firstName }}</span>
      </label>
      <label>
        Apellido*
        <input v-model.trim="form.lastName" />
        <span v-if="errors.lastName" class="err">{{ errors.lastName }}</span>
      </label>
      <label>
        Fecha de Nacimiento*
        <input v-model="form.birthDate" type="date" />
        <span v-if="errors.birthDate" class="err">{{ errors.birthDate }}</span>
      </label>
      <p class="computed-age">Edad calculada: {{ computedAge }} años</p>
    </section>

    <section v-if="step === 2" class="step">
      <p>
        Email: <strong>{{ form.email }}</strong>
      </p>
      <label>
        Teléfono*
        <input ref="firstInput" v-model.trim="form.phone" />
        <span v-if="errors.phone" class="err">{{ errors.phone }}</span>
      </label>
      <label>
        Usuario*
        <input v-model.trim="form.username" />
        <span v-if="errors.username" class="err">{{ errors.username }}</span>
      </label>
    </section>

    <section v-if="step === 3" class="step">
      <button class="locate" @click="locateMe">Usar mi ubicación</button>
      <div v-if="mapLoading" class="map-skel">Cargando mapa…</div>
      <div id="map" class="map" v-show="!mapLoading"></div>
      <p>Ciudad: {{ form.address.city }} | Estado: {{ form.address.state }}</p>
      <p>
        Lat: {{ form.address.coordinates.lat.toFixed(4) }}, Lng:
        {{ form.address.coordinates.lng.toFixed(4) }}
      </p>
    </section>

    <section v-if="step === 4" class="step">
      <label>
        Color de ojos
        <input ref="firstInput" v-model.trim="form.eyeColor" />
      </label>
      <label>
        Avatar (URL)
        <input v-model.trim="form.image" />
      </label>
    </section>

    <section v-if="step === 5" class="step">
      <label>
        Universidad
        <input ref="firstInput" v-model.trim="form.university" />
      </label>
      <label>
        Empresa / Cargo
        <input v-model.trim="form.company.name" placeholder="Empresa" />
        <input v-model.trim="form.company.title" placeholder="Cargo" />
      </label>
    </section>

    <section v-if="step === 6" class="step summary">
      <h2>Confirmación</h2>
      <ul>
        <li><strong>Nombre:</strong> {{ form.firstName }} {{ form.lastName }}</li>
        <li><strong>Edad:</strong> {{ computedAge }} años</li>
        <li><strong>Email:</strong> {{ form.email }}</li>
        <li><strong>Teléfono:</strong> {{ form.phone }}</li>
        <li><strong>Usuario:</strong> {{ form.username }}</li>
        <li><strong>Ciudad/Estado:</strong> {{ form.address.city }} / {{ form.address.state }}</li>
        <li><img :src="form.image" alt="avatar" class="avatar" /></li>
        <li><strong>Universidad:</strong> {{ form.university }}</li>
        <li><strong>Empresa/Cargo:</strong> {{ form.company.name }} / {{ form.company.title }}</li>
      </ul>
    </section>

    <!-- 4) Botones -->
    <div class="buttons">
      <button @click="prevStep" :disabled="step === 1">Atrás</button>
      <button v-if="step < TOTAL_STEPS" @click="nextStep" :disabled="!isStepValid">
        Siguiente
      </button>
      <button v-else @click="submit">Confirmar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import Swal from 'sweetalert2'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 1) Etiquetas y constantes
const stepLabels = [
  'Datos Personales',
  'Contacto',
  'Ubicación',
  'Apariencia',
  'Trabajo',
  'Confirmación',
]
const TOTAL_STEPS = stepLabels.length
const props = defineProps({ userId: [String, Number] })
const emit = defineEmits(['close'])
const step = ref(1)
const isStepValid = computed(() => {
  // clean errors
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  let valid = true

  if (step.value === 1) {
    if (!form.firstName) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      errors.firstName = 'Req.'
      valid = false
    }
    if (!form.lastName) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      errors.lastName = 'Req.'
      valid = false
    }
    if (!form.birthDate) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      errors.birthDate = 'Req.'
      valid = false
    }
  } else if (step.value === 2) {
    if (!form.phone) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      errors.phone = 'Req.'
      valid = false
    }
    if (!form.username) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      errors.username = 'Req.'
      valid = false
    }
  }

  return valid
})

const instructions = {
  1: 'Introduce tu nombre y fecha de nacimiento.',
  2: 'Revisa tu teléfono y nombre de usuario.',
  3: 'Selecciona tu ubicación exacta en el mapa.',
  4: 'Dinos tu color de ojos y sube tu avatar.',
  5: 'Facultad y datos de tu trabajo.',
  6: 'Confirma que todo está correcto.',
}

// 3) Estado reactivo
const mapLoading = ref(false)
let map, marker

const form = reactive({
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  phone: '',
  username: '',
  address: { city: '', state: '', coordinates: { lat: 0, lng: 0 } },
  eyeColor: '',
  image: '',
  university: '',
  company: { name: '', title: '' },
})
const errors = reactive({
  firstName: '',
  lastName: '',
  birthDate: '',
  phone: '',
  username: '',
})

// 4) Computed
const computedAge = computed(() => {
  if (!form.birthDate) return ''
  const today = new Date(),
    bd = new Date(form.birthDate)
  let age = today.getFullYear() - bd.getFullYear()
  const m = today.getMonth() - bd.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
  return age
})

// 5) Carga inicial de datos
async function fetchUser(id) {
  try {
    const users = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const data = users.find((u) => u.id === props.userId)
    if (!data) {
      Swal.fire('Error', 'Usuario no encontrado', 'error')
      emit('close')
      return
    }
    Object.assign(form, {
      firstName: '',
      lastName: '',
      birthDate: '',
      email: data.email,
      phone: data.phone || '',
      username: data.username || '',
      address: {
        city: data.city || '',
        state: data.state || '',
        coordinates: data.coordinates || { lat: 0, lng: 0 },
      },
      eyeColor: data.eyeColor || '',
      image: data.image || '',
      university: data.university || '',
      company: { name: data.company?.name || '', title: data.company?.title || '' },
    })
    // restore draft
    const saved = localStorage.getItem('wizard-' + id)
    if (saved) Object.assign(form, JSON.parse(saved))
  } catch {
    Swal.fire('Error', 'No se pudieron cargar los datos.', 'error')
    emit('close')
  }
}

onMounted(() => {
  fetchUser(props.userId)
  window.addEventListener('beforeunload', confirmExit)
})
watch(
  () => props.userId,
  (id) => fetchUser(id),
)

// 6) Auto‐save
watch(
  form,
  () => {
    localStorage.setItem('wizard-' + props.userId, JSON.stringify(form))
  },
  { deep: true },
)

function confirmExit(e) {
  e.preventDefault()
  e.returnValue = ''
}

// 7) Mapa y geolocalización
async function initMap() {
  if (step.value !== 3) return
  mapLoading.value = true
  await nextTick()
  if (!map) {
    map = L.map('map').setView([form.address.coordinates.lat, form.address.coordinates.lng], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    marker = L.marker([form.address.coordinates.lat, form.address.coordinates.lng], {
      draggable: true,
    }).addTo(map)
    marker.on('dragend', async () => {
      const p = marker.getLatLng()
      form.address.coordinates = { lat: p.lat, lng: p.lng }
      await reverseGeocode()
    })
  } else {
    updateMap()
  }
  mapLoading.value = false
}

watch(step, (s) => {
  if (s === 3) initMap()
})

function updateMap() {
  if (!map || !marker) return
  const { lat, lng } = form.address.coordinates
  map.setView([lat, lng], map.getZoom())
  marker.setLatLng([lat, lng])
}

function locateMe() {
  if (!navigator.geolocation) {
    return Swal.fire('Error', 'Geolocalización no soportada', 'error')
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      form.address.coordinates.lat = pos.coords.latitude
      form.address.coordinates.lng = pos.coords.longitude
      await reverseGeocode()
      updateMap()
    },
    () => Swal.fire('Error', 'No pudimos obtener tu ubicación', 'error'),
  )
}

async function reverseGeocode() {
  const { lat, lng } = form.address.coordinates
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
  const res = await fetch(url)
  if (res.ok) {
    const r = await res.json()
    form.address.city = r.address.city || r.address.town || ''
    form.address.state = r.address.state || r.address.region || ''
  }
}

// 8) Navegación
function nextStep() {
  if (isStepValid.value && step.value < TOTAL_STEPS) {
    step.value++
  }
}

function prevStep() {
  if (step.value > 1) step.value--
}
function goTo(n) {
  if (n < step.value) step.value = n
}
function onEnter() {
  if (step.value < TOTAL_STEPS && isStepValid.value) nextStep()
}

// 9) Envío final
function submit() {
  Swal.fire('¡Listo!', 'Tus cambios se han guardado.', 'success').then(() => {
    window.removeEventListener('beforeunload', confirmExit)
    localStorage.removeItem('wizard-' + props.userId)
    emit('close')
  })
}
</script>

<style scoped>
.wizard {
  max-width: 700px;
  margin: 2rem auto;
  font: var(--font-size) var(--font-family);
}
.progress {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.progress button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: #eee;
  cursor: pointer;
}
.progress button.done {
  background: #8bc34a;
  color: #fff;
}
.progress button.active {
  background: #2196f3;
  color: #fff;
}
.instruction {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
}
.step {
  background: #fafafa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.step label {
  display: block;
  margin-bottom: 0.75rem;
}
.step input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.err {
  color: #e74c3c;
  font-size: 0.8rem;
}
.computed-age {
  margin: 0.5rem 0;
  font-style: italic;
  color: #333;
}
.map {
  width: 100%;
  height: 250px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.map-skel {
  width: 100%;
  height: 250px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
.buttons button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  background: var(--color-accent);
  color: #fff;
  cursor: pointer;
}
.buttons button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 0.5rem;
}
.locate {
  margin-bottom: 1rem;
}
.summary ul {
  list-style: none;
  padding: 0;
}
.summary ul li {
  margin-bottom: 0.5rem;
}
</style>
