<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>
        {{ item.is_occupied ? 'Finalizar uso' : 'Asignar equipamiento' }}
      </h2>

      <p v-if="!item.is_occupied">
        Asignando: <strong>{{ item.name }}</strong>
      </p>

      <p v-else>
        Finalizando uso del equipamiento:
        <strong>{{ item.name }}</strong><br />
        Responsable actual:
        <strong>{{ item.assigned_to }}</strong>
      </p>

      <!-- Selector de alumno con búsqueda -->
      <div v-if="!item.is_occupied" class="form-group">
        <label>Alumno responsable</label>

        <input
          type="text"
          v-model="search"
          placeholder="Buscar alumno..."
        />

        <ul v-if="search && filteredStudents.length" class="dropdown">
          <li
            v-for="student in filteredStudents"
            :key="student"
            @click="selectStudent(student)"
          >
            {{ student }}
          </li>
        </ul>

        <p v-if="search && !filteredStudents.length" class="no-results">
          No se encontraron alumnos
        </p>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" @click="$emit('close')">
          Cancelar
        </button>

        <button class="btn-confirm" @click="confirmAction">
          {{ item.is_occupied ? 'Finalizar uso' : 'Asignar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  students: {
    type: Array,
    required: true
    // Ejemplo:
    // ['Juan Pérez', 'María López', 'Pedro González']
  }
})

const emits = defineEmits(['close', 'confirm'])

const search = ref('')
const selectedStudent = ref(null)

// Reset cuando cambia el item
watch(() => props.item, () => {
  search.value = ''
  selectedStudent.value = null
})

const filteredStudents = computed(() =>
  props.students.filter(student =>
    student.toLowerCase().includes(search.value.toLowerCase())
  )
)

const selectStudent = (student) => {
  selectedStudent.value = student
  search.value = student
}

const confirmAction = () => {
  if (!props.item.is_occupied && !selectedStudent.value) {
    alert('Debe seleccionar un alumno')
    return
  }

  emits('confirm', {
    ...props.item,
    assigned_to: props.item.is_occupied ? null : selectedStudent.value,
    is_occupied: !props.item.is_occupied
  })
}
</script>

<style scoped>
/* ===== Overlay ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* ===== Modal ===== */
.modal {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== Inputs ===== */
.modal input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.modal input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  outline: none;
}

/* ===== Labels ===== */
.modal label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
}

/* ===== Dropdown ===== */
.dropdown {
  list-style: none;
  padding: 0;
  margin: 0.3rem 0 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  max-height: 150px;
  overflow-y: auto;
  background: white;
}

.dropdown li {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown li:hover {
  background: #f0f0f0;
}

.no-results {
  font-size: 0.8rem;
  color: #777;
  margin-top: 0.3rem;
}

/* ===== Actions ===== */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-cancel {
  background: #e0e0e0;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn-confirm {
  background: #1976d2;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn-confirm:hover {
  background: #115293;
}

/* ===== Responsive ===== */
@media (max-width: 450px) {
  .modal {
    width: 90%;
    padding: 1.5rem;
  }
}
</style>
