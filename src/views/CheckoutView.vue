<template>
  <div class="page-container">
    <div class="checkout-page">
      <h1 class="page-title">Checkout</h1>

      <div class="checkout-grid">
        <!-- Main Checkout Content -->
        <div class="checkout-main">
          
          <!-- Cart Items -->
          <div class="checkout-section">
            <h2 class="section-header">Order Items</h2>
            <div v-if="items.length" class="order-items">
              <div 
                v-for="item in items" 
                :key="item.id" 
                class="order-item"
              >
                <img 
                  :src="item.image_url" 
                  :alt="item.name" 
                  class="order-item-image"
                />
                <div class="flex-1">
                  <h4 class="order-item-name">{{ item.name }}</h4>
                  <p class="order-item-quantity">Quantity: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="order-item-price">Ksh {{ item.price }}</p>
                  <p class="order-item-subtotal">Subtotal: Ksh {{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-10 text-gray-600">
              Your cart is empty
            </div>
          </div>

          <!-- Delivery/Pickup Information -->
          <div class="checkout-section">
            <h2 class="section-header">Pickup Details</h2>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Pickup Time</label>
                <input 
                  v-model="form.pickup_time" 
                  type="time" 
                  class="form-input"
                  min="08:00"
                  max="20:00"
                  step="900"
                  required
                  placeholder="Select pickup time"
                />
                <p class="text-sm text-gray-500 mt-1">Pickup available 8:00 AM - 8:00 PM</p>
              </div>
              <div class="form-group">
                <label class="form-label">Special Instructions (Optional)</label>
                <textarea 
                  v-model="form.notes" 
                  class="form-input"
                  rows="3"
                  placeholder="Any special requests?"
                />
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="checkout-section">
            <h2 class="section-header">Payment Method</h2>
            <div class="payment-methods-group">
              <div 
                v-for="method in paymentMethods" 
                :key="method.id"
                class="method-option"
                :class="{ 'is-selected': form.payment_method === method.id }"
                @click="form.payment_method = method.id"
              >
                <div>
                  <p class="font-semibold">{{ method.name }}</p>
                  <p class="text-sm text-gray-600">{{ method.description }}</p>
                </div>
                <input 
                  type="radio" 
                  :value="method.id" 
                  v-model="form.payment_method"
                  class="w-5 h-5"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="checkout-sidebar">
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

            <div class="summary-row">
              <span>Payment Method</span>
              <span class="font-semibold">{{ selectedPaymentMethodName }}</span>
            </div>

            <div class="total-row">
              <span>Total</span>
              <span>Ksh {{ total.toFixed(2) }}</span>
            </div>

            <button 
              @click="placeOrder" 
              class="cta-button mt-6 w-full"
              :disabled="placing || items.length === 0"
            >
              {{ placing ? 'Placing Order...' : 'Place Order' }}
            </button>

            <p class="text-sm text-gray-500 text-center mt-4">
              By placing your order, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { createOrder } from '@/api/order'

const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()
const authStore = useAuthStore()

const { items, subtotal } = storeToRefs(cartStore)
const { user } = storeToRefs(authStore)

const placing = ref(false)

const form = ref({
  pickup_time: '',
  notes: '',
  payment_method: 'mpesa'
})

const paymentMethods = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Pay using your M-Pesa mobile money'
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay with Visa, Mastercard, or other cards'
  },
  {
    id: 'cash',
    name: 'Cash on Pickup',
    description: 'Pay when you collect your order'
  }
]

const tax = computed(() => subtotal.value * 0.05)
const total = computed(() => subtotal.value + tax.value)

const selectedPaymentMethodName = computed(() => {
  const method = paymentMethods.find(m => m.id === form.value.payment_method)
  return method ? method.name : 'Not selected'
})

async function placeOrder() {
  if (items.value.length === 0) {
    toast.warning('Your cart is empty!')
    return
  }

  if (!form.value.pickup_time) {
    toast.warning('Please select a pickup time')
    return
  }

  placing.value = true
  
  try {
    // Save total before clearing cart
    const orderTotal = total.value
    
    // Prepare order data
    const orderData = {
      user: user.value.id,
      total_price: orderTotal,
      status: 'confirmed', // Order is confirmed once successfully created
      pickup_time: form.value.pickup_time,
      items_data: items.value.map(item => ({
        menu_item_id: item.id,  // Use menu_item_id for write operations
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }))
    }

    // Create the order
    const order = await createOrder(orderData)
    
    // Clear cart
    cartStore.items = []
    
    // Show success message
    toast.success(`Order #${order.id} placed successfully! Total: Ksh ${orderTotal.toFixed(2)}`)
    
    // Redirect to orders page
    router.push('/orders')
    
  } catch (error) {
    console.error('Error placing order:', error)
    toast.error('Failed to place order. Please try again.')
  } finally {
    placing.value = false
  }
}
</script>

<style scoped>
.method-option {
  cursor: pointer;
}

.method-option.is-selected {
  border-color: #10b981;
  background-color: #f0fdf4;
}
</style>
