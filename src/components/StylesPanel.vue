<template>
  <div class="styles-panel">
    <h2>Panel de Estilos</h2>
    <form @submit.prevent="onSave">
      <!-- Paleta 60-30-10 -->
      <div class="group">
        <h3>Paleta de Colores</h3>
        <label>
          60% (fondo)
          <input type="color" v-model="local.palette.primary" />
        </label>
        <label>
          30% (secciones)
          <input type="color" v-model="local.palette.secondary" />
        </label>
        <label>
          10% (acento)
          <input type="color" v-model="local.palette.accent" />
        </label>
      </div>

      <!-- Tipografía -->
      <div class="group">
        <h3>Tipografía</h3>
        <label>
          Familia
          <select v-model="local.fontFamily">
            <option>Arial, sans-serif</option>
            <option>'Roboto', sans-serif</option>
            <option>'Playfair Display', serif</option>
            <option>'Montserrat', sans-serif</option>
          </select>
        </label>
        <label>
          Tamaño (px)
          <input type="range" min="12" max="32" v-model.number="local.fontSize" />
          <span>{{ local.fontSize }}px</span>
        </label>
      </div>

      <!-- Tamaño imagen -->
      <div class="group">
        <h3>Tamaño de Imágenes</h3>
        <label>
          Ancho (px)
          <input type="range" min="50" max="500" v-model.number="local.imageWidth" />
          <span>{{ local.imageWidth }}px</span>
        </label>
      </div>

      <!-- Daltonismo -->
      <div class="group">
        <h3>Accesibilidad</h3>
        <label>
          <input type="checkbox" v-model="local.daltonMode" />
          Modo Daltonismo
        </label>
      </div>

      <button type="submit">Guardar Cambios</button>
    </form>

    <!-- Vista previa -->
    <section class="preview">
      <h3>Previsualización</h3>
      <div class="card">
        <p>Este es un texto de ejemplo</p>
        <img src="@/assets/Cuero.jpg" alt="Ejemplo" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import Swal from 'sweetalert2'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()

// Copia local editable
const local = reactive({
  palette: { ...theme.palette },
  fontFamily: theme.fontFamily,
  fontSize: parseInt(theme.fontSize),
  imageWidth: parseInt(theme.imageWidth),
  daltonMode: theme.daltonMode,
})

// Live preview: aplica cambios locales sin guardar
watch(
  local,
  (val) => {
    theme.apply({
      palette: val.palette,
      fontFamily: val.fontFamily,
      fontSize: val.fontSize + 'px',
      imageWidth: val.imageWidth + 'px',
      daltonMode: val.daltonMode,
    })
  },
  { deep: true },
)

async function onSave() {
  // Actualiza el store y persiste
  theme.palette = { ...local.palette }
  theme.fontFamily = local.fontFamily
  theme.fontSize = local.fontSize + 'px'
  theme.imageWidth = local.imageWidth + 'px'
  theme.daltonMode = local.daltonMode
  theme.save()

  await Swal.fire({
    icon: 'success',
    title: '¡Listo!',
    text: 'Los estilos han sido guardados',
    timer: 1500,
    showConfirmButton: false,
  })
}
</script>

<style scoped>
.styles-panel {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.group {
  margin-bottom: 1.5rem;
  background: var(--color-secondary);
  padding: 1rem;
  border-radius: 6px;
}
.group h3 {
  margin-bottom: 0.5rem;
}
.group label {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}
.group label input,
.group label select {
  margin-left: 0.5rem;
  flex: 1;
}
.preview {
  margin-top: 2rem;
  text-align: center;
}
.preview .card {
  display: inline-block;
  padding: 1rem;
  background: var(--color-primary);
  color: var(--color-accent);
  font-family: var(--font-family);
  font-size: var(--font-size);
  filter: var(--filter-dalton);
  border-radius: 6px;
}
.preview .card img {
  margin-top: 0.5rem;
  width: var(--image-width);
  height: auto;
  border-radius: 4px;
}
button[type='submit'] {
  padding: 0.6rem 1.2rem;
  background: var(--color-accent);
  color: var(--color-primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  opacity: 0.9;
}
</style>
