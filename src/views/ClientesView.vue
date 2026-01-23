<template>
  <div class="content">
    <div class="content2">
      <h1>Clientes</h1>
      <div class="buscador">
        <div class="icono-circulo">
          <i class="bi bi-search"></i>
        </div>
        <BarraBusqueda />
      </div>

      <div class="acciones">
        <button class="btn-eliminar" @click="eliminarMultiples">Eliminar</button>
        <button class="btn-agregar" @click="abrirModalNuevoCliente">Nuevo cliente</button>
      </div>

      <table class="tabla-clientes">
        <thead>
          <tr>
            <th>ID cliente</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Teléfono</th>
            <th>Acciones <input type="checkbox" v-model="seleccionadosTodos" @change="seleccionarTodos"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientes" :key="cliente.id">
            <td>{{ cliente.id }}</td>
            <td>
              <button class="btn btn-link p-0" @click="abrirModalVerCliente(cliente)">
                {{ cliente.name }}
              </button>
            </td>
            <td>{{ cliente.surnames }}</td>
            <td>{{ cliente.telephone }}</td>
            <td class="acciones-tabla">
              <button @click="solicitarEliminarCliente(cliente)">
                <i class="bi bi-trash eliminar"></i>
              </button>
              <input type="checkbox" v-model="seleccionados" :value="cliente.id">
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Confirmación -->
      <ModalConfirmacion v-if="mostrarModalConfirmacion" :cliente="clienteAEliminar"
        @confirmar="confirmarEliminarCliente"
        @cancelar="() => { mostrarModalConfirmacion = false; clienteAEliminar = null }" />

      <!-- Modal Nuevo Cliente -->
      <ModalNuevoCliente v-if="mostrarModalCliente" @cerrar="cerrarModalCliente" @guardar="guardarCliente" />

      <!-- Modal Informacion -->
      <ModalInformacion v-if="mostrarModalInformacion" @cerrar="() => mostrarModalInformacion = false" />

      <!-- Modal Ver Cliente -->
      <ModalVerCliente v-if="mostrarModalVerCliente" :cliente="clienteSeleccionado" @cerrar="cerrarModalVerCliente" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BarraBusqueda from '@/components/BarraBusqueda.vue'
import ModalNuevoCliente from '@/components/ModalNuevoCliente.vue'
import ModalInformacion from '@/components/ModalInformartivo.vue'
import ModalConfirmacion from '@/components/ModalConfirmacion.vue'
import ModalVerCliente from '@/components/ModalVerCliente.vue'

/* ===============================
   ESTADOS
================================ */
const clientes = ref([])
const cargando = ref(false)
const error = ref(null)

const seleccionados = ref([])
const seleccionadosTodos = ref(false)

/* Modales */
const mostrarModalCliente = ref(false)
const mostrarModalInformacion = ref(false)
const mostrarModalConfirmacion = ref(false)
const mostrarModalVerCliente = ref(false)

const clienteSeleccionado = ref(null)
const clienteAEliminar = ref(null)

/* ===============================
   FUNCIONES MODALES
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

/* ===============================
   FUNCIONES ELIMINAR
================================ */
const solicitarEliminarCliente = (cliente) => {
  clienteAEliminar.value = cliente
  mostrarModalConfirmacion.value = true
}

const confirmarEliminarCliente = async () => {
  try {
    const id = clienteAEliminar.value.id
    const res = await fetch(`http://localhost:8000/api/clients/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error al eliminar cliente')
    await obtenerClientes()
  } catch (err) {
    console.error(err)
  } finally {
    mostrarModalConfirmacion.value = false
    clienteAEliminar.value = null
  }
}

/* ===============================
   ELIMINAR MULTIPLES CLIENTES
================================ */
const eliminarMultiples = () => {
  if (seleccionados.value.length === 0) return alert("No hay clientes seleccionados")
  mostrarModalConfirmacion.value = true
}

const confirmarEliminarMultiples = async () => {
  try {
    await Promise.all(
      seleccionados.value.map(id =>
        fetch(`http://localhost:8000/api/clients/${id}`, { method: 'DELETE' })
      )
    )
    await obtenerClientes()
    seleccionados.value = []
    seleccionadosTodos.value = false
  } catch (err) {
    console.error(err)
  } finally {
    mostrarModalConfirmacion.value = false
  }
}

/* ===============================
   SELECCIONAR TODOS
================================ */
const seleccionarTodos = () => {
  seleccionados.value = seleccionadosTodos.value ? clientes.value.map(c => c.id) : []
}

/* ===============================
   OBTENER CLIENTES DE LA BD
================================ */
const obtenerClientes = async () => {
  cargando.value = true
  error.value = null
    const token = localStorage.getItem('token')

  try {
    const res = await fetch('http://localhost:8000/api/clients', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (!res.ok) throw new Error('Error al obtener clientes')
    clientes.value = await res.json()
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
  try {
    const res = await fetch('http://localhost:8000/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(cliente)
    })
    if (!res.ok) throw new Error('Error al guardar cliente')
    await obtenerClientes()
  } catch (err) {
    console.error(err)
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
.content {
  background: #222;

  padding: 2rem;
  min-height: 100vh;
  width: 100%;

}

.content2 {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  color: black;
  height: 90vh;

}

.acciones {
  margin-top: 1cm;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.acciones-tabla {
  display: flex;
  gap: 10px;
}

.btn-eliminar {
  background-color: #EBB3B3;
  color: black;
  border-radius: 10px;
  border-color: #EBB3B3;
  font-weight: bold;
  padding: 10px 20px;
}

.btn-agregar {
  background-color: #9CE0DB;
  color: black;
  border-radius: 10px;
  border-color: #9CE0DB;
  font-weight: bold;
  padding: 10px 20px;
}

.buscador {
  margin-top: 1cm;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.icono-buscador {
  font-size: 1.4rem;
  color: gray;
}

.icono-circulo {
  width: 40px;
  height: 40px;
  background-color: #9CE0DB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icono-circulo i {
  color: black;
  font-size: 1.2rem;
}

.tabla-clientes {
  margin-top: 1cm;
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  font-family: Arial, sans-serif;
  padding-top: 8rem;
}

.tabla-clientes thead {
  background-color: #154E68;
  color: white;
}

.tabla-clientes th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
}


.tabla-clientes td {
  padding: 12px;
  color: #000;
}


.tabla-clientes tbody tr:nth-child(odd) {
  background-color: #B6CCD1;
}

.tabla-clientes tbody tr:nth-child(even) {
  background-color: #F7F7F7;
}


.tabla-clientes td.acciones {
  display: flex;
  gap: 10px;
  align-items: center;
}

.eliminiar-multiple {
  color: black;
  cursor: pointer;
}

.eliminar {
  color: red;
  cursor: pointer;
}
</style>