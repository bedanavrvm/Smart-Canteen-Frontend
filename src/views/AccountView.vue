<template>
  <div class="page-container">
    <div class="orders-page">
      <h1 class="page-title">Account Details</h1>

      <!-- Profile Section -->
      <div class="profile-section">
        <div class="profile-header">
          <div class="user-avatar-large">
            {{ userInitials }}
          </div>
          <div class="profile-info">
            <h2 class="profile-name">{{ user?.name }}</h2>
            <p class="profile-role">{{ user?.role }}</p>
          </div>
        </div>

        <!-- User Information -->
        <div class="form-grid">
          <div>
            <label class="form-label">Registration Number</label>
            <input 
              v-model="form.reg_number" 
              type="text" 
              class="form-input" 
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label class="form-label">Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="form-input" 
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label class="form-label">Phone Number</label>
            <input 
              v-model="form.phone_number" 
              type="text" 
              class="form-input" 
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label class="form-label">Gender</label>
            <select 
              v-model="form.gender" 
              class="form-input" 
              :disabled="!isEditing"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="form-label">Role</label>
            <input 
              v-model="form.role" 
              type="text" 
              class="form-input" 
              disabled
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
          <button 
            v-if="!isEditing" 
            @click="startEditing" 
            class="primary-button"
          >
            Edit Profile
          </button>
          <template v-else>
            <button 
              @click="saveChanges" 
              class="primary-button"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
            <button 
              @click="cancelEditing" 
              class="secondary-button"
            >
              Cancel
            </button>
          </template>
        </div>
      </div>

      <!-- Change Password Section -->
      <div class="password-section">
        <h2 class="section-title">Change Password</h2>
        
        <div class="max-w-md">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <input 
              v-model="passwordForm.current" 
              type="password" 
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">New Password</label>
            <input 
              v-model="passwordForm.new" 
              type="password" 
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <input 
              v-model="passwordForm.confirm" 
              type="password" 
              class="form-input"
            />
          </div>

          <button 
            @click="changePassword" 
            class="primary-button"
            :disabled="changingPassword"
          >
            {{ changingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { updateSpecificUser } from '@/api/user'

const toast = useToast()

const authStore = useAuthStore()
const { user, userInitials } = storeToRefs(authStore)

const isEditing = ref(false)
const saving = ref(false)
const changingPassword = ref(false)

const form = ref({
  reg_number: '',
  email: '',
  phone_number: '',
  gender: '',
  role: '',
  name: ''
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

// Initialize form with user data
onMounted(() => {
  if (user.value) {
    form.value = {
      reg_number: user.value.reg_number || '',
      email: user.value.email || '',
      phone_number: user.value.phone_number || '',
      gender: user.value.gender || '',
      role: user.value.role || '',
      name: user.value.name || ''
    }
  }
})

function startEditing() {
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
  // Reset form to original user data
  if (user.value) {
    form.value = {
      reg_number: user.value.reg_number || '',
      email: user.value.email || '',
      phone_number: user.value.phone_number || '',
      gender: user.value.gender || '',
      role: user.value.role || '',
      name: user.value.name || ''
    }
  }
}

async function saveChanges() {
  if (!user.value) return
  
  saving.value = true
  try {
    const updatedUser = await updateSpecificUser(user.value.id, form.value)
    authStore.login(updatedUser) // Update store with new data
    isEditing.value = false
    toast.success('Profile updated successfully!')
  } catch (error) {
    console.error('Error updating profile:', error)
    toast.error('Failed to update profile. Please try again.')
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    toast.error('New passwords do not match!')
    return
  }

  if (passwordForm.value.new.length < 8) {
    toast.error('Password must be at least 8 characters long')
    return
  }

  changingPassword.value = true
  try {
    await updateSpecificUser(user.value.id, {
      password: passwordForm.value.new
    })
    
    // Clear password fields
    passwordForm.value = {
      current: '',
      new: '',
      confirm: ''
    }
    
    toast.success('Password updated successfully!')
  } catch (error) {
    console.error('Error changing password:', error)
    toast.error('Failed to update password. Please try again.')
  } finally {
    changingPassword.value = false
  }
}
</script>

<style scoped>
.user-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.secondary-button {
  padding: 0.75rem 1.5rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background: #d1d5db;
}
</style>
