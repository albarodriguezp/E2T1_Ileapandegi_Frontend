<template>
  <div class="content">
    <div class="content2">
      <!-- Título -->
      <h1>{{ $t('clients.title') }}</h1>

      <!-- Buscador -->   
      <BarraBusqueda 
        v-model="busqueda" 
        :placeholder="$t('clients.search')" 
      />

      <!-- Acciones -->
      <div class="acciones">
        <button class="btn-eliminar" @click="eliminarMultiples">
          {{ $t('clients.delete') }}
        </button>
        <button class="btn-agregar" @click="abrirModalNuevoCliente">
          {{ $t('clients.new') }}
        </button>
      </div>

      <!-- Tabla clientes -->
      <table class="tabla-clientes">
        <thead>
          <tr>
            <th>{{ $t('table.id') }}</th>
            <th>{{ $t('table.name') }}</th>
            <th>{{ $t('table.surnames') }}</th>
            <th>{{ $t('table.phone') }}</th>
            <th>{{ $t('table.actions') }}</th>
            <th class="columna-seleccionar">
              
              <input type="checkbox" v-model="seleccionadosTodos" @change="seleccionarTodos">
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
            <td>{{ cliente.id }}</td>
            <td>{{ cliente.name }}</td>
            <td>{{ cliente.surnames }}</td>
            <td>{{ cliente.telephone }}</td>
            <td class="acciones-tabla">
              <button class="btn-tabla-view" @click="abrirModalVerCliente(cliente)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn-tabla-delete" @click="solicitarEliminarCliente(cliente)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
            <td class="columna-seleccionar">
              <input type="checkbox" v-model="seleccionados" :value="cliente.id">
            </td>
          </tr>

          <tr v-if="clientesFiltrados.length === 0">
            <td colspan="6" style="text-align:center; color:gray;">
              {{ $t('clients.none') }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modales -->
      <ModalConfirmacion
        :mostrar="mostrarModalConfirmacion"
        :mensaje="mensajeModal"
        @confirmar="confirmarEliminarConfirmado"
        @cancelar="cancelarModal"
      />
      <ModalNuevoCliente v-if="mostrarModalCliente" @cerrar="cerrarModalCliente" @guardar="guardarCliente" />
      <ModalInformacion v-if="mostrarModalInformacion" @cerrar="() => mostrarModalInformacion = false" />
      <ModalVerCliente
        v-if="mostrarModalVerCliente"
        :cliente="clienteSeleccionado"
        @cerrar="cerrarModalVerCliente"
        @guardar="actualizarCliente"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import BarraBusqueda from '@/components/BarraBusqueda.vue'
import ModalNuevoCliente from '@/components/ModalNuevoCliente.vue'
import ModalInformacion from '@/components/ModalInformativo.vue'
import ModalConfirmacion from '@/components/ModalConfirmacion.vue'
import ModalVerCliente from '@/components/ModalVerCliente.vue'
import { getClients, createClient, updateClient, deleteClient } from '@/services/api'

/* ===============================
   i18n
================================ */
const { t } = useI18n()

/* ===============================
   ESTADOS
================================ */
const clientes = ref([])
const cargando = ref(false)
const error = ref(null)

const seleccionados = ref([])
const seleccionadosTodos = ref(false)

const mostrarModalCliente = ref(false)
const mostrarModalInformacion = ref(false)
const mostrarModalConfirmacion = ref(false)
const mostrarModalVerCliente = ref(false)

const clienteSeleccionado = ref(null)
const clienteAEliminar = ref(null)

const mensajeModal = ref('')
const eliminarMultiple = ref(false)

const busqueda = ref('')

/* ===============================
   BÚSQUEDA AVANZADA
================================ */
const clientesFiltrados = computed(() => {
  if (!busqueda.value) return clientes.value
  const terminos = busqueda.value.toLowerCase().trim().split(/\s+/)
  return clientes.value.filter(cliente => {
    return terminos.every(term =>
      cliente.name.toLowerCase().includes(term) ||
      cliente.surnames.toLowerCase().includes(term) ||
      (cliente.telephone && cliente.telephone.includes(term))
    )
  })
})

watch(clientesFiltrados, (nuevosClientes) => {
  seleccionados.value = seleccionados.value.filter(id =>
    nuevosClientes.some(c => c.id === id)
  )
  seleccionadosTodos.value = nuevosClientes.length > 0 &&
                             nuevosClientes.every(c => seleccionados.value.includes(c.id))
})

/* ===============================
   MODALES
================================ */
const abrirModalNuevoCliente = () => mostrarModalCliente.value = true
const cerrarModalCliente = () => mostrarModalCliente.value = false

const abrirModalVerCliente = (cliente) => {
  clienteSeleccionado.value = { ...cliente }
  mostrarModalVerCliente.value = true
}
const cerrarModalVerCliente = () => {
  clienteSeleccionado.value = null
  mostrarModalVerCliente.value = false
}

const cancelarModal = () => {
  mostrarModalConfirmacion.value = false
  clienteAEliminar.value = null
  eliminarMultiple.value = false
}

/* ===============================
   ELIMINAR CLIENTES
================================ */
const solicitarEliminarCliente = (cliente) => {
  clienteAEliminar.value = cliente
  mensajeModal.value = t('clients.delete_one', { name: cliente.name })
  eliminarMultiple.value = false
  mostrarModalConfirmacion.value = true
}

const eliminarMultiples = () => {
  if (seleccionados.value.length === 0) {
    mensajeModal.value = t('clients.none_selected')
    eliminarMultiple.value = false
    mostrarModalConfirmacion.value = true
    return
  }
  mensajeModal.value = t('clients.delete_many', { count: seleccionados.value.length })
  eliminarMultiple.value = true
  mostrarModalConfirmacion.value = true
}

/* ===============================
   SELECCIONAR TODOS
================================ */
const seleccionarTodos = () => {
  seleccionados.value = seleccionadosTodos.value ? clientes.value.map(c => c.id) : []
}

/* ===============================
   OBTENER CLIENTES
================================ */
const obtenerClientes = async () => {
  cargando.value = true
  error.value = null
  try {
    clientes.value = await getClients()
  } catch (err) {
    error.value = err.message
  } finally {
    cargando.value = false
  }
}

/* ===============================
   GUARDAR CLIENTE
================================ */
const guardarCliente = async (cliente) => {
  const payload = {
    name: cliente.name,
    surnames: cliente.surnames,
    telephone: cliente.telephone || null,
    home_client: cliente.home_client ? 1 : 0,
    email: cliente.email || null
  }
  try {
    await createClient(payload)
    await obtenerClientes()
  } catch (err) {
    console.error(err)
  }
}

/* ===============================
   ACTUALIZAR CLIENTE
================================ */
const actualizarCliente = async (clienteActualizado) => {
  try {
    const data = await updateClient(clienteActualizado.id, clienteActualizado)
    const index = clientes.value.findIndex(c => c.id === data.id)
    if (index !== -1) clientes.value[index] = { ...clientes.value[index], ...data }
  } catch (err) {
    console.error(err)
  }
}

/* ===============================
   CONFIRMAR ELIMINACIÓN
================================ */
const confirmarEliminarConfirmado = async () => {
  try {
    if (eliminarMultiple.value) {
      await Promise.all(
        seleccionados.value.map(id =>
          deleteClient(id)
        )
      )
      seleccionados.value = []
      seleccionadosTodos.value = false
    } else if (clienteAEliminar.value) {
      await deleteClient(clienteAEliminar.value.id)
      clienteAEliminar.value = null
    }
    await obtenerClientes()
  } catch (err) {
    console.error(err)
  } finally {
    mostrarModalConfirmacion.value = false
    eliminarMultiple.value = false
  }
}

/* ===============================
   CARGA INICIAL
================================ */
onMounted(() => {
  obtenerClientes()
})
</script>

<style scoped>
.acciones {
  margin-top: 1cm;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 1rem;
}

.btn-eliminar,
.btn-agregar {
  width: auto;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-agregar {
  background-color: #9CE0DB;
  color: black;
}

.btn-agregar:hover {
  background-color: #7ec9c3;
}



/* Centrar columnas acciones y seleccionar */
.tabla-clientes th:nth-child(5),
.tabla-clientes th:nth-child(6),
.tabla-clientes td:nth-child(5),
.tabla-clientes td:nth-child(6) {
  text-align: center;
}

.tabla-clientes th:nth-child(5),
.tabla-clientes th:nth-child(6) {
  padding-right: 12px;
}
</style>