<template>
  <div class="tab-section turnos-grid">

    <!-- ===== Crear Turno ===== -->
    <div class="col">
      <h2>{{ t('parameters.createShift') }}</h2>

      <form @submit.prevent="crearTurno">
        <!-- Selección de estudiante -->
        <div class="form-group">
          <label>{{ t('parameters.searchUserShift') }}</label>
          <input v-model="buscarUsuarioTurno" placeholder="Buscar usuario" />

          <div class="checkbox-list">
            <div v-for="u in usuariosFiltradosTurno" :key="u.id" class="checkbox-item">
              <input type="radio" :value="u.id" v-model="turno.student_id" required />
              <label>{{ u.name }} {{ u.surnames }}</label>
            </div>
          </div>
        </div>

        <!-- Tipo de turno -->
        <div class="form-group">
          <label>{{ t('parameters.shiftType') }}</label>
          <select v-model="turno.type" required>
            <option value="A">{{ t('parameters.table') }}</option>
            <option value="M">{{ t('parameters.haircut') }}</option>
          </select>
        </div>

        <!-- Fecha -->
        <div class="form-group">
          <label>{{ t('parameters.date') }}</label>
          <input type="date" v-model="turno.date" required />
        </div>

        <button type="submit" class="btn-primary">
          {{ t('parameters.createShift') }}
        </button>
      </form>
    </div>

    <!-- ===== Gestión de Turnos ===== -->
    <div class="col">
      <h2>{{ t('parameters.shiftManagement') }}</h2>

      <div class="form-group">
        <input v-model="buscarTurno" placeholder="Buscar turno por usuario" />
      </div>

      <div class="form-group">
        <label>{{ t('parameters.filterByMonth') }}</label>
        <input type="month" v-model="filtroMes" />
      </div>

      <div v-if="turnosFiltrados.length === 0" class="empty">
        {{ t('parameters.noShifts') }}
      </div>

      <div v-for="turnoItem in turnosFiltrados" :key="turnoItem.id" class="turno-row">
        <div class="turno-info">
          <strong>{{ turnoItem.student.name }} {{ turnoItem.student.surnames }}</strong>
          <small>
            {{ turnoItem.type === 'A' ? t('parameters.table') : t('parameters.haircut') }} · {{ turnoItem.date }}
          </small>
        </div>

        <div class="actions">
          <button class="btn-primary" @click="openEditTurno(turnoItem)">
            {{ t('inventory.edit') }}
          </button>
          <button class="btn-danger" @click="openDeleteTurno(turnoItem)">
            {{ t('inventory.delete') }}
          </button>
        </div>
      </div>

    </div>

    <!-- ===== Modal Editar Turno ===== -->
    <ModalParam v-if="showModal && modalType === 'turno'" :title="t('parameters.editShift')"
      :submitText="t('modal.save')" @close="closeModal" @submit="editarTurno">
      <div class="form-group">
        <label>{{ t('parameters.username') }}</label>
        <input :value="turnoEditando.student.name + ' ' + turnoEditando.student.surnames" disabled />
      </div>

      <div class="form-group">
        <label>{{ t('parameters.shiftType') }}</label>
        <select v-model="turnoEditando.type">
          <option value="A">{{ t('parameters.table') }}</option>
          <option value="M">{{ t('parameters.haircut') }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>{{ t('parameters.date') }}</label>
        <input type="date" v-model="turnoEditando.date" />
      </div>
    </ModalParam>

    <!-- ===== Modal Eliminar Turno ===== -->
    <ModalConfirm v-if="showModal && modalType === 'delete-turno'" :title="t('parameters.deleteShift')"
      :message="t('modal.deleteConfirm', { name: turnoEditando?.student?.name })" @close="closeModal"
      @confirm="eliminarTurno" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'
import ModalParam from '@/components/ModalParam.vue'
import ModalConfirm from '@/components/ModalConfirmParam.vue'

const { t } = useI18n()

// ===== Estados =====
const usuarios = ref([])
const turnos = ref([])

const buscarUsuarioTurno = ref('')
const turno = ref({ student_id: '', type: 'A', date: '' })
const turnoEditando = ref(null)

const buscarTurno = ref('')
const filtroMes = ref('')

const showModal = ref(false)
const modalType = ref(null)

// ===== Computeds =====
const usuariosFiltradosTurno = computed(() => {
  if (!buscarUsuarioTurno.value) return usuarios.value
  return usuarios.value.filter(u =>
    u.name.toLowerCase().includes(buscarUsuarioTurno.value.toLowerCase()) ||
    u.surnames.toLowerCase().includes(buscarUsuarioTurno.value.toLowerCase())
  )
})

const turnosFiltrados = computed(() => {
  return turnos.value.filter(t => {
    let coincide = true
    if (buscarTurno.value) {
      coincide = t.student.name.toLowerCase().includes(buscarTurno.value.toLowerCase())
    }
    if (filtroMes.value) {
      coincide = t.date.slice(0, 7) === filtroMes.value
    }
    return coincide
  })
})

// ===== Métodos =====
const fetchUsuarios = async () => {
  try {
    const res = await api.get('/students')
    usuarios.value = res.data.data
  } catch (err) {
    console.error('Error cargando usuarios:', err)
  }
}

const fetchTurnos = async () => {
  try {
    const res = await api.get('/shifts')
    turnos.value = res.data
  } catch (err) {
    console.error('Error cargando turnos:', err)
  }
}

const crearTurno = async () => {
  try {
    await api.post('/shifts', { ...turno.value })
    turno.value = { student_id: '', type: 'A', date: '' }
    await fetchTurnos()
  } catch (err) {
    console.error('Error creando turno:', err)
  }
}

const openEditTurno = (t) => {
  turnoEditando.value = { ...t }
  modalType.value = 'turno'
  showModal.value = true
}

const editarTurno = async () => {
  try {
    await api.put(`/shifts/${turnoEditando.value.id}`, {
      type: turnoEditando.value.type,
      date: turnoEditando.value.date
    })
    await fetchTurnos()
    closeModal()
  } catch (err) {
    console.error('Error editando turno:', err)
  }
}

const openDeleteTurno = (t) => {
  turnoEditando.value = t
  modalType.value = 'delete-turno'
  showModal.value = true
}

const eliminarTurno = async () => {
  try {
    await api.delete(`/shifts/${turnoEditando.value.id}`)
    await fetchTurnos()
    closeModal()
  } catch (err) {
    console.error('Error eliminando turno:', err)
  }
}

const closeModal = () => {
  showModal.value = false
  modalType.value = null
}

// ===== Montado =====
onMounted(async () => {
  await fetchUsuarios()
  await fetchTurnos()
})
</script>

<style scoped>
.turnos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.col {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
}

.turno-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .6rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.turno-info {
  display: flex;
  flex-direction: column;
}

.turno-info small {
  color: #666;
  font-size: .8rem;
}

.empty {
  color: #777;
  font-style: italic;
}

.checkbox-list {
  border: 1px solid #ccc;
  border-radius: 6px;
  max-height: 150px;
  overflow-y: auto;
  padding: 0.5rem;
  margin-top: 0.3rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
}

.checkbox-item input[type="radio"] {
  margin-right: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 900px) {
  .turnos-grid {
    grid-template-columns: 1fr;
  }
}

.btn-primary {
  padding: 0.6rem 1.2rem;
  background-color: #164e63;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-danger {
  padding: 0.6rem 1.2rem;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
