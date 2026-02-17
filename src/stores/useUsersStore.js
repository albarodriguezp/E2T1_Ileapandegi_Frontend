import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useUsersStore = defineStore('users', () => {
  const usuarios = ref([])

  // Traer usuarios desde API
  const fetchUsuarios = async () => {
    const res = await api.get('/users')
    usuarios.value = res.data
  }

  // Crear usuario en API y store
  const addUsuario = async (payload) => {
    try {
      const res = await api.post('/users', payload)
      console.log('Respuesta de la API:', res.data)
      // Retorna el usuario completo, incluyendo el ID
      return res.data
    } catch (err) {
      console.error('Error creando usuario:', err)
      throw err
    }
  }

  // Actualizar usuario en API y store
  const updateUsuario = async (user) => {
    await api.put(`/users/${user.id}`, user)
    const index = usuarios.value.findIndex(u => u.id === user.id)
    if (index !== -1) usuarios.value[index] = user
  }

  // Eliminar usuario en API y store
  const deleteUsuario = async (id) => {
    await api.delete(`/users/${id}`)
    usuarios.value = usuarios.value.filter(u => u.id !== id)
  }

  return { usuarios, addUsuario, fetchUsuarios, updateUsuario, deleteUsuario } // Asegúrate de incluir esta función en el return

})
