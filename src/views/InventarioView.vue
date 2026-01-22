<template>
  <div class="content">
    <div class="content2">
      <h1>Inventario</h1>

      <table class="inventario-table">
        <thead>
          <tr>
            <th>Lote</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Categoria</th>
            <th>Marca</th>
            <th>Fecha cad</th>
            <th>Descripcion</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in inventario" :key="item.id">
            <td>{{ item.batch }}</td>
            <td>{{ item.name }}</td>
            <td :class="{ lowStock: item.stock <= item.min_stock }">
              {{ item.stock }}
            </td>
            <td>{{ item.category.name }}</td>
            <td>{{ item.brand }}</td>
            <td>{{ formatDate(item.expiration_date) }}</td>
            <td>{{ item.description }}</td>
          </tr>

          <tr v-if="inventario.length === 0">
            <td colspan="4" class="empty">No hay datos</td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const inventario = ref([])

const fetchInventario = async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:8000/api/consumables', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.status === 401) {
      console.error('No autorizado')
      return
    }

    const data = await res.json()
    inventario.value = data

  } catch (error) {
    console.error('Error cargando inventario:', error)
  }
}


const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-ES')
}

onMounted(() => {
  fetchInventario()
})
</script>

<style scoped>
.content {
  background: #222;
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
}

.content2 {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  color: black;
  height: 90vh;
}
/* ===== Tabla ===== */

h1 {
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.inventario-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
}

.inventario-table thead {
  background: #164e63;
  color: white;
}

.inventario-table th {
  padding: 0.8rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
}

.inventario-table td {
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  color: #222;
}

.inventario-table tbody tr:nth-child(odd) {
  background: #c7dadd;
}

.inventario-table tbody tr:nth-child(even) {
  background: #ffffff;
}

/* Stock bajo */
.lowStock {
  color: #c62828;
  font-weight: 700;
}

/* Sin datos */
.empty {
  text-align: center;
  padding: 1rem;
  font-style: italic;
}
</style>
