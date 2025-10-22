<template>
  <div class="page-container">
    <div class="orders-page">
      <h1 class="page-title">My Orders</h1>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-10">
        <p class="text-gray-600">Loading orders...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h2 class="empty-title">No Orders Yet</h2>
        <p class="empty-message">You haven't placed any orders yet.</p>
        <router-link to="/dashboard" class="primary-button inline-block">
          Start Ordering
        </router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="orders-list">
        <div 
          v-for="order in orders" 
          :key="order.id" 
          class="order-card"
        >
          <!-- Order Header -->
          <div class="order-header">
            <div>
              <h3 class="order-id">Order #{{ order.id }}</h3>
              <p class="order-date">
                {{ formatDate(order.created_at) }}
              </p>
            </div>
            <div class="text-right">
              <span 
                class="order-status"
                :class="getStatusClass(order.status)"
              >
                {{ formatStatus(order.status) }}
              </span>
              <p class="order-total">Ksh {{ order.total_amount }}</p>
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="order-item"
            >
              <img 
                v-if="item.menu_item_image" 
                :src="item.menu_item_image" 
                :alt="item.menu_item_name"
                class="order-item-image"
              />
              <div class="flex-1">
                <h4 class="order-item-name">{{ item.menu_item_name }}</h4>
                <p class="order-item-quantity">Quantity: {{ item.quantity }}</p>
              </div>
              <div class="text-right">
                <p class="order-item-price">Ksh {{ item.price }}</p>
                <p class="order-item-subtotal">Subtotal: Ksh {{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="order-actions">
            <button 
              v-if="order.status === 'confirmed'" 
              @click="cancelOrder(order.id)"
              class="cancel-order-btn"
            >
              Cancel Order
            </button>
            <button 
              @click="viewOrderDetails(order.id)"
              class="primary-button"
            >
              View Details
            </button>
            <button 
              v-if="order.status === 'completed'" 
              @click="reorder(order)"
              class="primary-button"
            >
              Reorder
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { confirmAction } from '@/utils/sweetalert'
import { getAllOrders } from '@/api/order'
import { updateOrder } from '@/api/order'

const toast = useToast()
const router = useRouter()

const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  await fetchOrders()
})

async function fetchOrders() {
  loading.value = true
  try {
    // Backend now filters orders by current user automatically
    orders.value = await getAllOrders()
    // Sort by date (newest first)
    orders.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.error('Failed to load orders. Please try again.')
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatStatus(status) {
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'preparing': 'Preparing',
    'ready': 'Ready for Pickup',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return statusMap[status] || status
}

function getStatusClass(status) {
  const classMap = {
    'pending': 'status-pending',
    'confirmed': 'status-confirmed',
    'preparing': 'status-preparing',
    'ready': 'status-ready',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  }
  return classMap[status] || 'status-completed'
}

async function cancelOrder(orderId) {
  console.log('Cancel clicked for order:', orderId)
  
  const confirmed = await confirmAction(
    'Cancel Order?',
    'Are you sure you want to cancel this order? This action cannot be undone.',
    'Yes, cancel it'
  )
  
  if (!confirmed) return
  
  try {
    console.log('Sending cancel request to API...')
    // Update order status in backend
    await updateOrder(orderId, { status: 'cancelled' })
    
    toast.success('Order cancelled successfully')
    await fetchOrders()
  } catch (error) {
    console.error('Error cancelling order:', error)
    toast.error('Failed to cancel order. Please try again.')
  }
}

function viewOrderDetails(orderId) {
  router.push(`/order/${orderId}`)
}

function reorder(order) {
  // TODO: Implement reorder functionality
  // This would add all items from the order back to the cart
  toast.info('Reorder functionality coming soon!')
}
</script>

<style scoped>
.secondary-button {
  padding: 0.5rem 1rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background: #d1d5db;
}

.cancel-order-btn {
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border: 2px solid #fecaca;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-order-btn:hover {
  background: #fecaca;
  border-color: #fca5a5;
}
</style>
