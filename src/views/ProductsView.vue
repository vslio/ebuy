<template>
  <div class="products-view">
    <div class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
    <div class="pagination">
      <button @click="goToPreviousPage" :disabled="currentPage === 1">←</button>
      <h2>Page {{ currentPage }} of {{ totalPages }}</h2>
      <button @click="goToNextPage" :disabled="currentPage === totalPages">→</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
import type { PaginatedResponse, Product } from '@/services/api/handlers'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const products = ref<Product[]>([])
const currentPage = ref(Number(route.query?.page) || 1)
const totalPages = ref(1)

const fetchProducts = async () => {
  try {
    const response = await fetch(`/api/products?page=${currentPage.value}`)

    if (!response.ok) {
      if (response.status === 400) {
        router.replace(`/?page=1`)
      } else {
        throw new Error('Failed to fetch products')
      }
    }

    const { data, pagination } = (await response.json()) as PaginatedResponse<Product>

    products.value = data
    currentPage.value = pagination.current
    totalPages.value = pagination.total

    window.scrollTo(0, 0)
  } catch (error) {
    console.error('Error fetching products -> ', error)
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    router.push(`/?page=${currentPage.value - 1}`)
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    router.push(`/?page=${currentPage.value + 1}`)
  }
}

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = Number(newPage)
    fetchProducts()
  },
  { immediate: true }
)

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.pagination {
  padding: 24px 0;
  display: flex;
  align-self: center;
  align-items: center;
  gap: 12px;

  button {
    font-family: 'Gza';
    font-size: 1.4rem;
  }

  h2 {
    margin: 0;
  }

  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
