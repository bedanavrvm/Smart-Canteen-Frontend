<template>
  <div class="page-container">
    <div class="staff-menu-management">
      <div class="header-section">
        <h1 class="page-title">Menu Management</h1>
        <button @click="openAddModal" class="cta-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Item
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state-container">
        <p class="loading-state-text">Loading menu items...</p>
      </div>

      <!-- Menu Items Table -->
      <div v-else class="menu-table-container">
        <table class="menu-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Tags</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in menuItems" :key="item.id">
              <td>
                <img 
                  :src="item.image_url || '/placeholder-food.jpg'" 
                  :alt="item.name" 
                  class="menu-item-image"
                />
              </td>
              <td>
                <div class="item-name">{{ item.name }}</div>
                <div class="item-description">{{ truncateText(item.description, 50) }}</div>
              </td>
              <td>
                <div class="tags-display">
                  <span 
                    v-for="tag in item.tags" 
                    :key="tag.id" 
                    class="tag-badge"
                    :class="`tag-${tag.tag_type}`"
                  >
                    {{ tag.name }}
                  </span>
                  <span v-if="!item.tags || item.tags.length === 0" class="no-tags">No tags</span>
                </div>
              </td>
              <td class="price-cell">Ksh {{ item.price }}</td>
              <td>
                <span 
                  class="availability-badge" 
                  :class="item.availability ? 'available' : 'unavailable'"
                >
                  {{ item.availability ? 'Available' : 'Unavailable' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openEditModal(item)" class="btn-edit" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button @click="confirmDelete(item)" class="btn-delete" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="menuItems.length === 0" class="empty-state">
          <p>No menu items found. Add your first item!</p>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Edit Menu Item' : 'Add New Menu Item' }}</h2>
            <button @click="closeModal" class="modal-close">&times;</button>
          </div>

          <form @submit.prevent="saveMenuItem" class="modal-form">
            <div class="form-group">
              <label class="form-label">Name *</label>
              <input 
                v-model="formData.name" 
                type="text" 
                class="form-input" 
                required
                placeholder="e.g., Chicken Burger"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Description *</label>
              <textarea 
                v-model="formData.description" 
                class="form-input" 
                rows="3"
                required
                placeholder="Describe the menu item..."
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Price (Ksh) *</label>
                <input 
                  v-model.number="formData.price" 
                  type="number" 
                  step="0.01"
                  min="0"
                  class="form-input" 
                  required
                  placeholder="0.00"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Image</label>
              
              <!-- Image Preview -->
              <div v-if="imagePreview" class="image-preview-container">
                <img :src="imagePreview" alt="Preview" class="image-preview" />
                <button type="button" @click="removeImage" class="remove-image-btn">
                  &times;
                </button>
              </div>
              
              <!-- File Upload Button -->
              <div class="file-upload-wrapper">
                <input 
                  ref="fileInput"
                  type="file" 
                  accept="image/*"
                  @change="handleImageSelect"
                  class="file-input-hidden"
                  id="imageUpload"
                />
                <label for="imageUpload" class="file-upload-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Choose Image File
                </label>
              </div>
              
              <p class="form-helper-text">Select an image file to upload</p>
            </div>

            <!-- Tags Section -->
            <div class="form-group">
              <label class="form-label">Tags</label>
              
              <!-- Meal Type Tags -->
              <div class="tag-group">
                <h4 class="tag-group-title">Meal Type</h4>
                <div class="tag-checkboxes">
                  <label 
                    v-for="tag in mealTypeTags" 
                    :key="tag.id" 
                    class="tag-checkbox-label"
                  >
                    <input 
                      type="checkbox" 
                      :value="tag.id"
                      v-model="selectedTags"
                      class="tag-checkbox"
                    />
                    <span>{{ tag.name }}</span>
                  </label>
                </div>
              </div>
              
              <!-- Time of Day Tags -->
              <div class="tag-group">
                <h4 class="tag-group-title">Time of Day</h4>
                <div class="tag-checkboxes">
                  <label 
                    v-for="tag in timeOfDayTags" 
                    :key="tag.id" 
                    class="tag-checkbox-label"
                  >
                    <input 
                      type="checkbox" 
                      :value="tag.id"
                      v-model="selectedTags"
                      class="tag-checkbox"
                    />
                    <span>{{ tag.name }}</span>
                  </label>
                </div>
              </div>
              
              <!-- Temperature Tags -->
              <div class="tag-group">
                <h4 class="tag-group-title">Temperature</h4>
                <div class="tag-checkboxes">
                  <label 
                    v-for="tag in temperatureTags" 
                    :key="tag.id" 
                    class="tag-checkbox-label"
                  >
                    <input 
                      type="checkbox" 
                      :value="tag.id"
                      v-model="selectedTags"
                      class="tag-checkbox"
                    />
                    <span>{{ tag.name }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  v-model="formData.availability" 
                  type="checkbox"
                  class="form-checkbox"
                />
                <span>Available for order</span>
              </label>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-content modal-small">
          <div class="modal-header">
            <h2>Confirm Delete</h2>
            <button @click="closeDeleteModal" class="modal-close">&times;</button>
          </div>

          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ itemToDelete?.name }}</strong>?</p>
            <p class="modal-warning-text">This action cannot be undone.</p>
          </div>

          <div class="modal-actions">
            <button @click="closeDeleteModal" class="btn-secondary">
              Cancel
            </button>
            <button @click="deleteMenuItem" class="btn-danger" :disabled="deleting">
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { 
  getAllMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem as deleteMenuItemAPI 
} from '@/api/menu'
import { getAllTags } from '@/api/tag'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Check if user is staff
if (authStore.user?.role !== 'staff' && authStore.user?.role !== 'admin') {
  toast.error('Access denied. Only staff members can access this page.')
  router.push('/dashboard')
}

const menuItems = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const itemToDelete = ref(null)

const formData = ref({
  name: '',
  description: '',
  price: 0,
  availability: true
})

const selectedImageFile = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

const allTags = ref([])
const selectedTags = ref([])

// Computed properties to filter tags by type
const mealTypeTags = computed(() => 
  allTags.value.filter(tag => tag.tag_type === 'meal_type')
)

const timeOfDayTags = computed(() => 
  allTags.value.filter(tag => tag.tag_type === 'time_of_day')
)

const temperatureTags = computed(() => 
  allTags.value.filter(tag => tag.tag_type === 'temperature')
)

// Load tags
async function loadTags() {
  try {
    allTags.value = await getAllTags()
  } catch (error) {
    console.error('Error loading tags:', error)
  }
}

// Load menu items
async function loadMenuItems() {
  try {
    loading.value = true
    menuItems.value = await getAllMenuItems()
  } catch (error) {
    console.error('Error loading menu items:', error)
    toast.error('Failed to load menu items')
  } finally {
    loading.value = false
  }
}

// Handle image file selection
function handleImageSelect(event) {
  const file = event.target.files[0]
  if (file) {
    selectedImageFile.value = file
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    
    // Clear URL input when file is selected
    formData.value.image_url = ''
  }
}

// Remove selected image
function removeImage() {
  selectedImageFile.value = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Open modal for adding
function openAddModal() {
  isEditing.value = false
  formData.value = {
    name: '',
    description: '',
    price: 0,
    availability: true
  }
  selectedImageFile.value = null
  imagePreview.value = null
  selectedTags.value = []
  showModal.value = true
}

// Open modal for editing
function openEditModal(item) {
  isEditing.value = true
  formData.value = { ...item }
  selectedImageFile.value = null
  // Show existing image as preview if available
  imagePreview.value = item.image_url || null
  // Load existing tags
  selectedTags.value = item.tags ? item.tags.map(tag => tag.id) : []
  showModal.value = true
}

// Close modal
function closeModal() {
  showModal.value = false
  formData.value = {
    name: '',
    description: '',
    price: 0,
    availability: true
  }
  selectedImageFile.value = null
  imagePreview.value = null
  selectedTags.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Save menu item (create or update)
async function saveMenuItem() {
  try {
    saving.value = true
    
    // Prepare payload with image file and tags
    const payload = { ...formData.value }
    
    // Remove read-only fields that shouldn't be sent to API
    delete payload.tags  // tags is read-only, use tag_ids instead
    delete payload.created_at
    delete payload.updated_at
    delete payload.id  // Don't send id in payload for updates
    delete payload.image_url  // We only use file uploads now
    
    // Add image file if selected
    if (selectedImageFile.value) {
      payload.image_file = selectedImageFile.value
    }
    
    // Add tag IDs to payload
    payload.tag_ids = selectedTags.value
    
    if (isEditing.value) {
      await updateMenuItem(formData.value.id, payload)
      toast.success('Menu item updated successfully!')
    } else {
      await createMenuItem(payload)
      toast.success('Menu item created successfully!')
    }
    
    closeModal()
    await loadMenuItems()
  } catch (error) {
    console.error('Error saving menu item:', error)
    toast.error('Failed to save menu item. Make sure you have the required permissions.')
  } finally {
    saving.value = false
  }
}

// Confirm delete
function confirmDelete(item) {
  itemToDelete.value = item
  showDeleteModal.value = true
}

// Close delete modal
function closeDeleteModal() {
  showDeleteModal.value = false
  itemToDelete.value = null
}

// Delete menu item
async function deleteMenuItem() {
  try {
    deleting.value = true
    await deleteMenuItemAPI(itemToDelete.value.id)
    toast.success('Menu item deleted successfully!')
    closeDeleteModal()
    await loadMenuItems()
  } catch (error) {
    console.error('Error deleting menu item:', error)
    toast.error('Failed to delete menu item')
  } finally {
    deleting.value = false
  }
}

// Utility function to truncate text
function truncateText(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

onMounted(() => {
  loadTags()
  loadMenuItems()
})
</script>

<style scoped>
.staff-menu-management {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.cta-button:hover {
  background: #059669;
}

.menu-table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.menu-table {
  width: 100%;
  border-collapse: collapse;
}

.menu-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.menu-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.menu-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.menu-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.item-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.item-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  max-width: 200px;
}

.tag-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.tag-meal_type {
  background: #fef3c7;
  color: #92400e;
}

.tag-time_of_day {
  background: #dbeafe;
  color: #1e40af;
}

.tag-temperature {
  background: #e0e7ff;
  color: #3730a3;
}

.no-tags {
  color: #9ca3af;
  font-size: 0.75rem;
  font-style: italic;
}

.price-cell {
  font-weight: 600;
  color: #059669;
}

.availability-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.availability-badge.available {
  background: #d1fae5;
  color: #065f46;
}

.availability-badge.unavailable {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #bfdbfe;
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #fecaca;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
}

.modal-close:hover {
  color: #1f2937;
}

.modal-form {
  padding: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #374151;
}

.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

/* Image Upload Styles */
.image-preview-container {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin-bottom: 1rem;
}

.image-preview {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-image-btn:hover {
  background: rgba(220, 38, 38, 1);
}

.file-upload-wrapper {
  margin-bottom: 1rem;
}

.file-input-hidden {
  display: none;
}

.file-upload-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.file-upload-label:hover {
  background: #e5e7eb;
  border-color: #10b981;
  color: #10b981;
}

.divider-container {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}

.divider-container::before,
.divider-container::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #d1d5db;
}

.divider-text {
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Tag Selection Styles */
.tag-group {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.tag-group-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tag-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.tag-checkbox-label:hover {
  border-color: #10b981;
  background: #f0fdf4;
}

.tag-checkbox {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.tag-checkbox:checked + span {
  color: #10b981;
}

.tag-checkbox-label:has(.tag-checkbox:checked) {
  border-color: #10b981;
  background: #d1fae5;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #059669;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .staff-menu-management {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .menu-table-container {
    overflow-x: auto;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
