<script setup>
import Header from '@/components/Header.vue'
import Banner from '@/components/Banner.vue'
import ServiceSection from '@/components/ServiceSection.vue'
import ProductCarousel from '@/components/ProductCarousel.vue'
import ContactForm from '@/components/ContactForm.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <Header />
  <main>
    <Banner />
    <ServiceSection />
    <ProductCarousel />
    <ContactForm />
  </main>
  <Footer />
</template>

<style>
/* Estilos globales muy básicos */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  background-color: #f9f9f9;
  color: #333;
}

main {
  width: 100%;
  overflow-x: hidden; /* Evita scrolls horizontales indeseados */
}
</style>