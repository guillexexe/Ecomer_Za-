<script setup>
import { ref } from 'vue';

const products = ref([
  { id: 1, name: 'Botines de Cuero', price: '$120.00', imageUrl: 'https://images.unsplash.com/photo-1608256247964-44116035b8ca?q=80&w=300' },
  { id: 2, name: 'Zapatillas Urbanas', price: '$85.50', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=300' },
  { id: 3, name: 'Mocasines Clásicos', price: '$95.00', imageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=300' },
  { id: 4, name: 'Sandalias de Verano', price: '$55.00', imageUrl: 'https://images.unsplash.com/photo-1603487742131-412903756e18?q=80&w=300' },
  { id: 5, name: 'Zapatos de Correr', price: '$110.00', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300' }
]);
</script>

<template>
  <section id="catalogo" class="carousel-section">
    <h2>Nuestros Destacados</h2>
    <div class="carousel-container">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.imageUrl" :alt="product.name">
        <h3>{{ product.name }}</h3>
        <p class="price">{{ product.price }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-section {
  padding: 4rem 0;
  text-align: center;
}
h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
}
.carousel-container {
  display: flex;
  overflow-x: auto; /* La magia del carrusel simple */
  scroll-snap-type: x mandatory;
  gap: 1.5rem;
  padding: 1rem 2rem; /* Permite ver las sombras y que no se corte */
  scrollbar-color: #e67e22 #ecf0f1;
}
/* Para navegadores Webkit como Chrome, Safari */
.carousel-container::-webkit-scrollbar {
  height: 8px;
}
.carousel-container::-webkit-scrollbar-thumb {
  background: #e67e22;
  border-radius: 4px;
}
.product-card {
  flex: 0 0 280px; /* No se encoge, no crece, base de 280px */
  scroll-snap-align: center;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}
.product-card:hover {
  transform: translateY(-5px);
}
img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}
h3 {
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem 0;
}
.price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #e67e22;
  margin-bottom: 1rem;
}
</style>