<template>
  <div class="products-view">
    <nav class="categories">
      <RouterLink data-wavy :class="category === 'all' ? 'display' : ''" to="/?category=all&page=1"
        ><h3>All</h3></RouterLink
      >
      <RouterLink
        data-wavy
        :class="category === 't-shirts' ? 'display' : ''"
        to="/?category=t-shirts&page=1"
        ><h3>T–Shirts</h3></RouterLink
      >
      <RouterLink
        data-wavy
        :class="category === 'tea-towels' ? 'display' : ''"
        to="/?category=tea-towels&page=1"
        ><h3>Tea Towels</h3></RouterLink
      >
      <RouterLink
        data-wavy
        :class="category === 'caps' ? 'display' : ''"
        to="/?category=caps&page=1"
        ><h3>Caps</h3></RouterLink
      >
    </nav>
    <div class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
    <div class="pagination">
      <button data-test-button-previous @click="goToPreviousPage" :disabled="currentPage === 1">
        ←
      </button>
      <h2 data-test-current-page>Page {{ currentPage }} of {{ totalPages }}</h2>
      <button data-test-button-next @click="goToNextPage" :disabled="currentPage === totalPages">
        →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
import type { Categories, ResponseWithPagination, Product } from '@/services/api/handlers'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const products = ref<Product[]>([])
const category = ref<Categories>('all')
const currentPage = ref(Number(route.query?.page) || 1)
const totalPages = ref(1)

const fetchProducts = async () => {
  try {
    const response = await fetch(
      `/api/products?category=${category.value}&page=${currentPage.value}`
    )

    if (!response.ok) {
      if (response.status === 400) {
        router.replace(`/?category=all&page=1`)
      } else {
        throw new Error('Failed to fetch products')
      }
    }

    const { data, pagination } = (await response.json()) as ResponseWithPagination<Product[]>

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
    router.push(`/?category=${category.value}&page=${currentPage.value - 1}`)
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    router.push(`/?category=${category.value}&page=${currentPage.value + 1}`)
  }
}

watch(
  () => route.query,
  (query) => {
    currentPage.value = Number(query.page)
    category.value = query.category as Categories

    fetchProducts()
  },
  {
    immediate: true
  }
)
</script>

<style scoped>
.products-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 8px;
}

.categories {
  display: flex;
  flex-direction: row;
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

  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
