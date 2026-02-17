import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useStudentsStore = defineStore('students', () => {
  const students = ref([])

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students') // tu endpoint
      students.value = res.data.data || []
    } catch (err) {
      console.error('Error cargando students:', err)
    }
  }

  const addStudent = async (payload) => {
    try {
      const res = await api.post('/students', payload)
      students.value.push(res.data)
      console.log("student añadido; ", res.data)
      return res.data
    } catch (err) {
      console.error('Error creando student:', err)
      throw err
    }
  }

  const updateStudent = async (student) => {
    try {
      const res = await api.put(`/students/${student.id}`, student)
      const index = students.value.findIndex(s => s.id === student.id)
      if (index !== -1) students.value[index] = res.data
      return res.data
    } catch (err) {
      console.error('Error actualizando student:', err)
      throw err
    }
  }

  const deleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`)
      students.value = students.value.filter(s => s.id !== id)
    } catch (err) {
      console.error('Error eliminando student:', err)
      throw err
    }
  }

  return { students, fetchStudents, addStudent, updateStudent, deleteStudent }
})
