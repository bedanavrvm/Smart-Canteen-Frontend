<template>
  <div class="auth-page">
    <div class="register-card">
      <h1>Register</h1>

      <form @submit.prevent="registerUser">
        <label>Full Name</label>
        <input v-model="form.name" type="text" class="form-input" />

        <label>Registration Number</label>
        <input v-model="form.reg_number" type="text" class="form-input" />

        <label>Email</label>
        <input v-model="form.email" type="email" class="form-input" />

        <label>Phone Number</label>
        <input v-model="form.phone_number" type="text" class="form-input" />

        <label>Gender</label>
        <select v-model="form.gender" class="form-input">
          <option disabled value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label>Role</label>
        <select v-model="form.role" class="form-input">
          <option disabled value="">Select Role</option>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <label>Password</label>
        <input v-model="form.password" type="password" class="form-input" />

        <button type="submit" class="primary-button">Register</button>

        <p>
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { createUser, getCurrentUser } from '@/api/user'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const toast = useToast()
const loading = ref(false)
const form = ref({
  name: '',
  reg_number: '',
  email: '',
  phone_number: '',
  gender: '',
  role:'',
  password: '',
})

const authStore = useAuthStore()

async function registerUser() {
  loading.value = true
  try {
    const response = await createUser(form.value)
    console.log('Registration response:', response)
    
    // Auto-login if the backend returns tokens
    if (response.access && response.refresh) {
      // Store tokens
      localStorage.setItem('access', response.access)
      localStorage.setItem('refresh', response.refresh)
      
      // Fetch user data using the authenticated endpoint
      const userData = await getCurrentUser()
      
      // Perform a full login to update the state
      authStore.login(userData)
      
      router.push('/dashboard')
      
    } else {
      // Manual Login - registration successful but no auto-login
      toast.success('Registration successful! Please login.')
      router.push('/login')
    }
  } catch (error) {
    console.error('Registration error:', error)
    toast.error('Registration failed. Check your details.')
  } finally {
    loading.value = false
  }
}
</script>
