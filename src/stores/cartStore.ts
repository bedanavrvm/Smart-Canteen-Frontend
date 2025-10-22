// src/stores/cartStore.ts

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue' // <-- Import 'watch'

// Define the shape of an item in the cart
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  // Add other properties like image, etc.
}

export const useCartStore = defineStore('cart', () => {
  // --- State ---

  // 1. Load items from localStorage on initialization
  const storedItems = localStorage.getItem('cartItems')
  const initialItems: CartItem[] = storedItems ? JSON.parse(storedItems) : []

  const items = ref<CartItem[]>(initialItems) // <-- Use CartItem[] type
  const showCartSidebar = ref(false)

  // --- Getters ---
  // Pinia/Vue automatically infers the types here, but explicit types are good practice
  const totalItems = computed<number>(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const subtotal = computed<number>(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

  // --- Actions ---
  function toggleCartSidebar() {
    showCartSidebar.value = !showCartSidebar.value
  }

  // Item parameter is expected to have 'id', 'name', and 'price' properties
  function addToCart(item: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find(i => i.id === item.id)
    if (existing) {
      existing.quantity++
    } else {
      // Cast the new item structure to CartItem
      items.value.push({ ...item, quantity: 1 } as CartItem)
    }
    showCartSidebar.value = true
  }

  function changeQty(item: { id: number }, delta: number) {
    const targetItem = items.value.find(i => i.id === item.id)
    if (targetItem) {
      targetItem.quantity += delta
      if (targetItem.quantity <= 0) {
        items.value = items.value.filter(i => i.id !== item.id)
      }
    }
  }

  // --- Persistence Fix ---
  // 2. Watch for any changes to the cart items and save to localStorage
  watch(items, (newItems) => {
    localStorage.setItem('cartItems', JSON.stringify(newItems))
  }, { deep: true }) // 'deep: true' is crucial for changes within array objects

  return { items, showCartSidebar, totalItems, subtotal, toggleCartSidebar, addToCart, changeQty }
})