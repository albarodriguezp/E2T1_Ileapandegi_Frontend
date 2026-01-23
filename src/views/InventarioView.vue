<template>
  <div class="content">
    <div class="content2">

      <!-- Header -->
      <div class="header">
        <h1>Inventario</h1>
        <button class="btn-add" @click="openModal('add')">+ Agregar inventario</button>
      </div>

      <!-- Buscador -->
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por nombre, lote o marca..."
        class="search-input"
      />

      <!-- Tabla -->
      <table class="inventario-table">
        <thead>
          <tr>
            <th>Lote</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Fecha cad</th>
            <th>Descripción</th>
            <th>Acciones</th>
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
              <button class="btn-edit" @click="openModal('edit', item)">✏️</button>
              <button class="btn-delete" @click="openModal('delete', item)">🗑️</button>
            </td>
          </tr>

          <tr v-if="paginatedData.length === 0">
            <td colspan="8" class="empty">No hay resultados</td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">«</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
      </div>

    </div>

    <!-- ===== MODAL ===== -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ modalTitle }}</h2>

        <form v-if="modalType === 'add' || modalType === 'edit'" @submit.prevent="submitForm">
          <label>Nombre</label>
          <input v-model="form.name" required />

          <label>Lote</label>
          <input v-model="form.batch" />

          <label>Marca</label>
          <input v-model="form.brand" />

          <label>Stock</label>
          <input type="number" v-model.number="form.stock" required />

          <label>Stock mínimo</label>
          <input type="number" v-model.number="form.min_stock" required />

          <label>Categoría (ID)</label>
          <input type="number" v-model.number="form.category_id" required />

          <label>Fecha caducidad</label>
          <input type="date" v-model="form.expiration_date" />

          <label>Descripción</label>
          <textarea v-model="form.description"></textarea>

          <button type="submit">{{ modalType === 'add' ? 'Agregar' : 'Guardar' }}</button>
          <button type="button" @click="closeModal">Cancelar</button>
        </form>

        <div v-if="modalType === 'delete'">
          <p>¿Seguro que quieres eliminar <strong>{{ form.name }}</strong>?</p>
          <button @click="deleteItem">Eliminar</button>
          <button @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

/* ===== Variables ===== */
const inventario = ref([])
const search = ref('')
const currentPage = ref(1)
const perPage = 5

const showModal = ref(false)
const modalType = ref('') // add | edit | delete
const modalTitle = ref('')
const form = ref({})

/* ===== API ===== */
const token = localStorage.getItem('token')
const apiUrl = 'http://localhost:8000/api/consumables'

const fetchInventario = async () => {
  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  inventario.value = await res.json()
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

/* ===== Utils ===== */
const formatDate = (date) => date ? new Date(date).toLocaleDateString('es-ES') : '—'

/* ===== MODAL ===== */
const openModal = (type, item = {}) => {
  modalType.value = type
  showModal.value = true

  if (type === 'add') {
    modalTitle.value = 'Agregar Inventario'
    form.value = { name:'', batch:'', brand:'', stock:0, min_stock:0, category_id:1, expiration_date:'', description:'' }
  }
  if (type === 'edit') {
    modalTitle.value = 'Editar Inventario'
    form.value = { ...item }
  }
  if (type === 'delete') {
    modalTitle.value = 'Eliminar Inventario'
    form.value = { ...item }
  }
}

const closeModal = () => { showModal.value = false }

/* ===== CRUD ===== */
const submitForm = async () => {
  try {
    const method = modalType.value === 'add' ? 'POST' : 'PUT'
    const url = modalType.value === 'add' ? apiUrl : `${apiUrl}/${form.value.id}`

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form.value)
    })

    if (!res.ok) throw new Error('Error en el backend')
    await fetchInventario()
    closeModal()

  } catch (error) {
    alert('Error al guardar: ' + error.message)
  }
}

const deleteItem = async () => {
  try {
    const res = await fetch(`${apiUrl}/${form.value.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!res.ok) throw new Error('Error al eliminar')
    await fetchInventario()
    closeModal()
  } catch (error) {
    alert(error.message)
  }
}

onMounted(fetchInventario)
</script>

<style scoped>
/* ===== Contenido ===== */
.content { background: #222; padding: 2rem; min-height: 100vh; width: 100%; }
.content2 { background: white; border-radius: 20px; padding: 2rem; color: black; height: 90vh; }

/* Header */
.header { display:flex; justify-content:space-between; align-items:center; }
.btn-add { background:#2e7d32; color:white; border:none; padding:0.6rem 1.2rem; border-radius:8px; font-weight:600; cursor:pointer; }
.btn-add:hover { background:#1b5e20; }

/* Search */
.search-input { width:100%; margin:1rem 0; padding:0.6rem 1rem; border-radius:8px; border:1px solid #ccc; }

/* Table */
.inventario-table { width:100%; border-collapse:collapse; }
.inventario-table thead { background:#164e63; color:white; }
.inventario-table th, .inventario-table td { padding:0.8rem; font-size:0.9rem; }
.inventario-table tbody tr:nth-child(odd) { background:#c7dadd; }
.lowStock { color:#c62828; font-weight:700; }
.actions { display:flex; gap:0.5rem; }
.btn-edit { background:#1976d2; color:white; border:none; border-radius:6px; padding:0.3rem 0.6rem; }
.btn-delete { background:#d32f2f; color:white; border:none; border-radius:6px; padding:0.3rem 0.6rem; }

/* Pagination */
.pagination { margin-top:1rem; display:flex; justify-content:center; align-items:center; gap:1rem; }
.pagination button { padding:0.4rem 0.8rem; border-radius:6px; border:none; background:#164e63; color:white; cursor:pointer; }
.pagination button:disabled { background:#aaa; cursor:not-allowed; }
.empty { text-align:center; padding:1rem; font-style:italic; }

/* ===== MODAL ===== */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:10; }
.modal { background:white; padding:2rem; border-radius:12px; width:400px; max-width:95%; }
.modal h2 { margin-bottom:1rem; }
.modal input, .modal textarea { width:100%; margin-bottom:0.8rem; padding:0.5rem; border-radius:6px; border:1px solid #ccc; }
.modal button { padding:0.6rem 1rem; margin-right:0.5rem; border:none; border-radius:6px; cursor:pointer; }
.modal button[type="submit"] { background:#2e7d32; color:white; }
.modal button[type="button"] { background:#aaa; color:white; }
</style>
