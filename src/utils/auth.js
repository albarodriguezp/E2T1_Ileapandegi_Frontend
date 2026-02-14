import { apiRequest, getToken } from '@/services/api'

export const checkAuth = async () => {
  const token = getToken()
  if (!token) return false

  try {
    const res = await apiRequest('/user')

    return res.ok
  } catch (error) {
    console.error('checkAuth error:', error)
    return false
  }
}

export const logout = async () => {
  const token = getToken()

  if (token) {
    await apiRequest('/logout', { method: 'POST' })
  }

  localStorage.removeItem('token')
}
