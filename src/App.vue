<template>
  <div id="app">
    <Navbar v-if="shouldShowNavbar" />
    <router-view />
    <!-- Global Cart Sidebar -->
    <CartSidebar />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import CartSidebar from '@/components/CartSidebar.vue';

const route = useRoute();

// Hide navbar on login and register pages
const shouldShowNavbar = computed(() => {
  const publicPages = ['/login', '/register'];
  return !publicPages.includes(route.path);
});
</script>
