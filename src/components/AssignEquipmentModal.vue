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
        Finalizando uso del equipamiento: <strong>{{ item.name }}</strong><br>
        Responsable actual: <strong>{{ item.assigned_to }}</strong>
      </p>

      <!-- Input solo si se va a asignar -->
      <div v-if="!item.is_occupied" class="form-group">
        <label for="user">Nombre del responsable</label>
        <input type="text" id="user" v-model="user" placeholder="Ingrese nombre del alumno" />
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
        <button class="btn-confirm" @click="confirmAction">
          {{ item.is_occupied ? 'Finalizar uso' : 'Asignar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['close', 'confirm'])

const user = ref('')

// Reset user cuando cambia el item
watch(() => props.item, () => {
  user.value = ''
})

const confirmAction = () => {
  if (!props.item.is_occupied && !user.value.trim()) {
    alert('Debe ingresar el nombre del responsable')
    return
  }

  emits('confirm', {
    ...props.item,
    assigned_to: props.item.is_occupied ? null : user.value.trim(),
    is_occupied: !props.item.is_occupied
  })
}
</script>

<style scoped>
/* ===== Overlay ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  /* top:0; right:0; bottom:0; left:0 */
  background: rgba(0, 0, 0, 0.5);
  /* fondo semi-transparente */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* ===== Modal ===== */
.modal {
  background: #ffffff;
  /* Color único para todas las modales */
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  text-align: left;
  height: auto;
}

/* ===== Form Inputs ===== */
.modal input,
.modal textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.modal input:focus,
.modal textarea:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

/* ===== Labels ===== */
.modal label {
  font-weight: 600;
  margin-bottom: 0.2rem;
  display: block;
}

/* ===== Actions Buttons ===== */
.modal .actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.modal button {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.modal button[type="submit"] {
  background: #1976d2;
  color: white;
}

.modal button[type="submit"]:hover {
  background: #115293;
}

.modal button[type="button"] {
  background: #e0e0e0;
  color: #333;
}

.modal button[type="button"]:hover {
  background: #bdbdbd;
}

/* Textarea */
.modal textarea {
  resize: vertical;
  min-height: 60px;
}

/* Responsivo */
@media (max-width: 450px) {
  .modal {
    width: 90%;
    padding: 1.5rem;
  }
}
</style>

