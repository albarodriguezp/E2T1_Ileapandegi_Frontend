<template>
  <div class="tab-section grupos-grid">

    <!-- ===== Crear Grupo ===== -->
    <div class="col">
      <h2>{{ t('parameters.createGroup') }}</h2>

      <form @submit.prevent="crearGrupo">
        <div class="form-group">
          <label>{{ t('table.name') }}</label>
          <input v-model="nuevoGrupo.name" required />
        </div>

        <button type="submit" class="btn-primary">{{ t('parameters.createGroup') }}</button>
      </form>
    </div>

    <!-- ===== Asignar Estudiantes ===== -->
    <div class="col">
      <h2>{{ t('parameters.assignUsersToGroup') }}</h2>

      <form @submit.prevent="asignarEstudiantes">
        <div class="form-group">
          <label>{{ t('parameters.selectGroup') }}</label>
          <select v-model="grupoSeleccionado">
            <option disabled value="">{{ t('parameters.selectGroup') }}</option>
            <option v-for="g in groupsStore.groups" :key="g.id" :value="g.id">
              {{ g.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ t('parameters.searchGroupUser') }}</label>
          <input v-model="buscarUsuarioGrupo" />
        </div>

        <div class="checkbox-list">
          <div v-for="u in estudiantesParaAsignar" :key="u.id" class="checkbox-item">
            <input type="checkbox" :value="u.id" v-model="estudiantesSeleccionados"
              :disabled="u.disabled || !grupoSeleccionado" />
            <label>
              {{ u.name }}
              <span v-if="u.group_id"> ({{ t('parameters.inGroup', { group: u.group_id }) }})</span>
            </label>
          </div>
        </div>

        <button type="submit" class="btn-primary">{{ t('parameters.assignUsersBtn') }}</button>
      </form>
    </div>

    <!-- ===== Gestión de Grupos ===== -->
    <div class="col">
      <h2>{{ t('parameters.groupManagement') }}</h2>

      <div v-for="g in groupsStore.groups" :key="g.id" class="group-row">
        <span>{{ g.name }}</span>

        <div class="actions">
          <button class="btn-primary" @click="openEditGrupo(g)">
            {{ t('inventory.edit') }}
          </button>
          <button class="btn-danger" @click="openDeleteGrupo(g)">
            {{ t('inventory.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Modal Editar Grupo ===== -->
    <ModalParam v-if="showModal && modalType === 'grupo'" :title="t('parameters.editGroup')"
      :submitText="t('modal.save')" @close="closeModal" @submit="editarGrupo">
      <div class="form-group">
        <label>{{ t('table.name') }}</label>
        <input v-model="grupoEditando.name" />
      </div>

      <div class="form-group">
        <label>{{ t('parameters.assignedUsers') }}</label>

        <div v-if="usuariosAsignadosGrupo.length === 0" class="empty">
          {{ t('parameters.groupUsers') }}
        </div>

        <div v-for="u in usuariosAsignadosGrupo" :key="u.id" class="assigned-user">
          <span>{{ u.name }}</span>
          <button type="button" class="btn-danger" @click="quitarEstudianteDelGrupo(u.id)">
            {{ t('parameters.removeUser') }}
          </button>
        </div>
      </div>
    </ModalParam>

    <!-- ===== Modal Eliminar Grupo ===== -->
    <ModalConfirm v-if="showModal && modalType === 'delete-grupo'" :title="t('parameters.deleteGroup')"
      :message="t('modal.deleteConfirm', { name: grupoEditando?.name })" @close="closeModal" @confirm="eliminarGrupo" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalParam from '@/components/ModalParam.vue'
import ModalConfirm from '@/components/ModalConfirmParam.vue'

import { useUsersStore } from '@/stores/useUsersStore'
import { useGroupsStore } from '@/stores/useGroupsStore'
import { useStudentsStore } from '@/stores/useStudentsStore'

const { t } = useI18n()

// ===== STORES =====
const usersStore = useUsersStore()
const groupsStore = useGroupsStore()
const studentsStore = useStudentsStore()

const grupos = groupsStore.grupos
const estudiantes = studentsStore.students

// ===== ESTADOS =====
const showModal = ref(false)
const modalType = ref(null)

const nuevoGrupo = ref({ name: '' })

const grupoSeleccionado = ref('')
const buscarUsuarioGrupo = ref('')
const estudiantesSeleccionados = ref([])

const grupoEditando = ref(null)

const usuariosAsignadosGrupo = computed(() => {
  if (!grupoEditando.value || !estudiantes) return []

  return estudiantes.filter(est => est.group_id === grupoEditando.value.id)
})

const estudiantesParaAsignar = computed(() => {
  return estudiantes.filter(est => !est.group_id)
})


// ===== MÉTODOS =====
const crearGrupo = async () => {
  if (!nuevoGrupo.value.name) return
  try {
    await groupsStore.addGroup({ name: nuevoGrupo.value.name, students: [] })
    nuevoGrupo.value.name = ''
    await groupsStore.fetchGroups()
  } catch (err) {
    console.error('Error creando grupo:', err)
  }
}

const openEditGrupo = (g) => {
  grupoEditando.value = { ...g }
  modalType.value = 'grupo'
  showModal.value = true
}

const editarGrupo = async () => {
  try {
    await groupsStore.updateGroup(grupoEditando.value)
    closeModal()
  } catch (err) {
    console.error('Error editando grupo:', err)
  }
}

const openDeleteGrupo = (g) => {
  grupoEditando.value = g
  modalType.value = 'delete-grupo'
  showModal.value = true
}

const eliminarGrupo = async () => {
  try {
    if (grupoEditando.value.students.length > 0) {
      alert('Este grupo tiene estudiantes asignados. No se puede eliminar hasta que se remuevan.')
      return
    }

    await groupsStore.deleteGroup(grupoEditando.value.id)
    closeModal()
  } catch (err) {
    console.error('Error eliminando grupo:', err)
  }
}

const quitarEstudianteDelGrupo = async (studentId) => {
      const estudiante = estudiantes.find(est => est.id === studentId)

      console.log(estudiante);
  try {
    // Encontramos al estudiante en la lista de estudiantes
    const estudiante = estudiantes.find(est => est.id === studentId)
    if (!estudiante) return
    // Actualizamos el group_id a null para quitarlo del grupo
    estudiante.group_id = null

    // Llamamos al método updateStudent para actualizar la base de datos
    await studentsStore.updateStudent(estudiante)

    // Luego, actualizamos el grupo eliminando al estudiante
    grupoEditando.value.students = grupoEditando.value.students.filter(student => student.id !== studentId)

    // Refrescamos la lista de estudiantes para que se refleje en la tabla de asignación
    await studentsStore.fetchStudents()
    await groupsStore.fetchGroups()

  } catch (err) {
    console.error('Error quitando estudiante del grupo:', err)
  }
}


const asignarEstudiantes = async () => {
  if (!grupoSeleccionado.value || estudiantesSeleccionados.value.length === 0) {
    alert('Por favor, selecciona un grupo y estudiantes para asignar.')
    return
  }

  const grupoActual = grupos.value.find(g => g.id === grupoSeleccionado.value)
  if (!grupoActual) return

  grupoActual.students = estudiantesSeleccionados.value.map(id => ({ student_id: id }))

  try {
    await groupsStore.updateGroup(grupoActual)
    estudiantesSeleccionados.value = []
    grupoSeleccionado.value = ''
    await groupsStore.fetchGroups()
  } catch (err) {
    console.error('Error asignando estudiantes al grupo:', err)
  }
}

const closeModal = () => {
  showModal.value = false
  modalType.value = null
}

// ===== CARGAR DATOS =====
onMounted(async () => {
  await usersStore.fetchUsuarios()
  await groupsStore.fetchGroups()
  await studentsStore.fetchStudents()
})
</script>

<style scoped>
/* ===== Grupos en columnas ===== */
.grupos-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 2rem;
}

.col {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
}

.group-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .6rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.assigned-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .4rem 0;
  border-bottom: 1px solid #e0e0e0;
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

.checkbox-item input[type="checkbox"] {
  margin-right: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 1100px) {
  .grupos-grid {
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
