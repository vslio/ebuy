<template>
  <div v-if="product" class="product-detail">
    <ProductImage :url="product.image" :alt="`Image of product ${product.name}`" />
    <div class="product-info">
      <header>
        <nav class="in-row">
          <RouterLink to="/?category=all&page=1"><h3 data-wavy>Home</h3></RouterLink>
          <h3>→</h3>
          <h3>{{ product.name }}</h3>
        </nav>
      </header>
      <div>
        <h1>{{ product.name }}</h1>
        <h2>€{{ product.price.toFixed(2) }}</h2>
      </div>
      <button data-test-add-to-cart-button @click="addToCart" :disabled="product.stock === 0">
        {{ product.stock > 0 ? 'Add to cart' : 'Out of stock' }}
      </button>
    </div>
  </div>
  <div v-else-if="error" data-test-error class="error">
    <div>
      <img src="/icons/angry.svg" width="60" height="60" />
      <h4>{{ error }}</h4>
    </div>
    <RouterLink to="/?category=all&page=1" replace class="error-link">
      <h3 data-wavy class="animate">Maybe go browse the rest of our products</h3>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import ProductImage from '@/components/ProductImage.vue'
import type { ResponseWithoutPagination, Product } from '@/services/api/handlers'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref<Product | null>(null)
const error = ref<string | null>(null)

const fetchProduct = async () => {
  const productId = route.params.id
  try {
    const response = await fetch(`/api/product/${productId}`)

    if (!response.ok) {
      throw new Error('Failed to fetch product')
    }

    const { data } = (await response.json()) as ResponseWithoutPagination<Product>

    product.value = data
  } catch (err) {
    error.value = "We couldn't fint the product you were looking for."
    console.error('Error fetching product', err)
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

    if (product.value) {
      product.value.stock -= 1
    }
  } catch (err) {
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

button {
  align-self: flex-start;
  padding: 8px 24px;
  font-size: 2rem;
}

img {
  width: 100%;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  font-size: 1.2rem;

  span {
    font-family: 'PPNeueMachina';
    font-weight: 900;
  }
}
</style>
