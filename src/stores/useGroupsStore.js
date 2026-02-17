import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref([])           // lista de grupos reactiva
  const errores = ref(null)        // para guardar errores de API

  // ===== Traer todos los grupos desde la API =====
  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups')
      groups.value = res.data
    } catch (err) {
      console.error('Error al cargar grupos:', err)
      errores.value = err.response?.data || err.message
    }
  }

  // ===== Crear un grupo =====
  const addGroup = async (group) => {
    try {
      const res = await api.post('/groups', group)
      groups.value.push(res.data)
      return res.data
    } catch (err) {
      console.error('Error al crear grupo:', err)
      errores.value = err.response?.data || err.message
      throw err
    }
  }

  // ===== Actualizar un grupo =====
  const updateGroup = async (group) => {
  try {
    // Creamos el payload que la API espera
    const payload = {
      name: group.nombre || group.name, // asegúrate de usar el campo correcto
      // si estás actualizando usuarios, los enviamos como students
      students: group.usuarios?.map(id => ({ user_id: id })) || group.students || []
    }

    const res = await api.put(`/groups/${group.id}`, payload)

    // Reemplazamos el grupo en la lista reactiva con la respuesta de la API
    const index = groups.value.findIndex(g => g.id === group.id)
    if (index !== -1) groups.value[index] = res.data

    return res.data
  } catch (err) {
    console.error('Error al actualizar grupo:', err)
    errores.value = err.response?.data || err.message
    throw err
  }
}


  // ===== Eliminar un grupo =====
  const deleteGroup = async (id) => {
    try {
      await api.delete(`/groups/${id}`)
      groups.value = groups.value.filter(g => g.id !== id)
    } catch (err) {
      console.error('Error al eliminar grupo:', err)
      errores.value = err.response?.data || err.message
      throw err
    }
  }

  return {
    groups,
    errores,
    fetchGroups,
    addGroup,
    updateGroup,
    deleteGroup
  }
})
