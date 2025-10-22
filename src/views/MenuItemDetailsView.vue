<template>
  <div class="page-container">
    <Navbar />

    <!-- Main content section -->
    <section class="feature-section">
      <h2>Menu Item Details</h2>

      <!-- Loading -->
      <div v-if="loading" class="loading-text">Loading...</div>

      <!-- Menu details card -->
      <div v-else-if="menuItem" class="menu-details-card" :class="{ 'unavailable-item': !menuItem.availability }">
        <div class="image-wrapper">
          <img :src="menuItem.image_url" alt="menu item" class="details-image" />
          
          <!-- Out of Stock Overlay -->
          <div v-if="!menuItem.availability" class="out-of-stock-overlay">
            <div class="overlay-content">
              <span class="overlay-icon">🚫</span>
              <span class="overlay-text">OUT OF STOCK</span>
            </div>
          </div>
        </div>

        <div class="details-body">
          <h2>{{ menuItem.name }}</h2>
          <p>{{ menuItem.description }}</p>
          <span class="details-price">Ksh {{ menuItem.price }}</span>

          <!-- Availability Status -->
          <div v-if="!menuItem.availability" class="unavailable-notice">
            <span class="notice-icon">⚠️</span>
            <span>This item is currently unavailable</span>
          </div>
          
          <div class="details-actions">
            <button 
              v-if="menuItem.availability"
              @click="orderItem" 
              class="cta-button"
            >
              Order Now
            </button>
            <button 
              v-else
              class="cta-button unavailable-button" 
              disabled
            >
              Currently Unavailable
            </button>
            <RouterLink to="/menu" class="back-button">Back to Menu</RouterLink>
          </div>
        </div>
      </div>

      <!-- Not found -->
      <div v-else class="error-text">
        Menu item not found.
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { getMenuItem } from '@/api/menu'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const menuItem = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const id = route.params.id
    menuItem.value = await getMenuItem(id)
  } catch (error) {
    console.error('Error loading menu item:', error)
  } finally {
    loading.value = false
  }
})


function orderItem() {
  // Check if item is available
  if (!menuItem.value.availability) {
    toast.warning('This item is currently unavailable')
    return
  }
  
  const token = localStorage.getItem('access')
  if (!token) {
    router.push('/login')
    return
  }
  toast.success(`Order placed for ${menuItem.value.name}!`)
}
</script>
