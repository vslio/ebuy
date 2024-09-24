<template>
  <div class="product-list">
    <div v-for="product in products" :key="product.id" class="product-item">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div class="product-details">
        <h3>{{ product.name }}</h3>
        <p class="product-price">€{{ product.price.toFixed(2) }}</p>
        <p>{{ product.description }}</p>
      </div>
    </div>
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
    const data: Product[] = await response.json()
    products.value = data
  } catch (error) {
    console.error('Error fetching products:', error)
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
  gap: 24px;
}

.product-item {
  border: 1px solid #f6f6f6;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 0 0px 0 #e0e0e0;
  transition: 0.5s box-shadow cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    box-shadow: 0 0 40px 0 #eee;
  }
}

h3 {
  font-weight: bold;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.product-details {
  margin-top: 10px;
}

.product-price {
  font-weight: bold;
}
</style>
