<template>
  <!-- Slide-in cart sidebar -->
  <div v-if="showCartSidebar" class="cart-sidebar is-visible">
    <div class="cart-header">
      <h2 class="cart-title">Your Cart</h2>
      <button @click="cartStore.toggleCartSidebar" class="cart-close-btn">
        ×
      </button>
    </div>

    <div v-if="items.length" class="cart-list-container">
      <div
        v-for="item in items"
        :key="item.id"
        class="cart-item-row"
      >
        <div class="item-details">
          <img :src="item.image_url" alt="" class="item-image" />
          <div>
            <h3>{{ item.name }}</h3>
            <p>Ksh {{ item.price }}</p>
          </div>
        </div>

        <div class="qty-controls">
          <button @click="cartStore.changeQty(item, -1)">−</button>
          <span>{{ item.quantity }}</span>
          <button @click="cartStore.changeQty(item, 1)">+</button>
        </div>

        <!-- Item subtotal display -->
        <div class="item-subtotal">
          <span>Ksh {{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <h3 class="summary-title">Subtotal</h3>
        <div class="summary-row">
          <span>Total:</span>
          <span>Ksh {{ subtotal.toFixed(2) }}</span>
        </div>
        <router-link 
          to="/checkout" 
          @click="cartStore.toggleCartSidebar"
          class="cta-button checkout-btn"
        >
          Proceed to Checkout
        </router-link>
      </div>
    </div>

    <div v-else class="empty-cart">
      No items in cart.
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
const { items, showCartSidebar, subtotal } = storeToRefs(cartStore)
</script>

<style scoped>
.cart-sidebar {
  position: fixed;
  top: 80px;
  right: 0;
  width: 400px;
  max-width: 90vw;
  height: calc(100vh - 80px);
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
  padding: 1.5rem;
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.cart-sidebar.is-visible {
  transform: translateX(0);
}
</style>
