<template>
  <div class="search-view">
    <div v-if="$route.params.term">
      <span
        >You searched for it and we found {{ products.length }}
        {{ products.length === 1 ? 'result' : 'results' }}.
      </span>
      <div class="search-term-container">
        <h1 class="display" data-wavy>
          {{ $route.params.term }}
        </h1>
        <RouterLink to="/?category=all&page=1" data-skew class="clear-search-term">x</RouterLink>
      </div>
    </div>
    <div v-if="products.length > 0" class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
    <div v-else-if="errorMessage" class="text-center">
      <img src="/icons/angry.svg" width="60" height="60" />
      <h2>{{ errorMessage }}</h2>
    </div>
    <div v-else class="text-center">
      <img src="/icons/angry.svg" width="60" height="60" />
      <h2>We couldn't find what you're looking for &hellip;</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
import type { ResponseWithoutPagination, Product } from '@/services/api/handlers'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const products = ref<Product[]>([])
const errorMessage = ref('')

const searchProducts = async () => {
  try {
    const response = await fetch(`/api/products/search/${route.params.term}`)

    if (!response.ok) {
      if (response.status === 400)
        errorMessage.value = 'You need to type something up there, first.'
      throw new Error()
    }

    const { data } = (await response.json()) as ResponseWithoutPagination<Product[]>

    products.value = data
  } catch (error) {
    console.error('Error searching products ->', error)
  }
}

watch(() => route.params.term, searchProducts, { immediate: true })

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
  color: var(--color-stroke);
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
