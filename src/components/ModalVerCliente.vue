<template>
  <div class="modal-backdrop">
    <div class="modal-content p-4 rounded shadow bg-white position-relative" style="width: 360px;">
      <button type="button" class="btn-close position-absolute top-0 end-0 m-3" @click="$emit('cerrar')"></button>
      <h5 class="mb-4">{{ cliente.name }} {{ cliente.surnames }}</h5>

      <div class="d-flex mb-3">
        <div class="avatar me-3">
          <img src="@/assets/img/user.png" alt="Avatar" class="rounded-circle" />
        </div>

        <div class="flex-grow-1">
          <div class="mb-3">
            <label class="form-label small">Nombre:</label>
            <input v-model="form.name" type="text" class="form-control form-control-sm" disabled/>
          </div>

          <div class="mb-3">
            <label class="form-label small">Apellidos:</label>
            <input v-model="form.surnames" type="text" class="form-control form-control-sm" disabled/>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label small">Email:</label>
        <input v-model="form.email" type="email" class="form-control form-control-sm" />
         <p v-if="errores.email" class="text-danger small mt-1">{{ errores.email }}</p>
      </div>

      <div class="mb-3">
        <label class="form-label small">Teléfono:</label>
        <input v-model="form.telephone" type="text" class="form-control form-control-sm" />
        <p v-if="errores.telephone" class="text-danger small mt-1">{{ errores.telephone }}</p>
      </div>

      <div class="mb-3">
        <label class="form-label small">Observaciones:</label>
        <textarea v-model="form.observations" rows="3" class="form-control form-control-sm" placeholder="Sin observaciones..."></textarea>
      </div>

      <button class="btn btn-info w-100 mt-2" @click="guardar">Guardar</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, toRefs } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  cliente: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cerrar', 'guardar'])

const form = reactive({
  name: '',
  surnames: '',
  email: '',
  telephone: '',
  observations: ''
})

function validarForm() {
  errores.email = ''
  errores.telephone = ''

  let valido = true

  // Validar email si hay valor
  if (form.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      errores.email = 'Email no válido'
      valido = false
    }
  }

  // Validar teléfono si hay valor
  if (form.telephone) {
    const numeros = form.telephone.replace(/\D/g, '')
    if (!/^\d{9}$/.test(numeros)) {
      errores.telephone = 'Teléfono debe tener 9 números'
      valido = false
    }
  }

  return valido
}

const errores = reactive({
  email: '',
  telephone: ''
})

// Cuando cambia el cliente, actualizamos el form
watch(() => props.cliente, (newCliente) => {
  form.name = newCliente.name || ''
  form.surnames = newCliente.surnames || ''
  form.email = newCliente.email || ''
  form.telephone = newCliente.telephone || ''
  form.observations = newCliente.observations || ''
}, { immediate: true })

const guardar = () => {
  if (!validarForm()) return
  emit('guardar', { ...form, id: props.cliente.id })
  emit('cerrar')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  max-width: 360px;
  border-radius: 10px;
}

.avatar img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  
}

.btn-info {
  margin-top: 10px;
  background-color: #9CE0DB !important;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 600;
  cursor: pointer;
  color: black;
  box-shadow: none;
  outline: none;
  transition: none; /* elimina animaciones de transición */
}
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-info:hover,
.btn-info:focus,
.btn-info:active {
  background-color: #9CE0DB !important;
  box-shadow: none !important;
  outline: none !important;
  color: black !important;
  transition: none !important;
}

</style>