<template>
  <header class="header">
    <div class="container">
      <div class="logo">Zapatería El Paso Firme</div>
      <nav>
        <a href="#inicio">Inicio</a>
        <a href="#catalogo">Catálogo</a>
        <a href="#servicios">Servicios</a>
        <a href="#contacto">Contacto</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: #2c3e50;
}
nav a {
  margin-left: 1.5rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}
nav a:hover {
  color: #e67e22;
}
</style>