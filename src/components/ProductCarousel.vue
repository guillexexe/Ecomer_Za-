<template>
  <div class="carousel-container">
    <!-- Botón anterior -->
    <button class="nav prev" @click="prev">&lt;</button>

    <!-- Contenedor deslizante -->
    <div class="carousel" :style="carouselStyle">
      <div v-for="product in products" :key="product.id" class="slide">
        <img :src="product.image" :alt="product.name" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }}</p>
      </div>
    </div>

    <!-- Botón siguiente -->
    <button class="nav next" @click="next">&gt;</button>

    <!-- Indicadores (dots) -->
    <div class="dots">
      <span
        v-for="(_, i) in products"
        :key="i"
        class="dot"
        :class="{ active: i === currentIndex }"
        @click="goTo(i)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Importa tus assets locales (asegúrate que los nombres y rutas coincidan)
import img1 from '@/assets/Cuero.jpg'
import img2 from '@/assets/urbana.jpg'
import img3 from '@/assets/Clasicos.jpg'
import img4 from '@/assets/sandalia.jpg'
import img5 from '@/assets/Correr.jpg'

// Array de productos con la propiedad `image` en lugar de URL externa
const products = ref([
  { id: 1, name: 'Botines de Cuero', price: '$120.00', image: img1 },
  { id: 2, name: 'Zapatillas Urbanas', price: '$85.50', image: img2 },
  { id: 3, name: 'Mocasines Clásicos', price: '$95.00', image: img3 },
  { id: 4, name: 'Sandalias de Verano', price: '$55.00', image: img4 },
  { id: 5, name: 'Zapatos de Correr', price: '$110.00', image: img5 },
])

// Estado del índice actual
const currentIndex = ref(0)
const carouselStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
}))

let timer = null

// Avanza al siguiente slide
function next() {
  currentIndex.value = (currentIndex.value + 1) % products.value.length
}

// Retrocede al slide anterior
function prev() {
  currentIndex.value = (currentIndex.value - 1 + products.value.length) % products.value.length
}

// Salta a un slide concreto
function goTo(i) {
  currentIndex.value = i
}

// Auto-play cada 4 segundos
onMounted(() => {
  timer = setInterval(next, 4000)
})
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  max-width: 360px;
  margin: auto;
  overflow: hidden;
}

/* El contenedor de slides en fila */
.carousel {
  display: flex;
  transition: transform 0.5s ease;
}

/* Cada slide ocupa el 100% del contenedor */
.slide {
  flex: 0 0 100%;
  padding: 1rem;
  text-align: center;
}
.slide img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Flechas de navegación */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 1.2rem;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 2;
}
.prev {
  left: 0.5rem;
}
.next {
  right: 0.5rem;
}

/* Dots indicadores */
.dots {
  text-align: center;
  margin-top: 0.5rem;
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 4px;
  background: #ccc;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s;
}
.dot.active {
  background: #333;
}
</style>
