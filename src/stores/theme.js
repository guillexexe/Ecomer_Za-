import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    palette: {
      primary: '#ffffff', // 60%
      secondary: '#eeeeee', // 30%
      accent: '#333333', // 10%
    },
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    imageWidth: '200px',
    daltonMode: false,
    paletasGuardadas: [],
  }),
  actions: {
    init() {
      const saved = localStorage.getItem('theme')
      if (saved) Object.assign(this.$state, JSON.parse(saved))
      this.apply()
    },
    apply(vars = this.$state) {
      const r = document.documentElement.style
      r.setProperty('--color-primary', vars.palette.primary)
      r.setProperty('--color-secondary', vars.palette.secondary)
      r.setProperty('--color-accent', vars.palette.accent)
      r.setProperty('--font-family', vars.fontFamily)
      r.setProperty('--font-size', vars.fontSize)
      r.setProperty('--image-width', vars.imageWidth)
      r.setProperty('--filter-dalton', vars.daltonMode ? 'grayscale(1)' : 'none')
    },
    save() {
      localStorage.setItem('theme', JSON.stringify(this.$state))
      this.apply()
    },
    guardarPaleta(nombre) {
      const preset = {
        nombre,
        palette: { ...this.palette },
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        imageWidth: this.imageWidth,
        daltonMode: this.daltonMode,
      }
      this.paletasGuardadas.push(preset)
      localStorage.setItem('paletasGuardadas', JSON.stringify(this.paletasGuardadas))
    },

    aplicarPaleta(preset) {
      this.palette = { ...preset.palette }
      this.fontFamily = preset.fontFamily
      this.fontSize = preset.fontSize
      this.imageWidth = preset.imageWidth
      this.daltonMode = preset.daltonMode
      this.save()
    },

    eliminarPaleta(nombre) {
      this.paletasGuardadas = this.paletasGuardadas.filter((p) => p.nombre !== nombre)
      localStorage.setItem('paletasGuardadas', JSON.stringify(this.paletasGuardadas))
    },
  },
})
