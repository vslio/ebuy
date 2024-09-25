<template>
  <RouterLink :to="`/product/${product.id}`" :key="product.id" class="product-item">
    <img :src="`${product.image}/300/300`" :alt="product.name" class="product-image" />
    <div class="product-info">
      <h2>{{ product.name }}</h2>
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

h2 {
  margin: 0;
  font-size: 1.6em;
  font-weight: 900;
}

.product-price {
  font-size: 1.6em;
  font-weight: 900;
  line-height: 1;
}

img {
  width: 100%;
}
</style>
