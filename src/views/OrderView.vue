<template>
  <div class="order-page">
    <!-- 🧾 Checkout Grid -->
    <div class="checkout-layout">
      <!-- Left Column: Cart Items -->
      <div class="cart-list-container">
        <h2>My Cart</h2>

        <!-- Empty Cart Message -->
        <div v-if="cart.length === 0" class="text-gray-500">
          Your cart is empty.
        </div>

        <!-- List of Items -->
        <div v-else>
          <CartItem
            v-for="item in cart"
            :key="item.id"
            :foodItem="item"
            @decrease="decreaseQuantity(item)"
            @increase="increaseQuantity(item)"
          ></CartItem>
        </div>
      </div>

      <!-- Right Column: Summary -->
      <div class="summary-card">
        <h2>Order Summary</h2>

        <div class="summary-row">
          <span>Subtotal</span>
          <span>Ksh {{ subtotal.toFixed(2) }}</span>
        </div>

        <div class="summary-row">
          <span>Tax (5%)</span>
          <span>Ksh {{ tax.toFixed(2) }}</span>
        </div>

        <div class="total-row">
          <span>Total</span>
          <span>Ksh {{ total.toFixed(2) }}</span>
        </div>

        <router-link to="/payment" class="cta-button block text-center mt-6">
          Proceed to Payment
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const cart = ref([
  {
    id: 1,
    name: 'Ugali & Sukuma',
    description: 'Served with beef stew',
    price: 120,
    quantity: 1,
    image_url: 'https://via.placeholder.com/100',
  },
  {
    id: 2,
    name: 'Chapati & Beans',
    description: 'Delicious and healthy',
    price: 100,
    quantity: 2,
    image_url: 'https://via.placeholder.com/100',
  },
])

function increaseQty(item) {
  item.quantity++
}
function decreaseQty(item) {
  if (item.quantity > 1) item.quantity--
}

const subtotal = computed(() => cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0))
const tax = computed(() => subtotal.value * 0.05)
const total = computed(() => subtotal.value + tax.value)
</script>
