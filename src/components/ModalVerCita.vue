<template>
  <div class="modal-backdrop" @click.self="cerrar">
    <div class="modal">
      <button class="cerrar-btn" @click="cerrar">X</button>
      <h2>{{ t('appointments.view') }}</h2>

      <div v-if="cargando" class="loading">{{ t('appointments.loadingError') }}</div>
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="cargarDetalle" class="retry-btn">{{ t('appointments.retry') }}</button>
      </div>
      <div v-else-if="citaDetalle && Object.keys(citaDetalle).length > 0">
        <div class="form-group">
          <label>{{ t('appointments.client') }}:</label>
          <input type="text" :value="citaDetalle.client?.name + ' ' + (citaDetalle.client?.surnames || '')" readonly />
        </div>

        <div class="form-group">
          <label>{{ t('appointments.student') }}:</label>
          <input type="text" :value="citaDetalle.student?.name + ' ' + (citaDetalle.student?.surnames || '')" readonly />
        </div>

        <div class="form-group">
          <label>{{ t('appointments.chair') }}:</label>
          <input type="text" :value="'Silla ' + citaDetalle.seat" readonly />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('appointments.date') }}:</label>
            <input type="text" :value="citaDetalle.date" readonly />
          </div>

          <div class="form-group">
            <label>{{ t('appointments.startTime') }}:</label>
            <input type="text" :value="citaDetalle.start_time" readonly />
          </div>

          <div class="form-group">
            <label>{{ t('appointments.endTime') }}:</label>
            <input type="text" :value="citaDetalle.end_time" readonly />
          </div>
        </div>

        <div class="form-group" v-if="citaDetalle.services && citaDetalle.services.length > 0">
          <label>{{ t('appointments.services') }}:</label>
          <div class="servicios-lista-readonly">
            <div v-for="s in citaDetalle.services" :key="s.id" class="servicio-item-readonly">
               {{ s.service?.name || t('appointments.services') }} - {{ s.service?.duration || 0 }}min - {{ s.service?.price || 0 }}€
            </div>
          </div>
        </div>

        <div class="form-group precio-total-readonly">
          <label>{{ t('appointments.totalPrice') }}:</label>
          <input type="text" :value="precioTotal.toFixed(2) + '€'" readonly />
        </div>

        <div class="form-group">
          <label>{{ t('appointments.comments') }}:</label>
          <textarea :value="citaDetalle.comments || t('modal.no_observations')" readonly rows="3"></textarea>
        </div>

        <div class="acciones">
          <button class="eliminar-btn" @click="eliminar">{{ t('appointments.delete') }}</button>
          <button class="editar-btn" @click="editar">{{ t('appointments.edit') }}</button>
          <button class="cerrar-btn-secondary" @click="cerrar">{{ t('modal.close') }}</button>
        </div>
      </div>
      <div v-else class="warning">
        {{ t('appointments.errorLoading') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAppointment } from '@/services/api'

const { t } = useI18n()

const props = defineProps({ 
  id: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['cerrar', 'editar', 'eliminar'])

const citaDetalle = ref({})
const cargando = ref(false)
const error = ref(null)

const precioTotal = computed(() => {
  if (!citaDetalle.value || !citaDetalle.value.services) return 0
  return citaDetalle.value.services.reduce((sum, s) => {
    const price = s.service?.price ?? s.price ?? 0
    return sum + (parseFloat(price) || 0)
  }, 0)
})

async function cargarDetalle() {
  if (!props.id) {
    error.value = t('appointments.errorLoading')
    return
  }

  cargando.value = true
  error.value = null

  try {
    const data = await getAppointment(props.id)
    citaDetalle.value = data

  } catch (e) {

    error.value = e.message || t('appointments.errorLoading')
  } finally {
    cargando.value = false
  }
}

function cerrar() {
  emit('cerrar')
}

function editar() {
  emit('editar', citaDetalle.value)
}

function eliminar() {
  emit('eliminar', props.id)
}

onMounted(() => {
  cargarDetalle()
})

watch(() => props.id, (newId) => {
  if (newId) {
    cargarDetalle()
  }
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 999999 !important;
}

.modal {
  background: white !important;
  border-radius: 8px !important;
  padding: 20px 25px !important;
  width: 600px !important;
  max-width: 95vw !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  position: relative !important;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15) !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 15px !important;
  z-index: 999999 !important;
}

.cerrar-btn {
  position: absolute !important;
  top: 10px !important;
  right: 12px !important;
  border: none !important;
  background: transparent !important;
  font-weight: bold !important;
  font-size: 16px !important;
  cursor: pointer !important;
}

.cerrar-btn:hover {
  color: #c0392b !important;
}

h2 {
  margin: 0 0 10px 0 !important;
  padding-right: 30px !important;
  font-size: 24px !important;
  color: #2c3e50 !important;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

label {
  font-weight: 600;
  font-size: 14px;
  color: #555;
}

input, textarea {
  padding: 8px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  font-family: inherit;
}

input[readonly], textarea[readonly] {
  background-color: #f5f5f5;
  color: #333;
  cursor: default;
}

.servicios-lista-readonly {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f5f5f5;
  max-height: 200px;
  overflow-y: auto;
}

.servicio-item-readonly {
  padding: 8px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #82d8d8;
  font-size: 14px;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: #3498db;
  font-size: 18px;
}

.error {
  padding: 20px;
  background: #fee;
  border: 2px solid #fcc;
  border-radius: 8px;
  color: #c33;
  text-align: center;
}

.retry-btn {
  margin-top: 15px;
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.retry-btn:hover {
  background: #2980b9;
}

.warning {
  padding: 20px;
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  text-align: center;
}

.acciones {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid #ddd;
}

@media (max-width: 700px) {
  .modal {
    width: calc(100% - 32px) !important;
    padding: 16px !important;
  }

  .form-row {
    grid-template-columns: 1fr !important;
  }

  .acciones {
    flex-direction: column-reverse;
    gap: 8px;
    align-items: stretch;
  }
}
</style>