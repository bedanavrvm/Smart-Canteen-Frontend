import apiClient from './axios'

// 🔹 Login: exchange credentials for JWT tokens
export async function login(username, password) {
  const response = await apiClient.post('/token/', { username, password })
  return response.data  // Return only the data payload
}

// 🔹 Refresh token: get a new access token
export async function refreshToken(refresh) {
  const response = await apiClient.post('/token/refresh/', { refresh })
  return response.data
}

// 🔹 Verify token: check if still valid
export async function verifyToken(token) {
  const response = await apiClient.post('/token/verify/', { token })
  return response.data
}
