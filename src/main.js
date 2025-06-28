import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { useThemeStore } from '@/stores/theme'
import './assets/main.css'
import { useUserStore } from '@/stores/user'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTruck, faExchangeAlt, faLock } from '@fortawesome/free-solid-svg-icons'

library.add(faTruck, faExchangeAlt, faLock)

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).use(router).mount('#app')
app.component('font-awesome-icon', FontAwesomeIcon)
const theme = useThemeStore()
theme.init()

// Aplica tema al cargar
useThemeStore().apply()
useUserStore().init()
