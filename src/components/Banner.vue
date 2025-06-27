<template>
  <section id="inicio" class="banner">
    <div class="banner-text">
      <h1>Colección Invierno 2025</h1>
      <p>Descubre los estilos que marcarán la temporada. Calidad y confort en cada paso.</p>
      <a href="#catalogo" class="cta-button">Ver Colección</a>
    </div>
  </section>
</template>

<style scoped>
.banner {
  height: 60vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
}
.banner-text {
  max-width: 600px;
  padding: 1rem;
}
h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}
p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.cta-button {
  background-color: #e67e22;
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  font-weight: bold;
  border-radius: 5px;
  transition: background-color 0.3s;
}
.cta-button:hover {
  background-color: #d35400;
}
</style>