
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Define the shape of your user object
interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'admin';
  reg_number?: string;
  phone_number?: string;
  profile_picture?: string;
  gender?: string;
  // Add any other user properties here
}

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  // The user state can be null or a User object
  const user = ref<User | null>(null)

  // --- Getters ---
  const isAuthenticated = computed(() => !!user.value)
  const userInitials = computed(() => {
    // TypeScript ensures 'user.value' is checked and 'user.value.name' is a string
    if (user.value?.name) {
      return user.value.name.charAt(0).toUpperCase()
    }
    return ''
  })

  // --- Actions ---
  function login(userData: User) { // Use the defined User type
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
    // Note: 'access' and 'refresh' tokens should ideally be set here too
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
  }

  // NOTE: Keep initializeAuth() synchronous and running at the end of the store definition
  // to ensure state is loaded immediately upon store creation.
  function initializeAuth() {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        // Cast the parsed JSON to the User type
        user.value = JSON.parse(storedUser) as User
      } catch (e) {
        console.error("Error parsing stored user data:", e)
        // Clear all auth data if user data is corrupted
        localStorage.removeItem('user')
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        user.value = null
      }
    }
  }

  // Initialize on store creation
  initializeAuth()

  return { user, isAuthenticated, userInitials, login, logout }
})