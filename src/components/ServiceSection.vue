<script setup>
import { ref } from 'vue';

const services = ref([
  { icon: '🚚', title: 'Envío Gratis', description: 'En todas las compras superiores a $75.' },
  { icon: '🔄', title: 'Devoluciones Fáciles', description: '30 días para devolver tus productos sin costo.' },
  { icon: '💳', title: 'Pagos Seguros', description: 'Utilizamos la última tecnología de encriptación.' }
]);
</script>

<template>
  <section id="servicios" class="services">
    <div class="container">
      <div v-for="service in services" :key="service.title" class="service-card">
        <div class="icon">{{ service.icon }}</div>
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  padding: 4rem 1rem;
  background-color: #ecf0f1;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  flex-wrap: wrap;
}
.service-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  text-align: center;
  flex-basis: 300px; /* Ancho base de cada tarjeta */
}
.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}
</style>