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
      <ModalConfirmacion :mostrar="mostrarModalConfirmacion" :mensaje="mensajeModal" @confirmar="confirmarEliminarConfirmado" @cancelar="cancelarModal"/>

      <!-- Modal Nuevo Cliente -->
      <ModalNuevoCliente v-if="mostrarModalCliente" @cerrar="cerrarModalCliente" @guardar="guardarCliente" />

      <!-- Modal Informacion -->
      <ModalInformacion v-if="mostrarModalInformacion" @cerrar="() => mostrarModalInformacion = false" />

      <!-- Modal Ver Cliente -->
      <ModalVerCliente v-if="mostrarModalVerCliente" :cliente="clienteSeleccionado" @cerrar="cerrarModalVerCliente"  @guardar="actualizarCliente" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BarraBusqueda from '@/components/BarraBusqueda.vue'
import ModalNuevoCliente from '@/components/ModalNuevoCliente.vue'
import ModalInformacion from '@/components/ModalInformativo.vue'
import ModalConfirmacion from'@/components/ModalConfirmacion.vue'
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

const mensajeModal = ref('')
const eliminarMultiple = ref(false)


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
const cancelarModal = () => {
  mostrarModalConfirmacion.value = false;
  clienteAEliminar.value = null;
  eliminarMultiple.value = false;
}

/* ===============================
   FUNCIONES ELIMINAR
================================ */
const solicitarEliminarCliente = (cliente) => {
  clienteAEliminar.value = cliente
  mensajeModal.value = `¿Deseas eliminar al cliente ${cliente.name}?`
  eliminarMultiple.value = false
  mostrarModalConfirmacion.value = true
}

const eliminarMultiples = () => {
  if (seleccionados.value.length === 0) {
    mensajeModal.value = "No hay clientes seleccionados"
    eliminarMultiple.value = false
    mostrarModalConfirmacion.value = true
    return
  }
  mensajeModal.value = `¿Deseas eliminar ${seleccionados.value.length} clientes?`
  eliminarMultiple.value = true
  mostrarModalConfirmacion.value = true
  
}
/* ===============================
   EDITAR CLIENETE
================================ */

// Función para actualizar cliente
const actualizarCliente = async (clienteActualizado) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:8000/api/clients/${clienteActualizado.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: clienteActualizado.email,
        telephone: clienteActualizado.telephone,
        observations: clienteActualizado.observations
      })
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error('Error al actualizar cliente:', errorData)
      return
    }

    const data = await res.json()
    // Actualizamos localmente la lista de clientes
    const index = clientes.value.findIndex(c => c.id === data.id)
    if (index !== -1) clientes.value[index] = data
  } catch (err) {
    console.error(err)
    alert('Error al conectar con el servidor.')
  }
}

const confirmarEliminarConfirmado = async () => {
  const token = localStorage.getItem('token')
  try {
    if (eliminarMultiple.value) {
      // Eliminar múltiples clientes de la BD
      await Promise.all(
        seleccionados.value.map(id =>
          fetch(`http://localhost:8000/api/clients/${id}`, { method: 'DELETE' ,headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
      }}
            
          ),
          
        )
      )

      seleccionados.value = []
      seleccionadosTodos.value = false
    } else if (clienteAEliminar.value) {
      // Eliminar un solo cliente de la BD
      const id = clienteAEliminar.value.id
      const res = await fetch(`http://localhost:8000/api/clients/${id}`, { method: 'DELETE', headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
      }})
      if (!res.ok) throw new Error('Error al eliminar cliente')
      clienteAEliminar.value = null
    }

    // Refrescar la tabla
    await obtenerClientes()
  } catch (err) {
    console.error(err)
  } finally {
    mostrarModalConfirmacion.value = false
    eliminarMultiple.value = false
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
  const token = localStorage.getItem('token')
  
  const payload = {
  name: cliente.name,
  surnames: cliente.surnames,
  telephone: cliente.telephone || null,
  home_client: cliente.home_client ? 1 : 0,
  email: cliente.email || null
}

  try {
    const res = await fetch('http://localhost:8000/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error('Errores de validación:', errorData)
      throw new Error('Error al guardar cliente')
    }

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
  height: 100vh;
  padding: 2rem;
  color: black;
  position: relative;
  overflow: visible;
  z-index: 1;

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
  margin-top: 0.5cm;
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