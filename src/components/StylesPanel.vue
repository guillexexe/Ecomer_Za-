<!-- src/components/StylesPanel.vue -->
<template>
  <section class="styles-panel">
    <div class="config-preview-wrapper">
      <!-- == PANEL DE CONFIGURACIÓN == -->
      <div class="config-panel">
        <!-- Paletas guardadas -->
        <h2>Paletas guardadas</h2>
        <div class="palette-list">
          <div
            v-for="p in palettes"
            :key="p.id"
            class="palette-card"
            :class="{ active: p.id === currentId }"
          >
            <h3>{{ p.name }}</h3>
            <div class="swatches">
              <div class="swatch" :style="{ background: p.colors.primary }"></div>
              <div class="swatch" :style="{ background: p.colors.secondary }"></div>
              <div class="swatch" :style="{ background: p.colors.accent }"></div>
            </div>
            <div class="actions">
              <button @click="applyPalette(p.id)">Aplicar</button>
              <button @click="removePalette(p.id)">Eliminar</button>
            </div>
          </div>
        </div>

        <!-- Crear nueva paleta -->
        <h2>Crear nueva paleta</h2>
        <form class="new-palette" @submit.prevent="addPalette">
          <input v-model="newPalette.name" placeholder="Nombre" required />
          <label>Primario: <input type="color" v-model="newPalette.colors.primary" /></label>
          <label>Secundario: <input type="color" v-model="newPalette.colors.secondary" /></label>
          <label>Acento: <input type="color" v-model="newPalette.colors.accent" /></label>
          <button type="submit">Guardar</button>
        </form>

        <!-- Tipografía -->
        <h2>Tipografía</h2>
        <div class="typo-controls">
          <label>
            Fuente:
            <select v-model="typo.fontFamily">
              <option value="'Arial', sans-serif">Arial</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Montserrat', sans-serif">Montserrat</option>
            </select>
          </label>
          <label>
            Tamaño:
            <input type="number" v-model.number="typo.fontSizeValue" min="10" max="36" />
            px
          </label>
          <button @click="applyTypography">Aplicar Tipografía</button>
        </div>

        <!-- Tamaño de imagen -->
        <h2>Tamaño de imagen</h2>
        <div class="img-controls">
          <label
            >Ancho:
            <input type="number" v-model.number="imgSize.width" min="50" max="500" /> px</label
          >
          <label
            >Alto:
            <input type="number" v-model.number="imgSize.height" min="50" max="500" /> px</label
          >
          <button @click="applyImageSize">Aplicar Tamaño</button>
        </div>

        <!-- Accesibilidad: Modo Daltonismo -->
        <h2>Accesibilidad</h2>
        <label class="cb-mode">
          <input type="checkbox" v-model="cbMode" @change="applyColorBlind" />
          Modo Daltonismo
        </label>
      </div>

      <!-- == PANEL DE PREVIEW == -->
      <div class="preview-panel">
        <h2>Vista previa del Carrusel</h2>
        <div class="preview-container" :style="previewVars" :class="{ daltonism: cbMode }">
          <ProductCarousel />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import Swal from 'sweetalert2'
import { useThemeStore } from '@/stores/theme'
import ProductCarousel from '@/components/ProductCarousel.vue'

// inicializa store
const theme = useThemeStore()
theme.init()

// reactive state
const palettes = computed(() => theme.palettes)
const currentId = computed(() => theme.currentId)

const newPalette = reactive({
  name: '',
  colors: { primary: '#ffffff', secondary: '#f0f0f0', accent: '#333333' },
})

const typo = reactive({
  fontFamily: theme.typography.fontFamily,
  fontSizeValue: parseInt(theme.typography.fontSize),
})

const imgSize = reactive({
  width: theme.imageSize.width,
  height: theme.imageSize.height,
})

const cbMode = ref(theme.colorBlind)

// CSS vars for live preview
const previewVars = computed(() => ({
  '--color-primary': newPalette.colors.primary,
  '--color-secondary': newPalette.colors.secondary,
  '--color-accent': newPalette.colors.accent,
  '--font-family': typo.fontFamily,
  '--font-size': `${typo.fontSizeValue}px`,
  '--img-width': `${imgSize.width}px`,
  '--img-height': `${imgSize.height}px`,
}))

// Métodos
function applyPalette(id) {
  theme.applyPalette(id)
  Swal.fire({ icon: 'success', title: 'Paleta aplicada' })
}
function removePalette(id) {
  theme.removePalette(id)
  Swal.fire({ icon: 'info', title: 'Paleta eliminada' })
}
function addPalette() {
  const id = Date.now()
  theme.addPalette({
    id,
    name: newPalette.name || `Paleta ${id}`,
    colors: { ...newPalette.colors },
  })
  Swal.fire({ icon: 'success', title: 'Paleta guardada' })
  newPalette.name = ''
  newPalette.colors = { primary: '#ffffff', secondary: '#f0f0f0', accent: '#333333' }
}

function applyTypography() {
  theme.updateTypography({ fontFamily: typo.fontFamily, fontSize: `${typo.fontSizeValue}px` })
  Swal.fire({ icon: 'success', title: 'Tipografía aplicada' })
}

function applyImageSize() {
  theme.updateImageSize({ width: imgSize.width, height: imgSize.height })
  Swal.fire({ icon: 'success', title: 'Tamaño de imagen aplicado' })
}

function applyColorBlind() {
  theme.updateColorBlind(cbMode.value)
  Swal.fire({
    icon: 'success',
    title: `Modo Daltonismo ${cbMode.value ? 'activado' : 'desactivado'}`,
  })
}
</script>

<style scoped>
/* 1) Paleta cards en grid fluido */
.palette-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

/* 2) Form de nueva paleta: en grande varias columnas, en pequeño stack */
.new-palette {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  grid-template-rows: auto auto;
  gap: 0.5rem;
  grid-template-areas:
    'name   prim   sec    acc'
    'button prim   sec    acc';
}

@media (max-width: 600px) {
  .new-palette {
    grid-template-columns: 1fr;
  }
}

/* 3) Controles de tipografía e imagen: fila en desktop, columna en móvil */
.typo-controls,
.img-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}
@media (max-width: 600px) {
  .typo-controls,
  .img-controls {
    flex-direction: column;
    align-items: stretch;
  }
}

/* 4) Botones de acciones dentro de cada paleta: horizontales en desktop, verticales en móvil */
.palette-card .actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
@media (max-width: 400px) {
  .palette-card .actions {
    flex-direction: column;
  }
}

/* 5) Ajuste general al config-panel para que baje columnas antes */
.config-preview-wrapper {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}
.config-panel,
.preview-panel {
  flex: 1 1 300px;
  min-width: 250px;
}
@media (max-width: 768px) {
  .config-preview-wrapper {
    flex-direction: column;
  }
}
.palette-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.palette-card .swatches {
  display: flex;
  gap: 4px;
  margin: 0.5rem 0;
}

.palette-card .swatch {
  flex: 1;
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 2px;
}
</style>
