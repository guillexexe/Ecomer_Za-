<!-- src/components/StylesPanel.vue -->
<template>
  <section class="styles-panel">
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

    <!-- Preview de la paleta antes de guardar -->
    <div class="palette-preview">
      <h3>Preview de paleta</h3>
      <div class="swatches">
        <div class="swatch" :style="{ background: newPalette.colors.primary }"></div>
        <div class="swatch" :style="{ background: newPalette.colors.secondary }"></div>
        <div class="swatch" :style="{ background: newPalette.colors.accent }"></div>
      </div>
    </div>

    <!-- Tipografía con PREVIEW -->
    <h2>Tipografía</h2>
    <div class="typo-controls">
      <label>
        Fuente:
        <select v-model="typo.fontFamily">
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Open Sans', sans-serif">Open Sans</option>
          <option value="'Montserrat', sans-serif">Montserrat</option>
        </select>
      </label>
      <label>
        Tamaño:
        <input type="number" v-model.number="typo.fontSizeValue" min="10" max="36" />
        px
      </label>
      <p class="typo-preview" :style="typoPreviewStyle">Texto de ejemplo con tu tipografía</p>
      <button @click="applyTypography">Aplicar Tipografía</button>
    </div>

    <!-- Tamaño de imagen con PREVIEW -->
    <h2>Tamaño de imagen</h2>
    <div class="img-controls">
      <label
        >Ancho: <input type="number" v-model.number="imgSize.width" min="50" max="500" /> px</label
      >
      <label
        >Alto: <input type="number" v-model.number="imgSize.height" min="50" max="500" /> px</label
      >
      <div class="img-preview" :style="imgPreviewStyle">
        <img :src="logo" alt="Logo preview" />
      </div>
      <button @click="applyImageSize">Aplicar Tamaño</button>
    </div>

    <!-- VISTA PREVIA DEL CARRUSEL -->
    <h2>Vista previa del Carrusel</h2>
    <div class="preview-container" :style="previewVars">
      <ProductCarousel />
    </div>
  </section>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import logo from '@/assets/Paso seguro.png'
import ProductCarousel from '@/components/ProductCarousel.vue'

// Inicializa el store
const theme = useThemeStore()
theme.init()

// datos reactivos locales para preview
const palettes = computed(() => theme.palettes)
const currentId = computed(() => theme.currentId)

const newPalette = reactive({
  name: '',
  colors: {
    primary: '#ffffff',
    secondary: '#f0f0f0',
    accent: '#333333',
  },
})

const typo = reactive({
  fontFamily: theme.typography.fontFamily,
  fontSizeValue: parseInt(theme.typography.fontSize),
})
const typoPreviewStyle = computed(() => ({
  fontFamily: typo.fontFamily,
  fontSize: `${typo.fontSizeValue}px`,
  border: '1px dashed #ccc',
  padding: '.5rem',
  margin: '.5rem 0',
}))

const imgSize = reactive({
  width: theme.imageSize.width,
  height: theme.imageSize.height,
})
const imgPreviewStyle = computed(() => ({
  width: `${imgSize.width}px`,
  height: `${imgSize.height}px`,
  objectFit: 'contain',
  border: '1px dashed #ccc',
  background: '#fafafa',
}))

// Construye variables CSS para el preview del carrusel
const previewVars = computed(() => ({
  '--color-primary': newPalette.colors.primary,
  '--color-secondary': newPalette.colors.secondary,
  '--color-accent': newPalette.colors.accent,
  '--font-family': typo.fontFamily,
  '--font-size': `${typo.fontSizeValue}px`,
  '--img-width': `${imgSize.width}px`,
  '--img-height': `${imgSize.height}px`,
}))

// Paletas
function applyPalette(id) {
  theme.applyPalette(id)
}
function removePalette(id) {
  theme.removePalette(id)
}
function addPalette() {
  const id = Date.now()
  theme.addPalette({
    id,
    name: newPalette.name || `Paleta ${id}`,
    colors: { ...newPalette.colors },
  })
  newPalette.name = ''
  newPalette.colors = { primary: '#ffffff', secondary: '#f0f0f0', accent: '#333333' }
}

// Tipografía
function applyTypography() {
  theme.updateTypography({
    fontFamily: typo.fontFamily,
    fontSize: `${typo.fontSizeValue}px`,
  })
}

// Imagen
function applyImageSize() {
  theme.updateImageSize({ width: imgSize.width, height: imgSize.height })
}
</script>

<style scoped>
.styles-panel {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.palette-list {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.palette-card {
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  width: 150px;
  text-align: center;
}
.palette-card.active {
  border-color: var(--color-accent);
}
.swatches {
  display: flex;
  margin: 0.5rem 0;
}
.swatch {
  flex: 1;
  height: 30px;
}
.actions {
  display: flex;
  justify-content: space-between;
}
.new-palette {
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.new-palette input[type='color'] {
  width: 40px;
  height: 40px;
  border: none;
}
.palette-preview {
  margin-bottom: 2rem;
}
.typo-controls,
.img-controls {
  margin: 2rem 0;
}
.typo-preview {
  background: #fafafa;
}
.img-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.img-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
/* Preview del carrusel */
.preview-container {
  border: 2px dashed var(--color-accent);
  padding: 1rem;
  margin-top: 2rem;
  border-radius: 6px;
}
.preview-container .product-carousel {
  box-shadow: none;
}
</style>
