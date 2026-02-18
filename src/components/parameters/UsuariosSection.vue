<template>
  <div class="tab-section usuarios-grid">

    <!-- Crear usuario + student -->
    <div class="col">
      <h2>{{ t('parameters.createUser') }}</h2>
      <form @submit.prevent="crearUsuarioYStudent">

        <!-- Usuario -->
        <div class="form-group">
          <label>{{ t('parameters.username') }}</label>
          <input v-model="usuario.username" required />
        </div>

        <div class="form-group">
          <label>{{ t('modal.email') }}</label>
          <input v-model="usuario.email" type="email" required />
          <small v-if="errores.email" class="error">{{ errores.email }}</small>
        </div>

        <div class="form-group">
          <label>{{ t('appointments.password') }}</label>
          <input type="password" v-model="usuario.password" required placeholder="Min 6 caracteres" />
          <small v-if="errores.password" class="error">{{ errores.password }}</small>
        </div>

        <div class="form-group">
          <label>{{ t('parameters.role') }}</label>
          <select v-model="usuario.rol">
            <option value="A">{{ t('parameters.admin') }}</option>
            <option value="U">{{ t('parameters.user') }}</option>
          </select>
        </div>

        <!-- Student -->
        <h3>{{ t('parameters.studentData') }}</h3>
        <div class="form-group">
          <label>{{ t('parameters.name') }}</label>
          <input v-model="student.name" required />
        </div>

        <div class="form-group">
          <label>{{ t('parameters.surnames') }}</label>
          <input v-model="student.surnames" required />
        </div>

        <div class="form-group">
          <label>{{ t('parameters.selectGroup') }}</label>
          <select v-model="student.group_id">
            <option disabled value="">{{ t('parameters.selectGroup') }}</option>
            <option v-for="g in groupsStore.groups" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </div>

        <button type="submit" class="btn-primary">{{ t('parameters.createUser') }}</button>
      </form>
    </div>

    <!-- Gestión de usuarios -->
    <div class="col">
      <h2>{{ t('parameters.userManagement') }}</h2>
      <div class="form-group">
        <input v-model="buscarUsuario" :placeholder="t('parameters.searchUser')" />
      </div>

      <div v-for="u in usuariosFiltrados" :key="u.id" class="user-row">
        <div class="user-info">
          <strong>{{ u.username }}</strong>
          <small>{{ u.email }}</small>
        </div>

        <div class="actions">
          <button class="btn-primary" @click="openEditUsuario(u)">
            {{ t('inventory.edit') }}
          </button>
          <button class="btn-danger" @click="openDeleteUsuario(u)">
            {{ t('inventory.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Editar -->
    <ModalParam v-if="showModal && modalType === 'usuario'" :title="t('parameters.editUser')"
      :submitText="t('modal.save')" @close="closeModal" @submit="editarUsuario">
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

    <!-- Modal Eliminar -->
    <ModalConfirm v-if="showModal && modalType === 'delete'" :title="t('parameters.deleteUser')"
      :message="t('modal.deleteConfirm', { name: usuarioEditando?.username })" @close="closeModal"
      @confirm="eliminarUsuario" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUsersStore } from '@/stores/useUsersStore'
import { useStudentsStore } from '@/stores/useStudentsStore'
import { storeToRefs } from 'pinia'
import ModalParam from '@/components/ModalParam.vue'
import ModalConfirm from '@/components/ModalConfirmParam.vue'
import { useGroupsStore } from '@/stores/useGroupsStore'

const { t } = useI18n()
const usersStore = useUsersStore()
const studentsStore = useStudentsStore()
const { usuarios } = storeToRefs(usersStore)
const groupsStore = useGroupsStore()

const usuario = ref({ username: '', email: '', password: '', rol: 'U' })
const student = ref({ name: '', surnames: '', group_id: null })
const usuarioEditando = ref(null)
const showModal = ref(false)
const modalType = ref(null)
const buscarUsuario = ref('')
const errores = ref({ email: '', password: '' })

// Validaciones
const validarUsuario = () => {
  let valido = true
  errores.value.email = ''
  errores.value.password = ''

  if (!usuario.value.password || usuario.value.password.length < 6) {
    errores.value.password = 'La contraseña debe tener al menos 6 caracteres.'
    valido = false
  }

  const existeEmail = usuarios.value.some(u => u.email === usuario.value.email)
  if (existeEmail) {
    errores.value.email = 'Ya existe un usuario con este email.'
    valido = false
  }

  return valido
}

// Función para crear solo el usuario
const crearUsuario = async (payload) => {
  try {
    const res = await usersStore.addUsuario(payload) // Llamada a tu store para crear el usuario
    return res // Retornamos el usuario creado para usar el ID
  } catch (err) {
    console.error('Error creando usuario:', err)
    throw err
  }
}

// Función para crear un estudiante usando el último usuario creado
const crearStudent = async (studentPayload) => {
  try {
    console.log(studentPayload);

    // Ahora creamos el estudiante usando el ID del último usuario
    const res = await studentsStore.addStudent(studentPayload);
    console.log('Estudiante creado:', res)
  } catch (err) {
    console.error('Error creando student:', err)
    throw err
  }
}


// Crear usuario + student
const crearUsuarioYStudent = async () => {
  if (!validarUsuario()) return

  try {
    // Paso 1: Crear usuario
    const nuevoUsuario = await crearUsuario(usuario.value)

    if (!nuevoUsuario?.id) {
      console.error('Nuevo usuario no tiene ID, revisar API o store')
      return
    }

    console.log("Nuevo usuario creado", nuevoUsuario)
    // Paso 2: Crear student
    await crearStudent({
      user_id: nuevoUsuario.id,
      name: student.value.name,
      surnames: student.value.surnames,
      group_id: student.value.group_id
    })

    // Reset de los formularios
    usuario.value = { username: '', email: '', password: '', rol: 'U' }
    student.value = { name: '', surnames: '', group_id: null }
    await usersStore.fetchUsuarios()
    await studentsStore.fetchStudents()
    await groupsStore.fetchGroups()
    
  } catch (err) {
    console.error('Error creando usuario y student:', err)

    if (err.response?.status === 422) {
      // Si el error es un 422 (email ya existe), mostrar el mensaje de error en el campo de email
      errores.value.email = 'Este email ya está en uso. Por favor, utiliza otro.'
    } else {
      // En otros errores, limpiar el campo email
      errores.value.email = ''
    }
  }
}

// Filtrado de usuarios
const usuariosFiltrados = computed(() => {
  if (!usuarios.value) return []
  const lista = usuarios.value
  if (!buscarUsuario.value) return lista
  const texto = buscarUsuario.value.toLowerCase()
  return lista.filter(u =>
    u.username.toLowerCase().includes(texto) ||
    u.email.toLowerCase().includes(texto)
  )
})

// Carga inicial
onMounted(async () => {
  await usersStore.fetchUsuarios()
  await studentsStore.fetchStudents()
  await groupsStore.fetchGroups()
})

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

const editarUsuario = async () => {
  await usersStore.updateUsuario(usuarioEditando.value)
  closeModal()
}

const eliminarUsuario = async () => {
  await usersStore.deleteUsuario(usuarioEditando.value.id)
  closeModal()
}
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

.actions {
  display: flex;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 900px) {
  .usuarios-grid {
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

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.error {
  color: #d32f2f;
  font-size: 0.85rem;
}
</style>
