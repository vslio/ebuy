<template>
  <RouterLink :to="`/product/${product.id}`" :key="product.id" class="product-card">
    <img :src="`${product.image}/300/300`" :alt="product.name" />
    <div class="product-info">
      <h2 data-wavy>{{ product.name }}</h2>
      <h3 class="product-price">€{{ product.price.toFixed(2) }}</h3>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Product } from '@/services/api/handlers'

defineProps<{
  product: Product
}>()
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h2,
h3 {
  margin: 0;
}

h2 {
  font-size: 1.6rem;
}

.product-price {
  font-family: 'PPNeueMachina';
  font-size: 1.2rem;
}

img {
  width: 100%;
}
</style>
