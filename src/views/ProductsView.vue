<template>
  <div class="product-list">
    <RouterLink
      :to="`/product/${product.id}`"
      v-for="product in products"
      :key="product.id"
      class="product-item"
    >
      <img :src="`${product.image}/300/300`" :alt="product.name" class="product-image" />
      <div>
        <h2>{{ product.name }}</h2>
        <span class="product-price">€{{ product.price.toFixed(2) }}</span>
      </div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/services/api/handlers'
import { ref, onMounted } from 'vue'

const products = ref<Product[]>([])

const fetchProducts = async () => {
  try {
    const response = await fetch('/api/products')

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    products.value = await response.json()
  } catch (error) {
    console.error('Error fetching products ->', error)
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 32px;
}

.product-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
