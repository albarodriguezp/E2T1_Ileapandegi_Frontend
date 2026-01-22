<template>
  <div class="modal-backdrop" @click.self="cerrarModal">
    <div class="modal">
      <button class="cerrar-btn" @click="cerrarModal">X</button>
      <h2>Nuevo Cliente</h2>

      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input id="nombre" v-model="cliente.nombre" type="text" />
      </div>

      <div class="form-group">
        <label for="apellidos">Apellidos:</label>
        <input id="apellidos" v-model="cliente.apellidos" type="text" />
      </div>

      <div class="form-group">
        <label for="telefono">Teléfono:</label>
        <input id="telefono" v-model="cliente.telefono" type="tel" />
      </div>

      <div class="form-group">
        <label for="direccion">Dirección:</label>
        <input id="direccion" v-model="cliente.direccion" type="text" />
      </div>

      <button class="guardar-btn" @click="guardarCliente">Guardar</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
const emit = defineEmits(['guardar', 'cerrar'])

const cliente = reactive({
  nombre: '',
  apellidos: '',
  telefono: '',
  direccion: ''
})

function guardarCliente() {
  emit('guardar', { ...cliente })
  cerrarModal()
}

function cerrarModal() {
  emit('cerrar')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 250px; left: 0;
  width: 100vw; height: 50vh;
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
