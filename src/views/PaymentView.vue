<template>
  <div class="payment-page">
    <h1>Payment</h1>

    <!-- Payment Method Selection -->
    <div class="payment-methods-group">
      <div
        v-for="method in methods"
        :key="method.value"
        class="method-option"
        :class="{ 'is-selected': selectedMethod === method.value }"
        @click="selectedMethod = method.value"
      >
        <span>{{ method.label }}</span>
        <span v-if="selectedMethod === method.value">✔</span>
      </div>
    </div>

    <!-- Card Details Section -->
    <div v-if="selectedMethod === 'card'" class="card-details-group">
      <div>
        <label>Card Holder Name</label>
        <input v-model="card.name" type="text" class="form-input" />
      </div>
      <div>
        <label>Card Number</label>
        <input v-model="card.number" type="text" class="form-input" />
      </div>
      <div class="form-split-row">
        <div>
          <label>Expiry Date</label>
          <input v-model="card.expiry" type="text" class="form-input" />
        </div>
        <div>
          <label>CVV</label>
          <input v-model="card.cvv" type="text" class="form-input" />
        </div>
      </div>
    </div>

    <!-- Payment Summary -->
    <div class="payment-summary-footer">
      <div class="total-row">
        <span>Total</span>
        <span>Ksh {{ total.toFixed(2) }}</span>
      </div>
      <button class="primary-button" @click="confirmPayment">
        Confirm Payment
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const selectedMethod = ref('')
const total = ref(400)
const card = ref({ name: '', number: '', expiry: '', cvv: '' })

const methods = [
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'cash', label: 'Cash on Pickup' },
]

function confirmPayment() {
  if (!selectedMethod.value) {
    toast.warning('Please select a payment method.')
    return
  }
  toast.success(`Payment via ${selectedMethod.value} confirmed!`)
}
</script>
