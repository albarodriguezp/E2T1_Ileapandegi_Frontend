<template>
  <div class="content">
    <div class="content2">
      <h1>{{ t('parameters.title') }}</h1>

      <!-- ===== Tabs ===== -->
      <div class="tabs">
        <button :class="{ active: activeTab === 'usuarios' }" @click="activeTab = 'usuarios'">{{ t('parameters.users') }}</button>
        <button :class="{ active: activeTab === 'grupos' }" @click="activeTab = 'grupos'">{{ t('parameters.groups') }}</button>
        <button :class="{ active: activeTab === 'turnos' }" @click="activeTab = 'turnos'">{{ t('parameters.shifts') }}</button>
      </div>

      <div class="tab-content">
        <!-- ===== Usuarios ===== -->
        <div v-if="activeTab === 'usuarios'" class="tab-section usuarios-grid">

          <!-- ===== Columna Crear ===== -->
          <div class="col">
            <h2>{{ t('parameters.createUser') }}</h2>

            <form @submit.prevent="crearUsuario">
              <div class="form-group">
                <label>{{ t('parameters.username') }}</label>
                <input v-model="usuario.username" required />
              </div>

              <div class="form-group">
                <label>{{ t('modal.email') }}</label>
                <input v-model="usuario.email" type="email" required />
              </div>

              <div class="form-group">
                <label>{{ t('appointments.password') }}</label>
                <input type="password" v-model="usuario.password" required />
              </div>

              <div class="form-group">
                <label>{{ t('parameters.role') }}</label>
                <select v-model="usuario.rol">
                  <option value="A">{{ t('parameters.admin') }}</option>
                  <option value="U">{{ t('parameters.user') }}</option>
                </select>
              </div>

              <button type="submit">{{ t('parameters.createUser') }}</button>
            </form>
          </div>

          <!-- ===== Columna Gestión ===== -->
          <div class="col">
            <h2>{{ t('parameters.userManagement') }}</h2>

            <!-- Buscador -->
            <div class="form-group">
              <input v-model="buscarUsuario" :placeholder="t('parameters.searchUser')" />
            </div>

            <div v-for="u in usuariosFiltrados" :key="u.id" class="user-row">
              <div class="user-info">
                <strong>{{ u.username }}</strong>
                <small>{{ u.email }}</small>
              </div>

              <div class="actions">
                <button class="btn-primary" @click="openEditUsuario(u)">{{ t('inventory.edit') }}</button>
                <button class="btn-danger" @click="openDeleteUsuario(u)">{{ t('inventory.delete') }}</button>
              </div>
            </div>
          </div>


        </div>


        <!-- ===== Grupos ===== -->
        <div v-if="activeTab === 'grupos'" class="tab-section grupos-grid">

          <!-- ===== Crear Grupo ===== -->
          <div class="col">
            <h2>{{ t('parameters.createGroup') }}</h2>

            <form @submit.prevent="crearGrupo">
              <div class="form-group">
                <label>{{ t('table.name') }}</label>
                <input v-model="grupo.nombre" required />
              </div>

              <button type="submit">{{ t('parameters.createGroup') }}</button>
            </form>
          </div>

          <!-- ===== Asignar Usuarios ===== -->
          <div class="col">
            <h2>{{ t('parameters.assignUsersToGroup') }}</h2>

            <form @submit.prevent="asignarUsuarios">
              <div class="form-group">
                <label>{{ t('parameters.selectGroup') }}</label>
                <select v-model="grupoSeleccionado">
                  <option disabled value="">{{ t('parameters.selectGroup') }}</option>
                  <option v-for="g in grupos" :key="g.id" :value="g.id">
                    {{ g.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>{{ t('parameters.searchGroupUser') }}</label>
                <input v-model="buscarUsuarioGrupo" :placeholder="t('parameters.searchGroupUser')" />
              </div>

              <div class="checkbox-list">
                <div v-for="u in usuariosFiltradosGrupo" :key="u.id" class="checkbox-item">
                  <input type="checkbox" :id="'grupo-user-' + u.id" :value="u.id" v-model="usuariosSeleccionados" />
                  <label :for="'grupo-user-' + u.id">{{ u.username }}</label>
                </div>
              </div>

<button type="submit" class="btn-submit">{{ t('parameters.assignUsersBtn') }}</button>
            </form>
          </div>

          <!-- ===== Gestión de Grupos ===== -->
          <div class="col">
            <h2>{{ t('parameters.groupManagement') }}</h2>

            <div v-for="g in grupos" :key="g.id" class="group-row">
              <span>{{ g.nombre }}</span>

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

        </div>


        <!-- ===== Turnos ===== -->
<div v-if="activeTab === 'turnos'" class="tab-section turnos-grid">

  <!-- ===== Crear Turno ===== -->
  <div class="col">
    <h2>{{ t('parameters.createShift') }}</h2>

    <form @submit.prevent="crearTurno">
      <div class="form-group">
        <label>{{ t('parameters.searchUserShift') }}</label>
        <input v-model="buscarUsuarioTurno" :placeholder="t('parameters.searchUserShift')" />

        <div class="checkbox-list">
          <div
            v-for="u in usuariosFiltradosTurno"
            :key="u.id"
            class="checkbox-item"
          >
            <input
              type="radio"
              :id="'turno-user-' + u.id"
              :value="u.username"
              v-model="turno.usuario"
            />
            <label :for="'turno-user-' + u.id">
              {{ u.username }}
            </label>
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

      <button type="submit">{{ t('parameters.createShift') }}</button>
    </form>
  </div>

  <!-- ===== Gestión de Turnos ===== -->
<div class="col">
  <h2>{{ t('parameters.shiftManagement') }}</h2>

  <!--  Filtros -->
  <div class="form-group">
    <input
      v-model="buscarTurno"
      :placeholder="t('parameters.searchUserShift')"
    />
  </div>

  <div class="form-group">
    <label>{{ t('parameters.filterByMonth') }}</label>
    <input
      type="month"
      v-model="filtroMes"
    />
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


</div>

      </div>
    </div>
  </div>

  <ModalParam v-if="showModal && modalType === 'usuario'" :title="t('parameters.editUser')" :submitText="t('modal.save')"
    @close="closeModal" @submit="editarUsuario">
    <div class="form-group">
      <label>{{ t('parameters.username') }}</label>
      <input v-model="usuarioEditando.username" />
    </div>

    <div class="form-group">
      <label>{{ t('modal.email') }}</label>
      <input v-model="usuarioEditando.email" />
    </div>

    <div class="form-group">
      <label>{{ t('parameters.role') }}</label>
      <select v-model="usuarioEditando.rol">
        <option value="A">{{ t('parameters.admin') }}</option>
        <option value="U">{{ t('parameters.user') }}</option>
      </select>
    </div>
  </ModalParam>


  <ModalConfirm v-if="showModal && modalType === 'delete'" :title="t('parameters.deleteUser')"
    :message="t('modal.deleteConfirm', { name: usuarioEditando?.username })" @close="closeModal" @confirm="eliminarUsuario" />

  <!-- ===== Modal Editar Grupo ===== -->
<ModalParam
  v-if="showModal && modalType === 'grupo'"
  :title="t('parameters.editGroup')"
  :submitText="t('modal.save')"
  @close="closeModal"
  @submit="editarGrupo"
>
  <ModalParam
  v-if="showModal && modalType === 'grupo'"
  :title="t('parameters.editGroup')"
  :submitText="t('modal.save')"
  @close="closeModal"
  @submit="editarGrupo"
>
  <div class="form-group">
    <label>{{ t('table.name') }}</label>
    <input v-model="grupoEditando.nombre" />
  </div>

  <div class="form-group">
    <label>{{ t('parameters.assignedUsers') }}</label>

    <div v-if="usuariosAsignadosGrupo.length === 0" class="empty">
      {{ t('parameters.groupUsers') }}
    </div>

    <div
      v-for="u in usuariosAsignadosGrupo"
      :key="u.id"
      class="assigned-user"
    >
      <span>{{ u.username }}</span>

      <button
        type="button"
        class="btn-danger"
        @click="quitarUsuarioDelGrupo(u.id)"
      >
        {{ t('parameters.removeUser') }}
      </button>
    </div>
  </div>
</ModalParam>

</ModalParam>

<!-- ===== Modal Eliminar Grupo ===== -->
<ModalConfirm
  v-if="showModal && modalType === 'delete-grupo'"
  :title="t('parameters.deleteGroup')"
  :message="t('modal.deleteConfirm', { name: grupoEditando?.nombre })"
  @close="closeModal"
  @confirm="eliminarGrupo"
/>

<!-- ===== Modal Editar Turno ===== -->
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

<!-- ===== Modal Eliminar Turno ===== -->
<ModalConfirm
  v-if="showModal && modalType === 'delete-turno'"
  :title="t('parameters.deleteShift')"
  :message="t('modal.deleteConfirm', { name: turnoEditando?.usuario })"
  @close="closeModal"
  @confirm="eliminarTurno"
/>

<ModalParam
  v-if="showModalInfo"
  :title="t('parameters.selectGroup')"
  :submitText="t('modal.save')"
  @close="showModalInfo = false"
  @submit="confirmarTurno"
>
  <p>{{ mensajeModalInfo }}</p>
</ModalParam>

<ModalConfirm
  v-if="showModal && modalType === 'confirm-usuario'"
  :title="t('parameters.createUser')"
  :message="t('modal.deleteConfirm', { name: usuarioEditando?.username })"
  @close="closeModal"
  @confirm="confirmarCrearUsuario"
/>

<ModalConfirm
  v-if="showModal && modalType === 'confirm-grupo'"
  :title="t('parameters.createGroup')"
  :message="t('modal.deleteConfirm', { name: grupoEditando?.nombre })"
  @close="closeModal"
  @confirm="confirmarCrearGrupo"
/>

<ModalParam
  v-if="showModal && modalType === 'info-asignacion'"
  :title="t('parameters.assignedUsers')"
  :submitText="t('modal.save')"
  @submit="closeModal"
>
  <p>{{ t('parameters.successAssign') }}</p>
</ModalParam>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalParam from '@/components/ModalParam.vue'
import ModalConfirm from '@/components/ModalConfirmParam.vue'

const { t } = useI18n()

/* ===== Estado general ===== */
const activeTab = ref('usuarios')
const showModal = ref(false)
const modalType = ref(null)
const usuarioEditando = ref(null)

/* ===== Usuarios ===== */
const usuario = ref({ username: '', email: '', password: '', rol: 'U' })

const usuarios = ref([
  { id: 1, username: 'Jon', email: 'jon@test.com', rol: 'U' },
  { id: 2, username: 'Anna', email: 'anna@test.com', rol: 'A' },
  { id: 3, username: 'Luis', email: 'luis@test.com', rol: 'U' }
])

const buscarUsuario = ref('')

const usuariosFiltrados = computed(() => {
  if (!buscarUsuario.value) return usuarios.value
  const texto = buscarUsuario.value.toLowerCase()

  return usuarios.value.filter(u =>
    (u.username || '').toLowerCase().includes(texto) ||
    (u.email || '').toLowerCase().includes(texto)
  )
})

/* ===== Modales usuarios ===== */
const openEditUsuario = (u) => {
  usuarioEditando.value = { ...u }
  modalType.value = 'usuario'
  showModal.value = true
}

const openDeleteUsuario = (u) => {
  usuarioEditando.value = u
  modalType.value = 'delete'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalType.value = null
  usuarioEditando.value = null
}

const editarUsuario = () => {
  const index = usuarios.value.findIndex(u => u.id === usuarioEditando.value.id)
  usuarios.value[index] = usuarioEditando.value
  closeModal()
}

const eliminarUsuario = () => {
  usuarios.value = usuarios.value.filter(u => u.id !== usuarioEditando.value.id)
  closeModal()
}

const usuarioPendiente = ref(null)

const crearUsuario = () => {
  usuarioPendiente.value = { ...usuario.value }
  modalType.value = 'confirm-usuario'
  showModal.value = true
}

const confirmarCrearUsuario = () => {
  usuarios.value.push({ ...usuarioPendiente.value, id: Date.now() })
  usuario.value = { username: '', email: '', password: '', rol: 'U' }
  usuarioPendiente.value = null
  closeModal()
}


/* ===== Grupos ===== */
const grupo = ref({ nombre: '' })
const grupos = ref([
  { id: 1, nombre: 'Grupo 1', usuarios: [1, 3] },
  { id: 2, nombre: 'Grupo 2', usuarios: [2] }
])

const grupoSeleccionado = ref('')
const buscarUsuarioGrupo = ref('')
const usuariosSeleccionados = ref([])

const usuariosFiltradosGrupo = computed(() => {
  if (!buscarUsuarioGrupo.value) return usuarios.value
  return usuarios.value.filter(u =>
    u.username.toLowerCase().includes(buscarUsuarioGrupo.value.toLowerCase())
  )
})

const grupoEditando = ref(null)

const openEditGrupo = (g) => {
  grupoEditando.value = { ...g }
  modalType.value = 'grupo'
  showModal.value = true
}

const openDeleteGrupo = (g) => {
  grupoEditando.value = g
  modalType.value = 'delete-grupo'
  showModal.value = true
}

const editarGrupo = () => {
  const index = grupos.value.findIndex(g => g.id === grupoEditando.value.id)
  grupos.value[index] = grupoEditando.value
  closeModal()
}

const eliminarGrupo = () => {
  grupos.value = grupos.value.filter(g => g.id !== grupoEditando.value.id)
  closeModal()
}

const quitarUsuarioDelGrupo = (userId) => {
  grupoEditando.value.usuarios =
    grupoEditando.value.usuarios.filter(id => id !== userId)
}


const grupoPendiente = ref(null)

const crearGrupo = () => {
  grupoPendiente.value = { ...grupo.value }
  modalType.value = 'confirm-grupo'
  showModal.value = true
}

const confirmarCrearGrupo = () => {
  grupos.value.push({ id: Date.now(), nombre: grupoPendiente.value.nombre })
  grupo.value.nombre = ''
  grupoPendiente.value = null
  closeModal()
}

const asignarUsuarios = () => {
  const grupo = grupos.value.find(g => g.id === grupoSeleccionado.value)
  if (!grupo) return

  grupo.usuarios = [...usuariosSeleccionados]

  usuariosSeleccionados.value = []
  grupoSeleccionado.value = ''
}

const usuariosAsignadosGrupo = computed(() => {
  if (!grupoEditando.value) return []

  return usuarios.value.filter(u =>
    grupoEditando.value.usuarios?.includes(u.id)
  )
})


/* ===== Turnos ===== */
const buscarUsuarioTurno = ref('')
const turno = ref({ usuario: '', tipo: 'A', fecha: '' })
const turnos = ref([])
const turnoEditando = ref(null)
const showModalInfo = ref(false)
const mensajeModalInfo = ref('')


const usuariosFiltradosTurno = computed(() => {
  if (!buscarUsuarioTurno.value) return usuarios.value
  return usuarios.value.filter(u =>
    u.username.toLowerCase().includes(buscarUsuarioTurno.value.toLowerCase())
  )
})
const turnoPendiente = ref(null)

const crearTurno = () => {
  // Guardamos el turno pendiente
  turnoPendiente.value = { ...turno.value }

  mensajeModalInfo.value = `¿Deseas crear el turno para "${turno.value.usuario}"?`
  showModalInfo.value = true
}

const confirmarTurno = () => {
  if (!turnoPendiente.value) return

  // Crear turno aquí
  console.log('Turno confirmado:', turnoPendiente.value)
  turnos.value.push({ ...turnoPendiente.value, id: Date.now() })
  // Limpiar
  turno.value = { usuario: '', tipo: 'A', fecha: '' }
  buscarUsuarioTurno.value = ''
  turnoPendiente.value = null
  showModalInfo.value = false
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

    // Filtro por usuario
    if (buscarTurno.value) {
      coincide = t.usuario.toLowerCase().includes(buscarTurno.value.toLowerCase())
    }

    // Filtro por mes
    if (filtroMes.value) {
      const turnoMes = t.fecha.slice(0, 7) 
      coincide = coincide && turnoMes === filtroMes.value
    }

    return coincide
  })
})

</script>


<style scoped>

/* ===== Usuarios en 2 columnas ===== */
.usuarios-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.col {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
}

/* Usuario fila */
.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .6rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info small {
  color: #666;
  font-size: .8rem;
}

/* Responsive */
@media (max-width: 900px) {
  .usuarios-grid {
    grid-template-columns: 1fr;
  }
}


h1 {
  margin-bottom: 2rem;
  color: #164e63;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #e0e0e0;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

/* Botón principal  */
.btn-primary {
  padding: 0.6rem 1.2rem;
  background-color: #164e63;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0f3b4d;
}

/* Botón eliminar */
.btn-danger {
  padding: 0.6rem 1.2rem;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-danger:hover {
  background-color: #b71c1c;
}


.actions {
  display: flex;
  gap: 0.5rem;
}


.tabs button.active {
  background-color: #164e63;
  color: white;
}

.tab-content {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
}

.tab-section {
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  position: relative;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button[type="submit"] {
  padding: 0.6rem 1.2rem;
  background-color: #164e63;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #0f3b4d;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.password-wrapper .toggle-password {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
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

.checkbox-item input[type="checkbox"] {
  margin-right: 0.5rem;
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

/* ===== Grupos en columnas ===== */
.grupos-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 2rem;
}

.group-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .6rem 0;
  border-bottom: 1px solid #e0e0e0;
}

/* Responsive */
@media (max-width: 1100px) {
  .grupos-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== Turnos en columnas ===== */
.turnos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
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

/* Ajuste para los filtros en gestión de turnos */
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

.assigned-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .4rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.assigned-user span {
  font-size: .9rem;
}

.btn-submit {
  margin-top: 1.5rem;
}

</style>
