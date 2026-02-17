<template>
  <div class="tab-section turnos-grid">

    <!-- ===== Crear Turno ===== -->
    <div class="col">
      <h2>{{ t('parameters.createShift') }}</h2>

      <form @submit.prevent="crearTurno">
        <div class="form-group">
          <label>{{ t('parameters.searchUserShift') }}</label>
          <input v-model="buscarUsuarioTurno" />

          <div class="checkbox-list">
            <div
              v-for="u in usuariosFiltradosTurno"
              :key="u.id"
              class="checkbox-item"
            >
              <input
                type="radio"
                :value="u.username"
                v-model="turno.usuario"
              />
              <label>{{ u.username }}</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('parameters.shiftType') }}</label>
          <select v-model="turno.tipo">
            <option value="A">{{ t('parameters.table') }}</option>
            <option value="M">{{ t('parameters.haircut') }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ t('parameters.date') }}</label>
          <input type="date" v-model="turno.fecha" required />
        </div>

        <button type="submit" class="btn-primary">{{ t('parameters.createShift') }}</button>
      </form>
    </div>

    <!-- ===== Gestión ===== -->
    <div class="col">
      <h2>{{ t('parameters.shiftManagement') }}</h2>

      <div class="form-group">
        <input v-model="buscarTurno" :placeholder="t('parameters.searchUserShift')" />
      </div>

      <div class="form-group">
        <label>{{ t('parameters.filterByMonth') }}</label>
        <input type="month" v-model="filtroMes" />
      </div>

      <div v-if="turnosFiltrados.length === 0" class="empty">
        {{ t('parameters.noShifts') }}
      </div>

      <div
        v-for="t in turnosFiltrados"
        :key="t.id"
        class="turno-row"
      >
        <div class="turno-info">
          <strong>{{ t.usuario }}</strong>
          <small>
            {{ t.tipo === 'A' ? t('parameters.table') : t('parameters.haircut') }} · {{ t.fecha }}
          </small>
        </div>

        <div class="actions">
          <button class="btn-primary" @click="openEditTurno(t)">
            {{ t('inventory.edit') }}
          </button>
          <button class="btn-danger" @click="openDeleteTurno(t)">
            {{ t('inventory.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Modal Editar ===== -->
    <ModalParam
      v-if="showModal && modalType === 'turno'"
      :title="t('parameters.editShift')"
      :submitText="t('modal.save')"
      @close="closeModal"
      @submit="editarTurno"
    >
      <div class="form-group">
        <label>{{ t('parameters.username') }}</label>
        <input v-model="turnoEditando.usuario" disabled />
      </div>

      <div class="form-group">
        <label>{{ t('parameters.shiftType') }}</label>
        <select v-model="turnoEditando.tipo">
          <option value="A">{{ t('parameters.table') }}</option>
          <option value="M">{{ t('parameters.haircut') }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>{{ t('parameters.date') }}</label>
        <input type="date" v-model="turnoEditando.fecha" />
      </div>
    </ModalParam>

    <!-- ===== Modal Eliminar ===== -->
    <ModalConfirm
      v-if="showModal && modalType === 'delete-turno'"
      :title="t('parameters.deleteShift')"
      :message="t('modal.deleteConfirm', { name: turnoEditando?.usuario })"
      @close="closeModal"
      @confirm="eliminarTurno"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalParam from '@/components/ModalParam.vue'
import ModalConfirm from '@/components/ModalConfirmParam.vue'

const { t } = useI18n()

const showModal = ref(false)
const modalType = ref(null)

const usuarios = ref([
  { id: 1, username: 'Jon' },
  { id: 2, username: 'Anna' },
  { id: 3, username: 'Luis' }
])

const buscarUsuarioTurno = ref('')
const turno = ref({ usuario: '', tipo: 'A', fecha: '' })
const turnos = ref([])
const turnoEditando = ref(null)

const usuariosFiltradosTurno = computed(() => {
  if (!buscarUsuarioTurno.value) return usuarios.value
  return usuarios.value.filter(u =>
    u.username.toLowerCase().includes(buscarUsuarioTurno.value.toLowerCase())
  )
})

const crearTurno = () => {
  turnos.value.push({ ...turno.value, id: Date.now() })
  turno.value = { usuario: '', tipo: 'A', fecha: '' }
}

const openEditTurno = (t) => {
  turnoEditando.value = { ...t }
  modalType.value = 'turno'
  showModal.value = true
}

const openDeleteTurno = (t) => {
  turnoEditando.value = t
  modalType.value = 'delete-turno'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalType.value = null
}

const editarTurno = () => {
  const index = turnos.value.findIndex(t => t.id === turnoEditando.value.id)
  turnos.value[index] = turnoEditando.value
  closeModal()
}

const eliminarTurno = () => {
  turnos.value = turnos.value.filter(t => t.id !== turnoEditando.value.id)
  closeModal()
}

const buscarTurno = ref('')
const filtroMes = ref('')

const turnosFiltrados = computed(() => {
  return turnos.value.filter(t => {
    let coincide = true

    if (buscarTurno.value) {
      coincide = t.usuario.toLowerCase().includes(buscarTurno.value.toLowerCase())
    }

    if (filtroMes.value) {
      const turnoMes = t.fecha.slice(0, 7)
      coincide = coincide && turnoMes === filtroMes.value
    }

    return coincide
  })
})
</script>
<style scoped>
/* ===== Turnos en columnas ===== */
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

.col .form-group input[type="month"] {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  margin-top: 0.3rem;
}

/* Responsive */
@media (max-width: 900px) {
  .turnos-grid {
    grid-template-columns: 1fr;
  }
}

/* Botones */
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
