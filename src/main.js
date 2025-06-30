import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTruck, faExchangeAlt, faLock } from '@fortawesome/free-solid-svg-icons'

// DataTables + Buttons + export
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'

//import Buttons from 'datatables.net-buttons'
// IMPORTA el CSS de Buttons que tengas:
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
// o bien:
// import 'datatables.net-buttons-dt/css/buttons.dataTables.min.css'

// Para PDF export (pdfMake)
//import pdfMake from 'pdfmake/build/pdfmake'
//import pdfFonts from 'pdfmake/build/vfs_fonts'
//pdfMake.vfs = pdfFonts.pdfMake.vfs

// ——— Configuraciones previas al createApp ———
library.add(faTruck, faExchangeAlt, faLock)

//Buttons(window, DataTable)
DataTable.use(DataTablesCore)

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')
// Registra componentes globales
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('DataTable', DataTable)

// Ahora que Pinia está activo:
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const theme = useThemeStore()
const user = useUserStore()

theme.init()
theme.apply()
user.init()
