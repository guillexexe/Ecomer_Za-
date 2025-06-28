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
      this.apply()
      localStorage.setItem('theme', JSON.stringify(this.$state))
    },
  },
})
