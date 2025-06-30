// src/stores/theme.js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // Paletas de color guardadas
    palettes: [],
    // ID de la paleta activa
    currentId: null,
    // Tipografía actual
    typography: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
    },
    // Tamaño de imagen (logo, etc.)
    imageSize: {
      width: 100, // px
      height: 100, // px
    },
  }),

  actions: {
    // Carga del localStorage (o valores por defecto)
    init() {
      const raw = localStorage.getItem('themeData')
      if (raw) {
        const data = JSON.parse(raw)
        this.palettes = data.palettes || []
        this.currentId = data.currentId
        this.typography = data.typography
        this.imageSize = data.imageSize
      } else {
        // Primer arranque: crea paleta Default
        this.palettes = [
          {
            id: 1,
            name: 'Default',
            colors: {
              primary: '#ffffff',
              secondary: '#f0f0f0',
              accent: '#333333',
            },
          },
        ]
        this.currentId = 1
      }
      this.apply()
    },

    // Persiste todo en localStorage
    saveAll() {
      const payload = {
        palettes: this.palettes,
        currentId: this.currentId,
        typography: this.typography,
        imageSize: this.imageSize,
      }
      localStorage.setItem('themeData', JSON.stringify(payload))
    },

    // Inyecta las variables CSS en <html>
    apply() {
      // 1) Colores
      const p = this.palettes.find((x) => x.id === this.currentId)
      if (p) {
        document.documentElement.style.setProperty('--color-primary', p.colors.primary)
        document.documentElement.style.setProperty('--color-secondary', p.colors.secondary)
        document.documentElement.style.setProperty('--color-accent', p.colors.accent)
      }

      // 2) Tipografía
      document.documentElement.style.setProperty('--font-family', this.typography.fontFamily)
      document.documentElement.style.setProperty('--font-size', this.typography.fontSize)

      // 3) Tamaño de imagen
      document.documentElement.style.setProperty('--img-width', this.imageSize.width + 'px')
      document.documentElement.style.setProperty('--img-height', this.imageSize.height + 'px')
    },

    // Cambia la paleta activa y lo guarda
    applyPalette(id) {
      this.currentId = id
      this.apply()
      this.saveAll()
    },

    // Añade una nueva paleta
    addPalette(palette) {
      // palette: { id, name, colors:{primary,secondary,accent} }
      this.palettes.push(palette)
      this.saveAll()
    },

    // Elimina una paleta por ID
    removePalette(id) {
      this.palettes = this.palettes.filter((x) => x.id !== id)
      // Si la eliminada era la activa, resetea a la primera
      if (this.currentId === id) {
        this.currentId = this.palettes.length ? this.palettes[0].id : null
      }
      this.apply()
      this.saveAll()
    },

    // Actualiza las variables de tipografía
    updateTypography({ fontFamily, fontSize }) {
      this.typography = { fontFamily, fontSize }
      this.apply()
      this.saveAll()
    },

    // Actualiza el tamaño de imagen
    updateImageSize({ width, height }) {
      this.imageSize = { width, height }
      this.apply()
      this.saveAll()
    },
  },
})
