<template>
  <div class="search-view">
    <div>
      <span
        >You searched for it and we found {{ products.length }}
        {{ products.length === 1 ? 'result' : 'results' }}.
      </span>
      <div class="search-term-container">
        <h1 class="display" data-wavy>
          {{ $route.query.term }}
        </h1>
        <RouterLink to="/?category=all&page=1" data-skew class="clear-search-term">x</RouterLink>
      </div>
    </div>
    <div v-if="products.length > 0" class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
    <div v-else class="text-center">
      <img src="/icons/angry.svg" width="60" height="60" />
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

span {
  font-size: 1.2rem;
}

.search-term-container {
  display: flex;
  justify-content: flex-start;
  gap: 32px;
}

.clear-search-term {
  font-family: 'Syne';
  font-variation-settings: 'wght' 700;
  font-size: 2rem;
}

h1 {
  display: inline-block;
  align-self: flex-start;
}

h2 {
  margin-bottom: 0;
  line-height: 1;
}
</style>
