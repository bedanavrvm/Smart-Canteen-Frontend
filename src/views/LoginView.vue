<template>
  <div class="auth-page">
    <div class="login-card">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      <form @submit.prevent="loginUser">  <!--This fuction only runs once the user submits the form-->
        <label>Registration Number</label>
        <input v-model="form.reg_number" type="text" class="form-input" />

        <label>Password</label>
        <input v-model="form.password" type="password" class="form-input" />

        <button type="submit" class="primary-button" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>

        <p>
          Don’t have an account?
          <router-link to="/register">Register here</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import { login as apiLogin } from '@/api/auth'
import { getCurrentUser } from '@/api/user'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const toast = useToast()
const form = ref({ reg_number: '', password: '' })
const loading = ref(false)

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

//login handler
async function loginUser() {
  loading.value = true
  try {
    // Step 1: Get tokens from login endpoint
    const response = await apiLogin(form.value.reg_number, form.value.password)
    
    // Step 2: Store tokens for authenticated requests
    localStorage.setItem('access', response.access)
    localStorage.setItem('refresh', response.refresh)

    // Step 3: Fetch user data using the authenticated endpoint
    const userData = await getCurrentUser()
    
    // Step 4: Use the Pinia store action to update the global user state
    authStore.login(userData)

    // Wait for Vue to process the state update before navigating.
    // This ensures the Navbar has the latest auth state.
    await nextTick()
    
    // Step 5: Redirect to the main dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
    toast.error('Login failed. Please check your credentials.')
  } finally {
    loading.value = false
  }
}

</script>
