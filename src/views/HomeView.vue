<script setup>
import Banner from '@/components/Banner.vue'
import ServiceSection from '@/components/ServiceSection.vue'
import ProductCarousel from '@/components/ProductCarousel.vue'
import ContactForm from '@/components/ContactForm.vue'
</script>

<template>
  <div class="home-page">
    <Banner />
    <ServiceSection />
    <ProductCarousel />
    <ContactForm />
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
