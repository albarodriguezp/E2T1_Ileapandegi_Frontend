const API_URL = 'http://localhost:8000/api'

export const getToken = () => localStorage.getItem('token')

const safeJson = async (res) => {
  try {
    return await res.json()
  } catch {
    return null
  }
}

const buildHeaders = ({ auth = true, headers = {}, hasBody = false } = {}) => {
  const finalHeaders = {
    Accept: 'application/json',
    ...headers
  }

  if (hasBody && !('Content-Type' in finalHeaders)) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`
    }
  }

  return finalHeaders
}

export const apiRequest = async (path, { method = 'GET', body, auth = true, headers } = {}) => {
  const hasBody = body !== undefined
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: buildHeaders({ auth, headers, hasBody }),
    body: hasBody ? JSON.stringify(body) : undefined
  })

  return res
}

export const apiJson = async (path, options = {}, errorMessage = 'Error en la solicitud') => {
  const res = await apiRequest(path, options)
  if (!res.ok) {
    const error = new Error(errorMessage)
    error.status = res.status
    error.data = await safeJson(res)
    throw error
  }

  return res.json()
}

export const login = async (email, password) => {
  const res = await apiRequest('/login', {
    method: 'POST',
    auth: false,
    body: { email, password }
  })

  const data = await safeJson(res)
  return { ok: res.ok, status: res.status, data }
}

export const getProfile = async () => apiJson('/profile', {}, 'Error al obtener perfil')

export const getProfileProgress = async () => apiJson('/profile/progress', {}, 'Error al obtener progreso')

export const getAppointmentsByUser = async (userId) => {
  return apiJson(`/appointments?user_id=${userId}`, {}, 'Error al obtener citas')
}

export const getAppointments = async () => apiJson('/appointments', {}, 'Error al obtener citas')

export const getAppointmentsByDate = async (date) => {
  return apiJson(`/appointments/by-date?date=${date}`, {}, 'Error al obtener citas')
}

export const getAppointment = async (id) => apiJson(`/appointments/${id}`, {}, 'Error al obtener cita')

export const createAppointment = async (payload) => {
  return apiJson('/appointments', { method: 'POST', body: payload }, 'Error al guardar cita')
}

export const updateAppointment = async (id, payload) => {
  return apiJson(`/appointments/${id}`, { method: 'PUT', body: payload }, 'Error al guardar cita')
}

export const deleteAppointment = async (id) => {
  const res = await apiRequest(`/appointments/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar la cita')
}

export const getClients = async () => apiJson('/clients', {}, 'Error al obtener clientes')

export const createClient = async (payload) => {
  return apiJson('/clients', { method: 'POST', body: payload }, 'Error al guardar cliente')
}

export const updateClient = async (id, payload) => {
  return apiJson(`/clients/${id}`, { method: 'PUT', body: payload }, 'Error al actualizar cliente')
}

export const deleteClient = async (id) => {
  const res = await apiRequest(`/clients/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar cliente')
}

export const getStudents = async () => apiJson('/students', {}, 'Error al obtener estudiantes')

export const getServices = async () => apiJson('/services', {}, 'Error al obtener servicios')

export const getConsumables = async () => apiJson('/consumables', {}, 'Error al obtener inventario')

export const createConsumable = async (payload) => {
  return apiJson('/consumables', { method: 'POST', body: payload }, 'Error al guardar inventario')
}

export const updateConsumable = async (id, payload) => {
  return apiJson(`/consumables/${id}`, { method: 'PUT', body: payload }, 'Error al actualizar inventario')
}

export const deleteConsumable = async (id) => {
  const res = await apiRequest(`/consumables/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar')
}

export const getEquipments = async () => apiJson('/equipments', {}, 'Error al obtener equipamientos')

export const createEquipment = async (payload) => {
  return apiJson('/equipments', { method: 'POST', body: payload }, 'Error al guardar equipamiento')
}

export const updateEquipment = async (id, payload) => {
  return apiJson(`/equipments/${id}`, { method: 'PUT', body: payload }, 'Error al actualizar equipamiento')
}

export const deleteEquipment = async (id) => {
  const res = await apiRequest(`/equipments/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar equipamiento')
}

export const getCategories = async () => apiJson('/categorys', {}, 'Error al obtener categorias')

export const createCategory = async (payload) => {
  return apiJson('/categorys', { method: 'POST', body: payload }, 'Error al guardar categoria')
}

export const updateCategory = async (id, payload) => {
  return apiJson(`/categorys/${id}`, { method: 'PUT', body: payload }, 'Error al actualizar categoria')
}

export const deleteCategory = async (id) => {
  const res = await apiRequest(`/categorys/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar categoria')
}

export const getStudentEquipmentsActive = async () => {
  return apiJson('/student_equipments-active', {}, 'Error al obtener equipamientos activos')
}

export const assignStudentEquipment = async (payload) => {
  return apiJson('/student_equipments', { method: 'POST', body: payload }, 'Error al asignar equipamiento')
}

export const finishStudentEquipment = async (id) => {
  const res = await apiRequest(`/student_equipments/${id}/finish`, { method: 'PUT' })
  if (!res.ok) throw new Error('Error al finalizar uso')
}
