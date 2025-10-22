<template>
  <div class="page-container">
  
    <!-- Hero Section -->
    <section class="hero-section">
      <h1>Smart Canteen Ordering System</h1>
      <p>View canteen menus, order food, and pay online — no more waiting in line.</p>
      <div class="hero-actions">
        <router-link to="/menu" class="cta-button">Browse Menu</router-link>
        <router-link v-if="!isAuthenticated" to="/login" class="cta-button">Sign In</router-link>
        <router-link v-else to="/orders" class="cta-button">My Orders</router-link>
      </div>
    </section>

    <!-- Menu Preview Section -->
    <section class="feature-section">
      <h2>Popular Dishes</h2>
      <div class="menu-grid">
        <MenuCard 
          v-for="item in menuItems" 
          :key="item.id" 
          :foodItem="item" 
          :hideOrderButton="!isAuthenticated"
          @add-to-cart="cartStore.addToCart"
          class="menu-card"
        />
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { getAllMenuItems } from '@/api/menu'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import Footer from '@/components/Footer.vue'
import MenuCard from '@/components/MenuCard.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
const { isAuthenticated } = storeToRefs(authStore)

const menuItems = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    menuItems.value = await getAllMenuItems()
  } catch (e) {
    console.error('Failed to fetch menu', e)
  } finally {
    loading.value = false
  }
})

</script>
