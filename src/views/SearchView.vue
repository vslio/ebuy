<template>
  <h1>Search</h1>
  <div class="product-grid">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/services/api/handlers'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const products = ref<Product[]>([])

const searchProducts = async () => {
  try {
    const route = useRoute()
    const response = await fetch(`/api/products/search/${route.query.term}`)

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    products.value = await response.json()
  } catch (error) {
    console.error('Error fetching products ->', error)
  }
}

onMounted(() => {
  searchProducts()
})
</script>
