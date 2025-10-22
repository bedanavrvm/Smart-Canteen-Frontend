import axios from "axios";
import { refreshToken } from "./auth";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});


// Attach token before every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Automatically refresh access token on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If token expired and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem('refresh')
        if (!refresh) throw new Error('No refresh token')

        //  Use your helper here
        const res = await refreshToken(refresh)
        const newAccess = res.access

        //  Save the new access token
        localStorage.setItem('access', newAccess)
        // Update headers so next requests use it
        apiClient.defaults.headers.Authorization = `Bearer ${newAccess}`
        // Retry the failed request with the new token
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed → tokens are invalid → log out
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)


export default apiClient;
