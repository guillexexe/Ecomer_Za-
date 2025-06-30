<script setup>
import { ref } from 'vue'
import { faTruck, faExchangeAlt, faLock } from '@fortawesome/free-solid-svg-icons'

const services = ref([
  {
    icon: faTruck,
    title: 'Envío Gratis',
    description: 'En todas las compras superiores a $75.',
  },
  {
    icon: faExchangeAlt,
    title: 'Devoluciones Fáciles',
    description: '30 días para devolver tus productos sin costo.',
  },
  {
    icon: faLock,
    title: 'Pagos Seguros',
    description: 'Utilizamos la última tecnología de encriptación.',
  },
])
</script>

<template>
  <section id="servicios" class="services">
    <div class="container">
      <div v-for="service in services" :key="service.title" class="service-card">
        <font-awesome-icon :icon="service.icon" class="icon" />
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  padding: 4rem 1rem;
  background-color: var(--color-primary);
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
  background: var(--color-secondary);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  flex-basis: 300px; /* Ancho base de cada tarjeta */
}
.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--color-accent);
}

h3 {
  margin-bottom: 0.5rem;
  color: var(--color-accent);
}
</style>
