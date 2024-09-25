<template>
  <div v-if="product" class="product-detail">
    <img :src="`${product.image}/600/600`" :alt="product.name" class="product-image" />
    <div class="product-info">
      <div>
        <h1>{{ product.name }}</h1>
        <h2>€{{ product.price.toFixed(2) }}</h2>
      </div>
      <button @click="addToCart" :disabled="product.stock === 0">
        {{ product.stock > 0 ? 'Add to cart' : 'Out of stock' }}
      </button>
      <p>{{ product.description }}</p>
    </div>
  </div>
  <div v-else-if="error" class="error">
    <router-link to="/" replace class="error-link">← View our products</router-link>
    {{ error }}
  </div>
  <div v-else class="loading">Add a loading element here</div>
</template>

<script setup lang="ts">
import type { Product } from '@/services/api/handlers'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref<Product | null>(null)
const error = ref<string | null>(null)

const fetchProduct = async () => {
  const productId = route.params.id
  try {
    const response = await fetch(`/api/products/${productId}`)

    if (!response.ok) {
      throw new Error('Failed to fetch product')
    }

    product.value = await response.json()
  } catch (err) {
    error.value = 'Something went wrong. Please try again later.'
    console.error('Error fetching product ->', err)
  }
}

const addToCart = async () => {
  if (!product.value) return

  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: product.value.id, quantity: 1 })
    })

    if (!response.ok) {
      throw new Error("Couldn't add the product to the cart")
    }

    // show success toast or animate future cart icon here

    if (product.value) {
      product.value.stock -= 1
    }
  } catch (err) {
    // show error toast for UX
    console.error('Error adding the product to the cart:', err)
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

h1 {
  margin: 0;
  font-size: 4em;
  font-weight: 700;
}

h2 {
  margin: 0;
  font-size: 2.5em;
  font-weight: 500;
  line-height: 1;
}

button {
  align-self: flex-start;
  padding: 8px 24px;
  font-size: 2rem;
}

p {
  margin-top: 0;
}

img {
  width: 100%;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.error,
.loading {
  display: flex;
  flex-direction: column;
  font-size: 1.2rem;
}

.error-link {
  font-size: 1rem;
  font-weight: 600;
}
</style>
