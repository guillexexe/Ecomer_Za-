<template>
  <div class="wizard" @keydown.enter.prevent="onEnter">
    <!-- 1) Progress Bar -->
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

    <!-- 3) STEP 1: Personales -->
    <section v-if="step === 1" class="step-grid">
      <label
        >Nombre* <input v-model.trim="form.firstName" />
        <span v-if="errors.firstName" class="err">{{ errors.firstName }}</span>
      </label>
      <label
        >Apellido* <input v-model.trim="form.lastName" />
        <span v-if="errors.lastName" class="err">{{ errors.lastName }}</span>
      </label>
      <label>Soltera <input v-model.trim="form.maidenName" /></label>
      <label>
        Género
        <select v-model="form.gender">
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="other">Otro</option>
        </select>
      </label>
      <label
        >Fecha Nac.* <input v-model="form.birthDate" type="date" />
        <span v-if="errors.birthDate" class="err">{{ errors.birthDate }}</span>
      </label>
      <p class="computed-age full-width">Edad: {{ computedAge }} años</p>
    </section>

    <!-- 4) STEP 2: Contacto -->
    <section v-if="step === 2" class="step-grid">
      <p class="full-width">
        Email (sistema): <strong>{{ form.email }}</strong>
      </p>
      <label
        >Teléfono* <input v-model.trim="form.phone" />
        <span v-if="errors.phone" class="err">{{ errors.phone }}</span>
      </label>
      <label
        >Usuario* <input v-model.trim="form.username" />
        <span v-if="errors.username" class="err">{{ errors.username }}</span>
      </label>
      <label
        >Contraseña
        <input v-model="form.password" type="password" placeholder="— dejar en blanco —" />
      </label>
    </section>

    <!-- 5) STEP 3: Dirección Personal -->
    <section v-if="step === 3" class="step-grid">
      <h3 class="full-width">Dirección Personal</h3>

      <!-- buscador rápido -->
      <div class="full-width search">
        <input
          v-model.trim="searchPersonal"
          placeholder="Buscar dirección..."
          @keyup.enter="searchAddress('personal')"
        />
        <button @click="searchAddress('personal')">Buscar</button>
        <button @click="locateMe('personal')">Mi Ubicación</button>
      </div>

      <!-- mapa -->
      <div id="personal-map" class="map"></div>

      <!-- detalles -->
      <div class="address-details full-width">
        <p><strong>Detectada:</strong> {{ form.address.address }}</p>
        <p>
          <strong>Ciudad:</strong> {{ form.address.city }} | <strong>Estado:</strong>
          {{ form.address.state }} | <strong>País:</strong> {{ form.address.country }}
        </p>
        <p>Mueve el marcador para ajustar.</p>
      </div>
    </section>

    <!-- 6) STEP 4: Apariencia -->
    <section v-if="step === 4" class="step-grid">
      <label>Altura (cm) <input v-model.number="form.height" type="number" /></label>
      <label>Peso (kg) <input v-model.number="form.weight" type="number" /></label>
      <label>Grupo Sanguíneo <input v-model.trim="form.bloodGroup" /></label>
      <label>Ojos <input v-model.trim="form.eyeColor" /></label>
      <label>Cabello (color) <input v-model.trim="form.hair.color" /></label>
      <label>Cabello (tipo) <input v-model.trim="form.hair.type" /></label>
      <label class="full-width">Avatar URL de la imagen<input v-model.trim="form.image" /></label>
    </section>

    <!-- 7) STEP 5: Dirección Empresa -->
    <section v-if="step === 5" class="step-grid">
      <label class="full-width">Universidad <input v-model.trim="form.university" /></label>
      <h3 class="full-width">Dirección Empresa</h3>
      <div class="full-width search">
        <input
          v-model.trim="searchCompany"
          placeholder="Buscar dirección empresa..."
          @keyup.enter="searchAddress('company')"
        />
        <button @click="searchAddress('company')">Buscar</button>
        <button @click="locateMe('company')">Mi Ubicación</button>
      </div>
      <div id="company-map" class="map"></div>
      <div class="address-details full-width">
        <p><strong>Empresa:</strong> {{ form.company.name }}</p>
        <p><strong>Detectada:</strong> {{ form.company.address.address }}</p>
        <p>
          <strong>Ciudad:</strong> {{ form.company.address.city }} | <strong>Estado:</strong>
          {{ form.company.address.state }} | <strong>País:</strong>
          {{ form.company.address.country }}
        </p>
      </div>
    </section>

    <!-- 8) STEP 6: Finanzas y Crypto -->
    <section v-if="step === 6" class="step-grid">
      <h3 class="full-width">Datos Bancarios</h3>
      <label>Tarjeta <input v-model.trim="form.bank.cardType" /></label>
      <label>Número <input v-model.trim="form.bank.cardNumber" /></label>
      <label>Expiración (MM/AA) <input v-model.trim="form.bank.cardExpire" /></label>
      <label>Moneda <input v-model.trim="form.bank.currency" /></label>
      <label class="full-width">IBAN <input v-model.trim="form.bank.iban" /></label>
      <h3 class="full-width">Criptomonedas (opcional)</h3>
      <label>Moneda <input v-model.trim="form.crypto.coin" /></label>
      <label>Wallet <input v-model.trim="form.crypto.wallet" /></label>
      <label>Red <input v-model.trim="form.crypto.network" /></label>
    </section>

    <!-- 9) STEP 7: Confirmar -->
    <section v-if="step === 7" class="step summary full-width">
      <h2>Confirmación</h2>
      <pre>{{ JSON.stringify(form, null, 2) }}</pre>
    </section>

    <!-- Navegación -->
    <div class="buttons full-width">
      <button @click="prevStep" :disabled="step === 1">Atrás</button>
      <button v-if="step < TOTAL_STEPS" @click="nextStep">Siguiente</button>
      <button v-else @click="submit">Confirmar y Guardar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import Swal from 'sweetalert2'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 1) Props / Emit
const props = defineProps({ userId: [String, Number] })
const emit = defineEmits(['close'])

// 2) Constantes
const stepLabels = [
  'Personales',
  'Contacto',
  'Dirección Personal',
  'Apariencia',
  'Dirección Empresa',
  'Finanzas',
  'Confirmar',
]
const TOTAL_STEPS = stepLabels.length
const instructions = {
  1: 'Tus datos básicos.',
  2: 'Contacto y credenciales.',
  3: 'Ajusta tu dirección principal.',
  4: 'Tu apariencia física.',
  5: 'Datos y ubicación de tu empresa.',
  6: 'Banca y cripto.',
  7: 'Revisa y confirma.',
}

// 3) Estado
const step = ref(1)
const form = reactive({
  firstName: '',
  lastName: '',
  maidenName: '',
  gender: 'female',
  birthDate: '',
  password: '',
  email: '',
  phone: '',
  username: '',
  image: '',
  bloodGroup: '',
  height: 0,
  weight: 0,
  eyeColor: '',
  hair: { color: '', type: '' },
  address: {
    address: '',
    city: '',
    state: '',
    country: '',
    coordinates: { lat: 10.46, lng: -66.92 },
  },
  university: '',
  bank: { cardType: '', cardNumber: '', cardExpire: '', currency: '', iban: '' },
  company: {
    name: '',
    department: '',
    title: '',
    address: {
      address: '',
      city: '',
      state: '',
      country: '',
      coordinates: { lat: 34.05, lng: -118.24 },
    },
  },
  crypto: { coin: '', wallet: '', network: '' },
})
const errors = reactive({ firstName: '', lastName: '', birthDate: '', phone: '', username: '' })

// buscas
const searchPersonal = ref('')
const searchCompany = ref('')

// mapas
const mapState = reactive({
  personal: { map: null, marker: null, init: false },
  company: { map: null, marker: null, init: false },
})

// 4) Computed
const computedAge = computed(() => {
  if (!form.birthDate) return 0
  const today = new Date(),
    bd = new Date(form.birthDate)
  let age = today.getFullYear() - bd.getFullYear()
  const m = today.getMonth() - bd.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
  return age
})

// 5) Watch step → init maps cuando toque
watch(step, async (ns) => {
  if (ns === 3) {
    await nextTick()
    initMap('personal')
  }
  if (ns === 5) {
    await nextTick()
    initMap('company')
  }
})

// 6) Valida paso actual
function validateStep() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  let ok = true
  if (step.value === 1) {
    if (!form.firstName) {
      errors.firstName = 'Requerido'
      ok = false
    }
    if (!form.lastName) {
      errors.lastName = 'Requerido'
      ok = false
    }
    if (!form.birthDate) {
      errors.birthDate = 'Requerido'
      ok = false
    }
  }
  if (step.value === 2) {
    if (!form.phone) {
      errors.phone = 'Requerido'
      ok = false
    }
    if (!form.username) {
      errors.username = 'Requerido'
      ok = false
    }
  }
  return ok
}

// 7) Navegación
function nextStep() {
  if (validateStep() && step.value < TOTAL_STEPS) step.value++
  else if (!validateStep()) Swal.fire('Atención', 'Completa los campos requeridos', 'warning')
}
function prevStep() {
  if (step.value > 1) step.value--
}
function goTo(n) {
  if (n < step.value) step.value = n
}
function onEnter() {
  if (step.value < TOTAL_STEPS) nextStep()
}

// 8) Carga datos de localStorage
function fetchUser(id) {
  const users = JSON.parse(localStorage.getItem('usuarios') || '[]')
  const u = users.find((x) => x.id === id)
  if (!u) {
    Swal.fire('Error', 'Usuario no encontrado', 'error')
    emit('close')
    return
  }
  // asigna solo propiedades que existan
  Object.keys(form).forEach((key) => {
    if (u[key] !== undefined) {
      if (typeof form[key] === 'object') Object.assign(form[key], u[key])
      else form[key] = u[key]
    }
  })
}
onMounted(() => {
  if (props.userId) fetchUser(props.userId)
})

// 9) Leaflet: init, update, reverse geocode, locate, search
async function initMap(type) {
  const s = mapState[type]
  if (s.init) return
  const id = `${type}-map`
  const addr = type === 'personal' ? form.address : form.company.address
  s.map = L.map(id).setView([addr.coordinates.lat, addr.coordinates.lng], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(s.map)
  s.marker = L.marker([addr.coordinates.lat, addr.coordinates.lng], { draggable: true }).addTo(
    s.map,
  )
  s.marker.on('dragend', async () => {
    const p = s.marker.getLatLng()
    addr.coordinates = { lat: p.lat, lng: p.lng }
    await reverseGeocode(type)
  })
  s.init = true
  await reverseGeocode(type)
}

async function reverseGeocode(type) {
  const addr = type === 'personal' ? form.address : form.company.address
  const { lat, lng } = addr.coordinates
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
  try {
    const res = await fetch(url)
    if (!res.ok) return
    const j = await res.json()
    addr.address = j.display_name || ''
    addr.city = j.address.city || j.address.town || ''
    addr.state = j.address.state || ''
    addr.country = j.address.country || ''
  } catch (e) {
    console.error(e)
  }
}

function updateMap(type) {
  const s = mapState[type]
  if (!s.init) return
  const addr = type === 'personal' ? form.address : form.company.address
  s.map.setView([addr.coordinates.lat, addr.coordinates.lng])
  s.marker.setLatLng([addr.coordinates.lat, addr.coordinates.lng])
}

function locateMe(type) {
  if (!navigator.geolocation) {
    return Swal.fire('Error', 'Geolocalización no soportada', 'error')
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const addr = type === 'personal' ? form.address : form.company.address
      addr.coordinates = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      updateMap(type)
      await reverseGeocode(type)
    },
    () => Swal.fire('Error', 'No obtuvimos tu ubicación', 'error'),
  )
}

async function searchAddress(type) {
  const query = type === 'personal' ? searchPersonal.value : searchCompany.value
  if (!query) return Swal.fire('Atención', 'Escribe algo para buscar', 'warning')
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  const res = await fetch(url)
  if (!res.ok) return
  const arr = await res.json()
  if (!arr.length) return Swal.fire('No encontrado', 'Ningún resultado', 'info')
  const best = arr[0]
  const addr = type === 'personal' ? form.address : form.company.address
  addr.coordinates = { lat: parseFloat(best.lat), lng: parseFloat(best.lon) }
  updateMap(type)
  await reverseGeocode(type)
}

// 10) Submit
function submit() {
  // aquí guardas form en tu back o localStorage principal...
  console.log('guardar:', JSON.parse(JSON.stringify(form)))
  Swal.fire('¡Listo!', 'Datos guardados', 'success').then(() => {
    localStorage.removeItem('wizard-' + props.userId)
    emit('close')
  })
}
</script>

<style scoped>
.wizard {
  max-width: 800px;
  margin: 2rem auto;
  font-family: sans-serif;
}
.progress {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.progress button {
  flex: 1;
  padding: 0.6rem;
  background: #eee;
  border: none;
  cursor: pointer;
}
.progress button.active {
  background: #2196f3;
  color: #fff;
}
.progress button.done {
  background: #8bc34a;
  color: #fff;
}
.instruction {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
}
.step-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  background: #fafafa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.step-grid .full-width {
  grid-column: 1/-1;
}
.step-grid label,
.step-grid p,
.step-grid h3,
.step-grid .search {
  display: flex;
  flex-direction: column;
}
.step-grid input,
.step-grid select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.search {
  flex-direction: row;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.search input {
  flex: 1;
}
.map {
  grid-column: 1/-1;
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.address-details {
  grid-column: 1/-1;
  background: #f0f0f0;
  padding: 0.5rem;
  border-radius: 4px;
}
.buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.buttons button {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background: #2196f3;
  color: #fff;
  cursor: pointer;
}
.buttons button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.err {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
.computed-age {
  font-style: italic;
  color: #666;
  grid-column: 1/-1;
}
.summary pre {
  background: #333;
  color: #f2f2f2;
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>
