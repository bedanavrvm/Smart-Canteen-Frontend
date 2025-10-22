<template>
  <div class="menu-card" ref="cardRef" :class="{ 'z-30': showPopup, 'out-of-stock': !foodItem.availability }">
    <!-- Image with Overlay -->
    <div class="image-container">
      <img :src="foodItem.image_url" alt="menu item" class="card-image" />
      
      <!-- Out of Stock Overlay -->
      <div v-if="!foodItem.availability" class="out-of-stock-overlay">
        <div class="overlay-content">
          <span class="overlay-icon">🚫</span>
          <span class="overlay-text">OUT OF STOCK</span>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <h2 class="card-title">{{ foodItem.name }}</h2>
      <p class="card-description">{{ foodItem.description }}</p>

      <!-- Footer -->
      <div class="card-footer">
        <span class="card-price">Ksh {{ foodItem.price }}</span>

        <!-- Buttons -->
        <div class="card-actions">
          <button @click="togglePopup" class="cta-button">Details</button>
          <button 
            v-if="!hideOrderButton && foodItem.availability" 
            @click.stop="$emit('add-to-cart', foodItem)" 
            class="cta-button"
          >
            Order
          </button>
          <button 
            v-if="!hideOrderButton && !foodItem.availability" 
            class="cta-button unavailable-button" 
            disabled
          >
            Unavailable
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ Popup appears below the card -->
    <transition name="fade-scale">
      <div v-if="showPopup" class="popup-card">
        <!-- <img :src="foodItem.image_url" alt="food" class="card-image" /> -->
        <!-- <h2 class="card-title">{{ foodItem.name }}</h2> -->
        <p class="card-description">{{ foodItem.description }}</p>

        <p><strong>Ingredients:</strong> {{ foodItem.ingredients || 'N/A' }}</p>
        <p><strong>Preparation:</strong> {{ foodItem.preparation || 'Not specified' }}</p>

        <button @click="closePopup" class="cta-button">Close</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref,onMounted, onUnmounted } from 'vue'

const props = defineProps({
  foodItem: {
    type: Object,
    required: true,
  },
  hideOrderButton: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['add-to-cart'])

const showPopup = ref(false)
const cardRef = ref(null)

function togglePopup() {
  showPopup.value = !showPopup.value
}

function closePopup() {
  showPopup.value = false
}

function handleClickOutside(event) {
  // 1. Check if the popup is currently visible
  if (showPopup.value) {
    // 2. Check if the clicked element (event.target) is NOT inside the cardRef element.
    // .contains() is a native DOM method that checks if one element is a descendant of another.
    if (cardRef.value && !cardRef.value.contains(event.target)) {
      closePopup()
    }
  }
}

// Lifecycle Hook: Add the listener when the component is mounted
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Lifecycle Hook: Clean up the listener when the component is destroyed
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
