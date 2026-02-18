<template>
  <div class="content">
    <div class="content2">

      <h1>{{ t('inventory.title') }}</h1>

      <!-- Tabs -->
      <div class="tabs">
        <button :class="{ active: activeTab === 'material' }" @click="activeTab = 'material'">
          {{ t('inventory.material') }}
        </button>

        <button :class="{ active: activeTab === 'equipamientos' }" @click="activeTab = 'equipamientos'">
          {{ t('inventory.equipment') }}
        </button>
      </div>

      <div v-if="activeTab === 'material'">
        <!-- Header -->
        <div class="header">
          <h1>
            {{ materialView === 'items' ? t('inventory.material') : t('inventory.materialCategories') }}
          </h1>

          <div style="display:flex; gap:0.5rem">
            <button v-if="materialView === 'items'" class="btn-add" @click="openModal('add')">
              {{ t('inventory.addMaterial') }}
            </button>

            <button v-if="materialView === 'items'" class="btn-manage" @click="materialView = 'categories'">
              📂 {{ t('inventory.manageCategories') }}
            </button>

            <button v-if="materialView === 'categories'" class="btn-back" @click="materialView = 'items'">
              {{ t('inventory.backToMaterials') }}
            </button>
          </div>
        </div>

        <div v-if="materialView === 'items'">

          <!-- Buscador -->
          <input v-model="search" type="text" :placeholder="t('inventory.searchMaterial')" class="search-input" />

          <!-- Tabla -->
          <div class="table-scroll">
            <table class="inventario-table">
              <thead>
                <tr>
                  <th>{{ t('inventory.batch') }}</th>
                  <th>{{ t('inventory.name') }}</th>
                  <th>{{ t('inventory.quantity') }}</th>
                  <th>{{ t('inventory.category') }}</th>
                  <th>{{ t('inventory.brand') }}</th>
                  <th>{{ t('inventory.expirationDate') }}</th>
                  <th>{{ t('inventory.description') }}</th>
                  <th>{{ t('table.actions') }}</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in paginatedData" :key="item.id">
                  <td>{{ item.batch }}</td>
                  <td>{{ item.name }}</td>
                  <td :class="{ lowStock: item.stock <= item.min_stock }">{{ item.stock }}</td>
                  <td>{{ item.category.name }}</td>
                  <td>{{ item.brand }}</td>
                  <td>{{ formatDate(item.expiration_date) }}</td>
                  <td class="description">{{ item.description }}</td>
                  <td class="actions">
                    <button class="btn-tabla-edit" @click="openModal('edit', item)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-tabla-delete" @click="openModal('delete', item)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>

                <tr v-if="paginatedData.length === 0">
                  <td colspan="8" class="empty">{{ t('inventory.noResults') }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">«</button>
            <span>{{ t('inventory.page') }} {{ currentPage }} {{ t('inventory.of') }} {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
          </div>

        </div>

        <div v-if="materialView === 'categories'">
          <button class="btn-add" @click="openCategoryModal('add')">
            {{ t('inventory.addCategory') }}
          </button>

          <input v-model="categorySearch" type="text" :placeholder="t('inventory.searchCategory')" class="search-input" />

          <div class="table-scroll">
            <table class="inventario-table">
              <thead>
                <tr>
                  <th>{{ t('table.id') }}</th>
                  <th>{{ t('table.name') }}</th>
                  <th>{{ t('table.actions') }}</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="cat in filteredCategories" :key="cat.id">
                  <td>{{ cat.id }}</td>
                  <td>{{ cat.name }}</td>
                  <td class="actions">
                    <button class="btn-tabla-edit" @click="openCategoryModal('edit', cat)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-tabla-delete" @click="openCategoryModal('delete', cat)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredCategories.length === 0">
                  <td colspan="3" class="empty">{{ t('inventory.noCategories') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>




      <!-- ===== EQUIPAMIENTOS ===== -->
      <div v-if="activeTab === 'equipamientos'">

        <div class="header">
          <h1>{{ t('inventory.equipment') }}</h1>
          <button class="btn-add" @click="openEquipmentModal('add')">
            {{ t('inventory.addEquipment') }}
          </button>
        </div>

        <!-- Selector sub-tabs para Equipamientos -->
        <div class="equipment-subtabs">
          <button :class="{ active: equipmentView === 'lista' }" @click="equipmentView = 'lista'">{{ t('inventory.completeList') }}</button>
          <button :class="{ active: equipmentView === 'gestion' }" @click="equipmentView = 'gestion'">{{ t('inventory.equipmentManagement') }}</button>
        </div>

        <!-- Vista Gestión con dos columnas -->
        <div v-if="equipmentView === 'gestion'" class="equipment-columns">
          <!-- Equipamientos disponibles -->
          <div class="column">
            <h2>{{ t('inventory.available') }}</h2>
            <div class="table-scroll">
              <table class="inventario-table">
                <thead>
                  <tr>
                    <th>{{ t('table.name') }}</th>
                    <th>{{ t('inventory.brand') }}</th>
                    <th>{{ t('inventory.label') }}</th>
                    <th>{{ t('table.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in availableEquipments" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.brand }}</td>
                    <td>{{ item.label }}</td>
                    <td class="actions">
                      <button class="btn-tabla-assign" @click="assignEquipment(item)">
                        <i class="bi bi-person-plus"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="availableEquipments.length === 0">
                    <td colspan="4" class="empty">{{ t('inventory.noAvailableEquipments') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Equipamientos ocupados -->
          <div class="column">
            <h2>{{ t('inventory.occupied') }}</h2>
            <div class="table-scroll">
              <table class="inventario-table">
                <thead>
                  <tr>
                    <th>{{ t('table.name') }}</th>
                    <th>{{ t('inventory.brand') }}</th>
                    <th>{{ t('inventory.label') }}</th>
                    <th>{{ t('appointments.responsible') }}</th>
                    <th>{{ t('table.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in occupiedEquipments" :key="item.student_equipment_id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.brand }}</td>
                    <td>{{ item.label }}</td>
                    <td>{{ item.responsible }}</td>
                    <td class="actions">
                      <button class="btn-tabla-assign" @click="finishEquipmentUsage(item.student_equipment_id)" :title="t('inventory.finishUsage')">
                        <i class="bi bi-check-circle"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="occupiedEquipments.length === 0">
                    <td colspan="5" class="empty">{{ t('inventory.noOccupiedEquipments') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Vista Lista Completa -->
        <div v-if="equipmentView === 'lista'">
          <input v-model="equipmentSearch" type="text" :placeholder="t('inventory.searchEquipment')"
            class="search-input" />

          <div class="table-scroll">
            <table class="inventario-table">
              <thead>
                <tr>
                  <th>{{ t('table.name') }}</th>
                  <th>{{ t('inventory.brand') }}</th>
                  <th>{{ t('inventory.label') }}</th>
                  <th>{{ t('inventory.description') }}</th>
                  <th>{{ t('table.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in equipmentPaginatedData" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.brand }}</td>
                  <td>{{ item.label }}</td>
                  <td>{{ item.description }}</td>
                  <td class="actions">
                    <button class="btn-tabla-edit" @click="openEquipmentModal('edit', item)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-tabla-delete" @click="openEquipmentModal('delete', item)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredEquipments.length === 0">
                  <td colspan="5" class="empty">{{ t('inventory.noResults') }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination">
            <button @click="equipmentPrevPage" :disabled="equipmentCurrentPage === 1">«</button>
            <span>{{ t('inventory.page') }} {{ equipmentCurrentPage }} {{ t('inventory.of') }} {{ equipmentTotalPages }}</span>
            <button @click="equipmentNextPage" :disabled="equipmentCurrentPage === equipmentTotalPages">»</button>
          </div>
        </div>
      </div>


    </div>


    <!-- ===== MODAL ===== -->
    <InventarioAddModal v-if="showModal && modalType === 'add'" @close="closeModal" @submit="submitForm" />

    <InventarioEditModal v-if="showModal && modalType === 'edit'" :item="form" @close="closeModal"
      @submit="submitForm" />

    <InventarioDeleteModal v-if="showModal && modalType === 'delete'" :item="form" @close="closeModal"
      @confirm="deleteItem" />

    <EquipmentAddModal v-if="showEquipmentModal && equipmentModalType === 'add'" @close="closeEquipmentModal"
      @submit="submitEquipment" />

    <EquipmentEditModal v-if="showEquipmentModal && equipmentModalType === 'edit'" :item="equipmentForm"
      @close="closeEquipmentModal" @submit="submitEquipment" />

    <EquipmentDeleteModal v-if="showEquipmentModal && equipmentModalType === 'delete'" :item="equipmentForm"
      @close="closeEquipmentModal" @confirm="handleDeleteEquipment" />

    <CategoryAddModal v-if="showCategoryModal && categoryModalType === 'add'" @close="closeCategoryModal"
      @submit="submitCategory" />

    <CategoryEditModal v-if="showCategoryModal && categoryModalType === 'edit'" :item="categoryForm"
      @close="closeCategoryModal" @submit="submitCategory" />

    <CategoryDeleteModal v-if="showCategoryModal && categoryModalType === 'delete'" :item="categoryForm"
      @close="closeCategoryModal" @confirm="handleDeleteCategory" />

    <AssignEquipmentModal v-if="showAssignModal" :item="assignItem" @close="showAssignModal = false"
      @confirm="confirmAssignEquipment" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import InventarioAddModal from '../components/InventarioAddModal.vue'
import InventarioEditModal from '../components/InventarioEditModal.vue'
import InventarioDeleteModal from '../components/InventarioDeleteModal.vue'
import {
  getConsumables,
  createConsumable,
  updateConsumable,
  deleteConsumable,
  getEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getStudentEquipmentsActive,
  finishStudentEquipment,
  assignStudentEquipment,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/services/api'

const { t } = useI18n()

/* ===== Variables ===== */
const inventario = ref([])
const search = ref('')
const currentPage = ref(1)
const perPage = 7

const showModal = ref(false)
const modalType = ref('') // add | edit | delete
const form = ref({})



/* ===== API ===== */

/* ===== Tabs ===== */
const activeTab = ref('material')

/* ===== Equipamientos ===== */
const equipments = ref([])
const equipmentSearch = ref('')

const equipmentForm = ref({})
const equipmentModalType = ref('')
const showEquipmentModal = ref(false)


const fetchEquipments = async () => {
  equipments.value = await getEquipments()
}

const filteredEquipments = computed(() =>
  equipments.value.filter(e =>
    (e.name ?? '').toLowerCase().includes(equipmentSearch.value.toLowerCase()) ||
    (e.brand ?? '').toLowerCase().includes(equipmentSearch.value.toLowerCase()) ||
    (e.label ?? '').toLowerCase().includes(equipmentSearch.value.toLowerCase()) ||
    (e.description ?? '').toLowerCase().includes(equipmentSearch.value.toLowerCase())
  )
)

const openEquipmentModal = (type, item = {}) => {
  equipmentModalType.value = type
  equipmentForm.value = { ...item }
  showEquipmentModal.value = true
}

const closeEquipmentModal = () => {
  showEquipmentModal.value = false
  equipmentModalType.value = ''
}


const submitEquipment = async (data) => {
  if (equipmentModalType.value === 'add') {
    await createEquipment(data)
  } else {
    await updateEquipment(data.id, data)
  }

  await fetchEquipments()
  closeEquipmentModal()
}

const equipmentCurrentPage = ref(1)
const equipmentPerPage = 7

const equipmentTotalPages = computed(() =>
  Math.ceil(filteredEquipments.value.length / equipmentPerPage)
)

const equipmentPaginatedData = computed(() => {
  const start = (equipmentCurrentPage.value - 1) * equipmentPerPage
  return filteredEquipments.value.slice(start, start + equipmentPerPage)
})

const equipmentNextPage = () => {
  if (equipmentCurrentPage.value < equipmentTotalPages.value)
    equipmentCurrentPage.value++
}

const equipmentPrevPage = () => {
  if (equipmentCurrentPage.value > 1)
    equipmentCurrentPage.value--
}

watch(equipmentSearch, () => {
  equipmentCurrentPage.value = 1
})


import EquipmentAddModal from '../components/EquipmentAddModal.vue'
import EquipmentEditModal from '../components/EquipmentEditModal.vue'
import EquipmentDeleteModal from '../components/EquipmentDeleteModal.vue'


const equipmentView = ref('lista') 

// Equipamientos disponibles
const availableEquipments = computed(() =>
  equipments.value.filter(e =>
    !studentEquipments.value.some(se => se.equipment_id === e.id)
  )
)

const occupiedEquipments = computed(() =>
  studentEquipments.value.map(se => ({
    student_equipment_id: se.id,
    equipment_id: se.equipment.id,
    name: se.equipment.name,
    brand: se.equipment.brand,
    label: se.equipment.label,
    responsible: `${se.student.name} ${se.student.surnames}`,
    start_datetime: se.start_datetime
  }))
)


const finishEquipmentUsage = async (occupiedItemId) => {
  console.log("Se finalizaaa" + occupiedItemId);
  await finishStudentEquipment(occupiedItemId)

  await fetchAllEquipments()
}
watch(activeTab, (tab) => {
  if (tab === 'equipamientos') {
    fetchAllEquipments()
  }
})

const studentEquipments = ref([])

const fetchStudentEquipmentsActive = async () => {
  studentEquipments.value = await getStudentEquipmentsActive()
}


const fetchAllEquipments = async () => {
  await Promise.all([
    fetchEquipments(),
    fetchStudentEquipmentsActive()
  ])
}



const assignEquipment = (item) => {
  openAssignModal(item)
}

const confirmAssignEquipment = async (payload) => {
  if (!payload.student_id) {
    // Finalizar uso
    await finishStudentEquipment(payload.id)
  } else {
    // Asignar equipamiento
    await assignStudentEquipment({
      student_id: payload.student_id,
      equipment_id: payload.id,
      start_datetime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    })
  }
  await fetchAllEquipments()
}


const handleDeleteEquipment = async () => {
  await deleteEquipment(equipmentForm.value.id)

  await fetchEquipments()
  closeEquipmentModal()
}

const fetchInventario = async () => {
  inventario.value = await getConsumables()
}

/* ===== Buscar ===== */
const filteredData = computed(() =>
  inventario.value.filter(item =>
    item.name.toLowerCase().includes(search.value.toLowerCase()) ||
    item.batch.toLowerCase().includes(search.value.toLowerCase()) ||
    item.brand.toLowerCase().includes(search.value.toLowerCase())
  )
)

/* ===== Paginación ===== */
const totalPages = computed(() => Math.ceil(filteredData.value.length / perPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredData.value.slice(start, start + perPage)
})
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

watch(search, () => currentPage.value = 1)
watch(activeTab, (tab) => {
  if (tab === 'equipamientos') {
    fetchEquipments()
  }
})

/* ===== Utils ===== */
const formatDate = (date) => date ? new Date(date).toLocaleDateString('es-ES') : '—'

/* ===== MODAL ===== */
const openModal = (type, item = {}) => {
  modalType.value = type
  form.value = { ...item } 
  showModal.value = true
}


const closeModal = () => {
  showModal.value = false
  modalType.value = ''   
}

/* ===== CRUD ===== */
const submitForm = async (data) => {
  form.value = data

  const method = modalType.value === 'add' ? 'POST' : 'PUT'
  const url = modalType.value === 'add'
    ? apiUrl
    : `${apiUrl}/${form.value.id}`

  if (modalType.value === 'add') {
    await createConsumable(form.value)
  } else {
    await updateConsumable(form.value.id, form.value)
  }

  await fetchInventario()
  closeModal()
}


const deleteItem = async () => {
  try {
    await deleteConsumable(form.value.id)
    await fetchInventario()
    closeModal()
  } catch (error) {
    alert(error.message)
  }
}

onMounted(fetchInventario)

import CategoryAddModal from '../components/CategoryAddModal.vue'
import CategoryEditModal from '../components/CategoryEditModal.vue'
import CategoryDeleteModal from '../components/CategoryDeleteModal.vue'


const materialView = ref('items')
// 'items' | 'categories'

const categories = ref([])
const categorySearch = ref('')
const showCategoryModal = ref(false)
const categoryModalType = ref('')
const categoryForm = ref({})


const fetchCategories = async () => {
  categories.value = await getCategories()
}

const filteredCategories = computed(() =>
  categories.value.filter(c =>
    c.name.toLowerCase().includes(categorySearch.value.toLowerCase())
  )
)

watch(materialView, v => {
  if (v === 'categories') fetchCategories()
})

const openCategoryModal = (type, item = {}) => {
  categoryModalType.value = type
  categoryForm.value = { ...item }
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  categoryModalType.value = ''
}
const submitCategory = async (data) => {
  if (categoryModalType.value === 'add') {
    await createCategory({ name: data.name })
  } else {
    await updateCategory(data.id, { name: data.name })
  }

  await fetchCategories()
  closeCategoryModal()
}

const handleDeleteCategory = async () => {
  await deleteCategory(categoryForm.value.id)

  await fetchCategories()
  closeCategoryModal()
}

import AssignEquipmentModal from '../components/AssignEquipmentModal.vue'

const showAssignModal = ref(false)
const assignItem = ref({})

const openAssignModal = (item) => {
  assignItem.value = { ...item }
  showAssignModal.value = true
}

</script>


<style scoped>
/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-add {
  background: #9CE0DB;
  color: black;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-add:hover {
  background: #82d8d8;
}

.btn-manage {
  background: #1d5a70;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-manage:hover {
  background: #164e63;
}

.btn-back {
  background: #3b9e89;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-back:hover {
  background: #2d7f6d;
}

/* Search */
.search-input {
  width: 100%;
  margin: 1rem 0;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* ===== Responsive ===== */

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-add,
  .btn-manage,
  .btn-back {
    width: 100%;
  }

  .inventario-table th,
  .inventario-table td {
    font-size: 0.8rem;
    padding: 0.5rem;
  }

  .search-input {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {

  .inventario-table th,
  .inventario-table td {
    font-size: 0.75rem;
    padding: 0.4rem;
  }

  .btn-add,
  .btn-manage,
  .btn-back {
    padding: 0.5rem;
  }
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tabs button {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #e0e0e0;
  font-weight: 600;
}

.tabs button.active {
  background: #164e63;
  color: white;
}

.equipment-subtabs {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.equipment-subtabs button {
  padding: 0.4rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #e0e0e0;
  font-weight: 600;
}

.equipment-subtabs button.active {
  background: #164e63;
  color: white;
}

.equipment-columns {
  display: flex;
  gap: 1rem;
}

.column {
  flex: 1;
  overflow-x: auto;
}

.column h2 {
  margin-bottom: 0.5rem;
}

.btn-assign {
  background: #f57c00;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
}
</style>
