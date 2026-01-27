<template>
  <div class="modal-backdrop" @click.self="cerrarModal">
    <div class="modal">
      <button class="cerrar-btn" @click="cerrarModal">X</button>
      <h2>Nuevo Cliente</h2>

      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input id="nombre" v-model="cliente.name" type="text" />
        <p v-if="errores.name" class="error-msg">{{ errores.name }}</p>
      </div>

      <div class="form-group">
        <label for="apellidos">Apellidos:</label>
        <input id="apellidos" v-model="cliente.surnames" type="text" />
        <p v-if="errores.surnames" class="error-msg">{{ errores.surnames }}</p>
      </div>

      <div class="form-group">
        <label for="telefono">Teléfono:</label>
        <input id="telefono" v-model="cliente.telephone" type="tel" />
        <p v-if="errores.telephone" class="error-msg">{{ errores.telephone }}</p>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="cliente.email" type="email" />
        <p v-if="errores.email" class="error-msg">{{ errores.email }}</p>
      </div>

      <div class="form-group">
        <label>Home client:</label>
        <div class="radio-group">
          <label>
            <input type="radio" v-model="cliente.home_client" :value="true" />
            Sí
          </label>
          <label>
            <input type="radio" v-model="cliente.home_client" :value="false" />
            No
          </label>
        </div>
        <p v-if="errores.home_client" class="error-msg">{{ errores.home_client }}</p>
      </div>
      <button class="guardar-btn" @click="validarYGuardar">Guardar</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
const emit = defineEmits(['guardar', 'cerrar'])

const cliente = reactive({
  name: '',
  surnames: '',
  telephone: '',
  home_client: null,
  email: ''
})

// Objeto reactivo para errores por campo
const errores = reactive({
  name: '',
  surnames: '',
  telephone: '',
  email: '',
  home_client: ''
})

// Función de validación
function validarCliente(cliente) {
  // Limpiar errores previos
  errores.name = ''
  errores.surnames = ''
  errores.telephone = ''
  errores.email = ''
  errores.home_client = ''

  const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
  if (!cliente.name) errores.name = 'El nombre es obligatorio'
  else if (!letrasRegex.test(cliente.name)) errores.name = 'Solo se permiten letras'

  if (!cliente.surnames) errores.surnames = 'Los apellidos son obligatorios'
  else if (!letrasRegex.test(cliente.surnames)) errores.surnames = 'Solo se permiten letras'

  if (cliente.telephone) {
    const telRegex = /^[0-9+\-\s]+$/
    if (!telRegex.test(cliente.telephone)) errores.telephone = 'Teléfono no válido'
    const numeros = cliente.telephone.replace(/\D/g, '')

    if (!/^\d{9}$/.test(numeros)) {
      errores.telephone = 'El teléfono debe tener 9 números'
    }
  }
  if (cliente.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cliente.email)) errores.email = 'Email no válido'
  }
  if (cliente.home_client === null) errores.home_client = 'Selecciona Sí o No'

  // Retorna true si no hay errores
  return !errores.name && !errores.surnames && !errores.telephone && !errores.email && !errores.home_client
}

// Validar y emitir si todo está correcto
function validarYGuardar() {
  const valido = validarCliente(cliente)
  if (!valido) return
  emit('guardar', { ...cliente })
  cerrarModal()
}

function cerrarModal() {
  emit('cerrar')
}
</script>

<style scoped>
.radio-group {
  display: flex;
  gap: 20px;
  align-items: center;
}

.error-msg {
  color: red;
  font-size: 0.85em;
  margin: 2px 0 8px 0;
}
.modal-backdrop {
  position: fixed;
  top: 250px; left: 0;
  width: 100vw; height: 40vh;
  background-color: rgba(0,0,0,0.0);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 12px 15px;
  width: 360px;
  position: relative;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  display: flex;
  flex-direction: column; 
  gap: 15px;               
}

.cerrar-btn {
  position: absolute;
  top: 10px; right: 12px;
  border: none;
  background: transparent;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

input {
  padding: 6px 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.guardar-btn {
  margin-top: 10px;
  background-color: #82d8d8;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 600;
  cursor: pointer;
}
</style>
