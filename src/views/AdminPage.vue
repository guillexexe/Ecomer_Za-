<template>
  <div class="admin-page">
    <h1>Panel de Administración</h1>

    <!-- Lista de usuarios -->
    <section v-if="!showResults" class="user-management">
      <h2>Usuarios registrados</h2>

      <div class="export-buttons-container">
        <button class="btn-export-pdf" @click="exportToPdf">Exportar a PDF</button>
        <button class="btn-export-excel" @click="exportToExcel">Exportar a Excel</button>
      </div>

      <table id="usersDataTable" ref="usersDataTableRef" class="display nowrap" style="width: 100%">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Segundo Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </section>

    <!-- Muestra las respuestas de la encuesta -->
    <SurveyResults
      v-if="showResults"
      :userId="currentUserId"
      :userEmail="currentUserEmail"
      @close="closeResults"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Swal from 'sweetalert2'
import { useUserStore } from '@/stores/user'
import SurveyResults from '@/components/SurveyResults.vue'

// jQuery y DataTables + estilos
import $ from 'jquery'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
import 'datatables.net-dt'
import 'datatables.net-buttons-dt'
import 'datatables.net-buttons/js/buttons.html5.mjs'
import 'datatables.net-buttons/js/buttons.print.mjs'

// PDFMake + fuentes
import JSZip from 'jszip'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
window.JSZip = JSZip
window.pdfMake = pdfMake
pdfMake.vfs = pdfFonts.vfs

// Excel (SheetJS)
import * as XLSX from 'xlsx'

// Estado y refs
const userStore = useUserStore()
const users = ref([])
const usersDataTableRef = ref(null)
let dataTableInstance = null

const showResults = ref(false)
const currentUserId = ref(null)
const currentUserEmail = ref(null)

// Carga lista de usuarios
function loadUsers() {
  users.value = userStore.getAllUsers()
  if (dataTableInstance) {
    dataTableInstance.clear().rows.add(users.value).draw()
  }
}

// Inicializa DataTable
function initializeDataTable() {
  console.log('📋 usuarios:', users.value)
  console.log('🔎 elemento table:', usersDataTableRef.value)
  if (!usersDataTableRef.value) {
    console.warn('La tabla no existe en el DOM')
    return
  }
  if (dataTableInstance) {
    dataTableInstance.destroy()
    dataTableInstance = null
  }
  dataTableInstance = $(usersDataTableRef.value).DataTable({
    data: users.value,
    columns: [
      { data: 'firstName', title: 'Nombre', defaultContent: '' },
      { data: 'lastName', title: 'Apellido', defaultContent: '' },
      { data: 'maidenName', title: 'Segundo Nombre', defaultContent: 'N/A' },
      { data: 'email', title: 'Email' },
      { data: 'role', title: 'Rol' },
      {
        data: 'activo',
        title: 'Activo',
        render: (d) => (d ? 'Sí' : 'No'),
      },
      {
        data: null,
        title: 'Acciones',
        orderable: false,
        searchable: false,
        render: (_, __, row) => {
          const e = row.email
          const a = row.activo
          const r = row.role
          const id = row.id
          return `
            <div class="action-buttons">
              <button class="btn-toggle" onclick="confirmToggle('${e}',${a})">
                ${a ? 'Deshabilitar' : 'Habilitar'}
              </button>
              <button class="btn-role" onclick="confirmRole('${e}','${r}')">
                Rol: ${r}
              </button>
              <button class="btn-view" onclick="viewResults(${id},'${e}')">
                Ver respuestas
              </button>
            </div>`
        },
      },
    ],
    dom: 'Bfrtip',
    buttons: ['excelHtml5', 'pdfHtml5', 'print'],
    language: {
      emptyTable: 'No hay datos disponibles',
      search: 'Buscar:',
      lengthMenu: 'Mostrar _MENU_ registros',
      info: 'Mostrando _START_ a _END_ de _TOTAL_',
      paginate: {
        first: 'Primero',
        last: 'Último',
        next: 'Siguiente',
        previous: 'Anterior',
      },
    },
  })
}

// Exportar a PDF (ScriptTable + pdfMake)
async function exportToPdf() {
  if (!dataTableInstance) {
    return Swal.fire('Error', 'Tabla no inicializada', 'error')
  }
  const data = dataTableInstance.rows().data().toArray()
  if (!data.length) {
    return Swal.fire('Info', 'No hay usuarios para exportar', 'info')
  }
  const body = [
    ['Nombre', 'Apellido', 'Segundo Nombre', 'Email', 'Rol', 'Activo'],
    ...data.map((u) => [
      u.firstName || '',
      u.lastName || '',
      u.maidenName || 'N/A',
      u.email,
      u.role,
      u.activo ? 'Sí' : 'No',
    ]),
  ]
  const docDef = {
    content: [
      { text: 'Reporte de Usuarios', style: 'header' },
      { table: { headerRows: 1, body }, layout: 'lightHorizontalLines' },
    ],
    styles: {
      header: { fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
    },
  }
  pdfMake.createPdf(docDef).download('usuarios.pdf')
}

// Exportar a Excel (SheetJS)
async function exportToExcel() {
  if (!dataTableInstance) {
    return Swal.fire('Error', 'Tabla no inicializada', 'error')
  }
  const data = dataTableInstance.rows().data().toArray()
  if (!data.length) {
    return Swal.fire('Info', 'No hay usuarios para exportar', 'info')
  }
  const sheetData = data.map((u) => ({
    Nombre: u.firstName || '',
    Apellido: u.lastName || '',
    'Segundo Nombre': u.maidenName || 'N/A',
    Email: u.email,
    Rol: u.role,
    Activo: u.activo ? 'Sí' : 'No',
  }))
  const ws = XLSX.utils.json_to_sheet(sheetData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Usuarios')
  XLSX.writeFile(wb, 'usuarios.xlsx')
}

// Funciones globales para los botones renderizados
window.confirmToggle = async (email, isActive) => {
  const { value } = await Swal.fire({
    title: `${isActive ? 'Deshabilitar' : 'Habilitar'} usuario`,
    text: `¿Seguro que deseas ${isActive ? 'deshabilitar' : 'habilitar'} ${email}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  })
  if (value) {
    userStore.toggleUserActive(email)
    loadUsers()
    dataTableInstance.clear().rows.add(users.value).draw()
    Swal.fire('Hecho', 'Estado actualizado', 'success')
  }
}

window.confirmRole = async (email, currentRole) => {
  const { value: role } = await Swal.fire({
    title: `Cambiar rol de ${email}`,
    input: 'select',
    inputOptions: { user: 'User', admin: 'Admin' },
    inputValue: currentRole,
    showCancelButton: true,
  })
  if (role && role !== currentRole) {
    userStore.setUserRole(email, role)
    loadUsers()
    dataTableInstance.clear().rows.add(users.value).draw()
    Swal.fire('Hecho', `Rol actualizado a ${role}`, 'success')
  }
}

// Mostrar respuestas en lugar de editar
window.viewResults = (id, email) => {
  currentUserId.value = id
  currentUserEmail.value = email
  showResults.value = true
}

// Cerrar el componente de resultados
function closeResults() {
  showResults.value = false
  currentUserId.value = null
  currentUserEmail.value = null
  loadUsers()
  dataTableInstance.clear().rows.add(users.value).draw()
}

// Ciclo de vida del componente
onMounted(async () => {
  loadUsers()
  await nextTick() // Espera a que el <table> esté en el DOM
  initializeDataTable()
})

onUnmounted(() => {
  if (dataTableInstance) {
    dataTableInstance.destroy()
    dataTableInstance = null
  }
})
</script>

<style scoped>
.admin-page {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.export-buttons-container {
  margin-bottom: 1rem;
}
.btn-export-pdf,
.btn-export-excel {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: #2196f3;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.btn-export-excel {
  background: #4caf50;
}
.action-buttons button {
  margin-right: 0.3rem;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
}
.action-buttons .btn-toggle {
  background: #e67e22;
}
.action-buttons .btn-role {
  background: #9b59b6;
}
.action-buttons .btn-view {
  background: #2ecc71;
}
.dataTables_wrapper {
  margin-top: 1rem;
}
</style>
