<template>
  <div class="cart-item-row">
    <div class="item-details">
      <img :src="item.image_url" alt="" class="item-image" />
      <div>
        <h3>{{ foodItem.name }}</h3>
        <p>{{ foodItem.description }}</p>
      </div>
    </div>

    <div class="qty-controls">
      <button @click="$emit('decrease')">-</button>
      <span>{{ foodItem.quantity }}</span>
      <button @click="$emit('increase')">+</button>
    </div>

    <div class="item-price">
      Ksh {{ (foodItem.price * foodItem.quantity).toFixed(2) }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  foodItem: Object
})
</script>
