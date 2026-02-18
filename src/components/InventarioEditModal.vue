<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal edit-modal">
      <h2>{{ t('inventory.edit') }} {{ t('inventory.material') }}</h2>
      <form @submit.prevent="submit">
        <label>{{ t('table.name') }}</label>
        <input v-model="local.name" required />

        <label>{{ t('inventory.batch') }}</label>
        <input v-model="local.batch" />

        <label>{{ t('inventory.brand') }}</label>
        <input v-model="local.brand" />

        <label>{{ t('inventory.quantity') }}</label>
        <input type="number" v-model.number="local.stock" required />

        <label>{{ t('inventory.minStock') }}</label>
        <input type="number" v-model.number="local.min_stock" required />

        <label>{{ t('inventory.category') }}</label>
        <select v-model="local.category_id" required>
          <option disabled value="">{{ t('appointments.selectClient') }}</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>


        <label>{{ t('inventory.expirationDate') }}</label>
        <input type="date" v-model="local.expiration_date" />

        <label>{{ t('inventory.description') }}</label>
        <textarea v-model="local.description" />

        <div class="actions">
          <button type="submit">{{ t('modal.save') }}</button>
          <button type="button" @click="emit('close')">{{ t('modal.cancel') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCategories } from '@/services/api'

const { t } = useI18n()
const props = defineProps({ item: Object })
const emit = defineEmits(['close', 'submit'])

const local = reactive({})
const categories = ref([])

const fetchCategories = async () => {
  categories.value = await getCategories()
}

watch(
  () => props.item,
  val => {
    Object.assign(local, val)
    if (val?.category?.id) {
      local.category_id = val.category.id
    }
  },
  { immediate: true }
)

onMounted(fetchCategories)

const submit = () => emit('submit', local)

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
  background: #9CE0DB;
  color: black;
}

.modal button[type="submit"]:hover {
  background: #9CE0DB;
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
