<template>
  <div class="carousel-container">
    <button class="nav prev" @click="prev">&lt;</button>
    <div class="carousel" ref="carouselRef" :style="carouselVars">
      <div v-for="(product, index) in clonedProducts" :key="index" class="slide">
        <img :src="product.image" :alt="product.name" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }}</p>
      </div>
    </div>
    <button class="nav next" @click="next">&gt;</button>
    <div class="dots">
      <span
        v-for="(_, i) in products"
        :key="i"
        class="dot"
        :class="{ active: i === activeDotIndex }"
        @click="goTo(i)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import img1 from '@/assets/Cuero.jpg'
import img2 from '@/assets/urbana.jpg'
import img3 from '@/assets/Clasicos.jpg'
import img4 from '@/assets/sandalia.jpg'
import img5 from '@/assets/Correr.jpg'

// --- ESTADO Y DATOS ---
const products = ref([
  { id: 1, name: 'Botines de Cuero', price: '$120.00', image: img1 },
  { id: 2, name: 'Zapatillas Urbanas', price: '$85.50', image: img2 },
  { id: 3, name: 'Mocasines Clásicos', price: '$95.00', image: img3 },
  { id: 4, name: 'Sandalias de Verano', price: '$55.00', image: img4 },
  { id: 5, name: 'Zapatos de Correr', price: '$110.00', image: img5 },
])
const carouselRef = ref(null)
const currentIndex = ref(0)
const isTransitioning = ref(true)

// --- LÓGICA RESPONSIVA (¡NUEVO!) ---
const windowWidth = ref(window.innerWidth)

// 1. Calculamos cuántos items mostrar según el ancho de la ventana
const itemsToShow = computed(() => {
  if (windowWidth.value > 1024) return 3 // Escritorios grandes
  if (windowWidth.value > 768) return 2 // Tablets y escritorios pequeños
  return 1 // Móviles
})

// 2. Escuchamos el evento 'resize' para actualizar el ancho
const handleResize = () => {
  windowWidth.value = window.innerWidth
}
onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))

// --- LÓGICA DEL LOOP INFINITO (ADAPTADA) ---

// 3. `clonesCount` ahora debe ser una propiedad computada para reaccionar a `itemsToShow`
const clonesCount = computed(() => itemsToShow.value)

const clonedProducts = computed(() => [
  ...products.value.slice(-clonesCount.value),
  ...products.value,
  ...products.value.slice(0, clonesCount.value),
])

// 4. El índice inicial también debe ser reactivo
watch(
  clonesCount,
  (newCount) => {
    currentIndex.value = newCount
  },
  { immediate: true },
)

// El resto de la lógica se mantiene, ya que es reactiva a los cambios de las propiedades computadas
const carouselStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * (100 / itemsToShow.value)}%)`,
  transition: isTransitioning.value ? 'transform 0.5s ease' : 'none',
}))

const carouselVars = computed(() => ({
  ...carouselStyle.value,
  '--items-to-show': itemsToShow.value,
}))

let timer = null
function next() {
  currentIndex.value++
  resetTimer()
}
function prev() {
  currentIndex.value--
  resetTimer()
}
function goTo(slideIndex) {
  currentIndex.value = slideIndex + clonesCount.value
  resetTimer()
}

watch(currentIndex, (newIndex) => {
  const jumpThreshold = products.value.length + clonesCount.value
  if (newIndex >= jumpThreshold) {
    setTimeout(() => {
      isTransitioning.value = false
      currentIndex.value = clonesCount.value
    }, 500)
  } else if (newIndex < clonesCount.value) {
    setTimeout(() => {
      isTransitioning.value = false
      currentIndex.value = jumpThreshold - 1
    }, 500)
  } else if (!isTransitioning.value) {
    setTimeout(() => {
      isTransitioning.value = true
    }, 50)
  }
})

const activeDotIndex = computed(() => {
  return (currentIndex.value - clonesCount.value + products.value.length) % products.value.length
})

function resetTimer() {
  clearInterval(timer)
  timer = setInterval(next, 4000)
}
onMounted(() => resetTimer())
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
/* El CSS se mantiene casi idéntico, ya que ahora es controlado por la variable --items-to-show */
.carousel-container {
  position: relative;
  width: 90%;
  margin: auto;
  overflow: hidden;
}
.carousel {
  display: flex;
}
.slide {
  flex: 0 0 calc(100% / var(--items-to-show));
  padding: 0.5rem; /* Menos padding para que quepan mejor */
  text-align: center;
  box-sizing: border-box;
}
.slide img {
  width: var(--img-width, 100%);
  height: var(--img-height, 200px);
  border-radius: 8px;
  object-fit: cover;
  margin: 0 auto; /* Centrar la imagen si es más pequeña que el slide */
}
/* ... el resto de tus estilos para .nav, .dots, h3, p, etc. ... */
h3 {
  color: var(--color-accent, #333);
}
p {
  color: var(--color-accent, #e67e22);
  font-weight: bold;
}
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: var(--color-secondary, rgba(255, 255, 255, 0.7));
  border-radius: 50%;
  border: 1px solid var(--color-accent, #ddd);
  color: var(--color-accent, #333);
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.5rem;
}
.prev {
  left: -20px;
}
.next {
  right: -20px;
}
.dots {
  text-align: center;
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
}
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background: #ccc;
  border-radius: 50%;
  cursor: pointer;
}
.dot.active {
  background: var(--color-accent, #333);
}
</style>
