<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 Zapatería El Paso Firme. Todos los derechos reservados.</p>
      <div class="social-links">
        <a href="#">Facebook</a> | <a href="#">Instagram</a> |
        <a href="#">Twitter</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-primary);
  color: var(--color-accent);
  padding: 2rem 1rem;
  text-align: center;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.social-links {
  margin-top: 1rem;
}
.social-links a {
  color: var(--color-accent);
  text-decoration: none;
  margin: 0 0.5rem;
  transition: color 0.3s;
}
.social-links a:hover {
  color: var(--color-accent);
}
</style>
