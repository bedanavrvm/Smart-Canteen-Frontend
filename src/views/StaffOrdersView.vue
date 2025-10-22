<template>
  <div class="page-container">
    <section class="feature-section">
      <h2>Manage Orders</h2>

      <!-- Status Filter Tabs -->
      <div class="status-tabs">
        <button 
          v-for="status in statusTabs" 
          :key="status.value"
          @click="selectedStatus = status.value"
          :class="['status-tab', { active: selectedStatus === status.value }]"
        >
          {{ status.label }}
          <span v-if="getOrderCountByStatus(status.value)" class="count-badge">
            {{ getOrderCountByStatus(status.value) }}
          </span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-text">Loading orders...</div>

      <!-- Orders List -->
      <div v-else-if="filteredOrders.length === 0" class="no-results">
        <p>No {{ selectedStatus }} orders</p>
      </div>

      <div v-else class="orders-list">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id" 
          class="staff-order-card"
        >
          <div class="order-header">
            <div>
              <h3>Order #{{ order.id }}</h3>
              <p class="order-time">{{ formatDate(order.created_at) }}</p>
            </div>
            <span :class="['status-badge', `status-${order.status}`]">
              {{ order.status }}
            </span>
          </div>

          <div class="order-customer">
            <strong>Customer:</strong> {{ order.user?.name || 'Unknown' }}
            <br>
            <strong>Pickup Time:</strong> {{ order.pickup_time || 'Not specified' }}
          </div>

          <div class="order-items">
            <h4>Items:</h4>
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.quantity }}x {{ item.menu_item?.name || 'Unknown Item' }} 
                - Ksh {{ (parseFloat(item.price || 0) * item.quantity).toFixed(2) }}
              </li>
            </ul>
          </div>

          <div class="order-total">
            <strong>Total:</strong> Ksh {{ parseFloat(order.total_price || 0).toFixed(2) }}
          </div>

          <!-- Action Buttons -->
          <div class="order-actions">
            <!-- Confirmed -> Preparing -->
            <button 
              v-if="order.status === 'confirmed'"
              @click="updateOrderStatus(order.id, 'preparing')"
              class="action-btn accept-btn"
              :disabled="updating"
            >
              ✓ Accept Order
            </button>

            <!-- Confirmed -> Cancelled (Reject) -->
            <button 
              v-if="order.status === 'confirmed'"
              @click="rejectOrder(order.id)"
              class="action-btn reject-btn"
              :disabled="updating"
            >
              ✕ Reject Order
            </button>

            <!-- Preparing -> Ready -->
            <button 
              v-if="order.status === 'preparing'"
              @click="updateOrderStatus(order.id, 'ready')"
              class="action-btn ready-btn"
              :disabled="updating"
            >
              🍽️ Mark as Ready
            </button>

            <!-- Ready -> Completed -->
            <button 
              v-if="order.status === 'ready'"
              @click="completeOrder(order.id)"
              class="action-btn complete-btn"
              :disabled="updating"
            >
              ✓ Mark as Completed
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { confirmAction } from '@/utils/sweetalert'
import { getAllOrdersForStaff, updateOrder } from '@/api/order'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

// Check if user is staff
if (authStore.user?.role !== 'staff' && authStore.user?.role !== 'admin') {
  toast.error('Access denied. Only staff members can access this page.')
  router.push('/dashboard')
}

const orders = ref([])
const loading = ref(true)
const updating = ref(false)
const selectedStatus = ref('confirmed')

const statusTabs = [
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

// Computed: Filtered orders by selected status
const filteredOrders = computed(() => {
  return orders.value
    .filter(order => order.status === selectedStatus.value)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// Get order count by status
function getOrderCountByStatus(status) {
  return orders.value.filter(order => order.status === status).length
}

// Fetch all orders
async function fetchOrders() {
  try {
    loading.value = true
    // Fetch ALL orders for staff (not just current user's orders)
    orders.value = await getAllOrdersForStaff()
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.error('Failed to load orders')
  } finally {
    loading.value = false
  }
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
  try {
    updating.value = true
    await updateOrder(orderId, { status: newStatus })
    toast.success(`Order updated to ${newStatus}`)
    await fetchOrders()
  } catch (error) {
    console.error('Error updating order:', error)
    toast.error('Failed to update order status')
  } finally {
    updating.value = false
  }
}

// Reject order (staff)
async function rejectOrder(orderId) {
  const confirmed = await confirmAction(
    'Reject Order?',
    'Are you sure you want to reject this order? The customer will be notified.',
    'Yes, reject it'
  )

  if (confirmed) {
    await updateOrderStatus(orderId, 'cancelled')
  }
}

// Complete order
async function completeOrder(orderId) {
  const confirmed = await confirmAction(
    'Mark as Completed?',
    'Confirm that the customer has picked up this order and payment is verified.',
    'Yes, complete it'
  )

  if (confirmed) {
    await updateOrderStatus(orderId, 'completed')
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await fetchOrders()
})
</script>

<style scoped>
/* Status Tabs */
.status-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.status-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-tab:hover {
  border-color: #10b981;
  background: #f0fdf4;
}

.status-tab.active {
  border-color: #10b981;
  background: #10b981;
  color: white;
}

.count-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.status-tab.active .count-badge {
  background: rgba(255, 255, 255, 0.3);
}

/* Orders List */
.orders-list {
  display: grid;
  gap: 1.5rem;
}

.staff-order-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.order-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.order-time {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-confirmed { background: #dbeafe; color: #1e40af; }
.status-preparing { background: #fef3c7; color: #92400e; }
.status-ready { background: #d1fae5; color: #065f46; }
.status-completed { background: #e0e7ff; color: #3730a3; }
.status-cancelled { background: #fee2e2; color: #991b1b; }

.order-customer {
  margin-bottom: 1rem;
  color: #374151;
  line-height: 1.6;
}

.order-items {
  margin-bottom: 1rem;
}

.order-items h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.order-items ul {
  list-style: none;
  padding-left: 0;
}

.order-items li {
  padding: 0.5rem 0;
  color: #4b5563;
}

.order-total {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

/* Action Buttons */
.order-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.accept-btn {
  background: #10b981;
  color: white;
}

.accept-btn:hover:not(:disabled) {
  background: #059669;
}

.reject-btn {
  background: #ef4444;
  color: white;
}

.reject-btn:hover:not(:disabled) {
  background: #dc2626;
}

.ready-btn {
  background: #3b82f6;
  color: white;
}

.ready-btn:hover:not(:disabled) {
  background: #2563eb;
}

.complete-btn {
  background: #8b5cf6;
  color: white;
}

.complete-btn:hover:not(:disabled) {
  background: #7c3aed;
}
</style>
