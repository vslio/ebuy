<template>
  <div class="search-view">
    <div>
      <h2>You searched for</h2>
      <h1 class="wavy active" :data-wavy="`${$route.query.term} ${$route.query.term}`">
        {{ $route.query.term }}
      </h1>
    </div>
    <div v-if="products.length > 0" class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
    <div v-else class="text-center">
      <span class="emoji">😾</span>
      <h2>We couldn't find what you're looking for &hellip;</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/services/api/handlers'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const products = ref<Product[]>([])

const searchProducts = async () => {
  try {
    const response = await fetch(`/api/products/search/${route.query.term}`)

    if (!response.ok) {
      throw new Error('Failed to search for products')
    }

    products.value = await response.json()
  } catch (error) {
    console.error('Error searching products ->', error)
  }
}

watch(() => route.query.term, searchProducts, { immediate: true })

onMounted(() => {
  searchProducts()
})
</script>

<style scoped>
.search-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

h1 {
  display: inline-block;
  align-self: flex-start;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

h2 {
  margin-bottom: 0;
}

.emoji {
  font-size: 3rem;
}
</style>
