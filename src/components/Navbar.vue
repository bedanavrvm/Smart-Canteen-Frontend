<template>
  <nav class="main-nav">
    <router-link to="/" class="nav-logo">Smart Canteen</router-link>
 
    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/menu">Menu</router-link>
    </div>
 
    <div class="flex items-center space-x-4">
      <!-- Show Login/Register when not authenticated -->
      <template v-if="!isAuthenticated">
        <router-link to="/login" class="nav-auth-link">Login</router-link>
        <router-link to="/register" class="nav-auth-link primary">Register</router-link>
      </template>

      <!-- Cart Button - Only show when authenticated -->
      <button 
        v-if="isAuthenticated" 
        @click="cartStore.toggleCartSidebar" 
        class="cart-icon-button"
      >
        <span class="icon">🛒</span>
        <span v-if="totalItems > 0" class="badge">{{ totalItems }}</span>
      </button>
 
      <!-- User menu dropdown -->
      <div v-if="isAuthenticated" class="relative">
        <button @click="toggleMenu" class="user-menu-button">
          <div class="user-avatar">{{ userInitials }}</div>
          <span v-if="user">{{ user.name }}</span>
        </button>
 
        <!-- Dropdown Panel -->
        <div v-if="showMenu" class="user-menu-dropdown">
          <router-link to="/account" class="user-menu-item">
            Account Details
          </router-link>
          <router-link to="/orders" class="user-menu-item">
            My Orders
          </router-link>
          <!-- Staff Management - Only for Staff and Admin -->
          <router-link 
            v-if="user && (user.role === 'staff' || user.role === 'admin')" 
            to="/staff/orders" 
            class="user-menu-item"
          >
            Manage Orders
          </router-link>
          <router-link 
            v-if="user && (user.role === 'staff' || user.role === 'admin')" 
            to="/staff/menu-management" 
            class="user-menu-item"
          >
            Menu Management
          </router-link>
          <button @click="handleLogout" class="user-menu-item w-full text-left">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
 
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
 
// Use the Pinia stores
const authStore = useAuthStore();
const cartStore = useCartStore();

// Destructure state and getters with storeToRefs to keep reactivity
const { user, isAuthenticated, userInitials } = storeToRefs(authStore);
const { totalItems } = storeToRefs(cartStore);

const router = useRouter()
 
// State for user dropdown menu
const showMenu = ref(false)
function toggleMenu() {
  showMenu.value = !showMenu.value
}
 
// Handle user logout
function handleLogout() {
  authStore.logout();
  showMenu.value = false; // Close dropdown
  router.push('/login'); // Redirect to login page
}
</script>
