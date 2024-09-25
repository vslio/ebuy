<template>
  <div class="product-grid">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
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
