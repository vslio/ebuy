<template>
  <div @mouseenter="isHovered = true" @mouseleave="isHovered = false" class="product-card">
    <RouterLink class="image-container" :to="`/product/${cartProduct.id}`" :key="cartProduct.id">
      <ProductImage
        :class="isHovered ? 'zoom' : ''"
        :url="cartProduct.image"
        :alt="`Image of product ${cartProduct.name}`"
      />
    </RouterLink>
    <div class="product-info">
      <RouterLink :to="`/product/${cartProduct.id}`" :key="cartProduct.id">
        <h2 data-wavy :class="isHovered ? 'animate' : ''">{{ cartProduct.name }}</h2>
        <h3 class="product-price">€{{ cartProduct.price.toFixed(2) }}</h3>
      </RouterLink>
      <button @click="addToCart" :disabled="cartProduct.stock === 0">
        <CartPlusIcon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/services/api/handlers'
import ProductImage from '@/components/ProductImage.vue'
import CartPlusIcon from '@/components/icons/CartPlusIcon.vue'
import { ref } from 'vue'

const props = defineProps<{
  product: Product
}>()

const isHovered = ref(false)
const cartProduct = ref(props.product)

const addToCart = async () => {
  if (!props.product) return

  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: props.product.id, quantity: 1 })
    })

    if (!response.ok) {
      throw new Error("Couldn't add the product to the cart")
    }

    cartProduct.value = await response.json()
  } catch (err) {
    console.error('Error adding the product to the cart:', err)
  }
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  button {
    align-self: center;
    background-color: transparent;
  }
}

h2,
h3 {
  margin: 0;
  font-weight: 400;
}

.product-price {
  font-family: 'PPNeueMachina';
  font-size: 1.2rem;
}

.image-container {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: skew(0deg) scale(1);
  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform;

  &.zoom {
    .product-card:nth-child(odd) & {
      transform: skew(4deg) scale(1.15);
    }

    .product-card:nth-child(even) & {
      transform: skew(-4deg) scale(1.15);
    }
  }
}
</style>
