<template>
  <RouterLink :to="`/product/${product.id}`" :key="product.id" class="product-item">
    <img :src="`${product.image}/300/300`" :alt="product.name" />
    <div class="product-info">
      <h2 data-wavy>{{ product.name }}</h2>
      <span class="product-price">€{{ product.price.toFixed(2) }}</span>
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
.product-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  font-size: 1.4rem;
}

.product-price {
  font-family: 'PPNeueMachina';
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1;
}

img {
  width: 100%;
}
</style>
