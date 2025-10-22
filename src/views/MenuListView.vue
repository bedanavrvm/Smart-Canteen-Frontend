<template>
  <div class="page-container">
    <section class="feature-section">
      <h2>Available Meals</h2>

      <div v-if="loading">Loading menu...</div>

      <div v-else class="menu-grid">
        <MenuCard v-for="item in menuItems" :key="item.id" :foodItem="item" class="menu-card"></MenuCard>
          
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllMenuItems } from '@/api/menu'
import MenuCard from '@/components/MenuCard.vue'

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
