<template>
  <template v-if="cart.length > 0">
    <h1>Your cart</h1>
    <table>
      <thead>
        <tr>
          <th></th>
          <th class="text-center"><h3>Quantity</h3></th>
          <th class="text-right"><h3>Price</h3></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cart" :key="item.product.id" class="cart-item">
          <td>
            <RouterLink :to="`/product/${item.product.id}`" class="product-info">
              <img :src="`${item.product.image}/100/100`" :alt="item.product.name" />
              <h3>{{ item.product.name }}</h3>
            </RouterLink>
          </td>
          <td class="text-center">
            <h3>{{ item.quantity }}</h3>
          </td>
          <td class="text-right">
            <h3>€{{ (item.product.price * item.quantity).toFixed(2) }}</h3>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="cart-total">
      <h2 class="text-right">
        Total: €{{
          cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)
        }}
      </h2>
    </div>
  </template>
  <template v-else>
    <div class="cart-empty">
      <span class="emoji">😢</span>
      <h2>Your cart is empty &hellip;</h2>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { CartItemWithProduct } from '@/services/api/handlers'
import { ref, onMounted } from 'vue'

const cart = ref<CartItemWithProduct[]>([])

const fetchCart = async () => {
  try {
    const response = await fetch('/api/cart')

    if (!response.ok) {
      throw new Error('Failed to fetch cart')
    }

    cart.value = await response.json()
  } catch (error) {
    console.error('Error fetching cart ->', error)
  }
}

onMounted(() => {
  fetchCart()
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  border-bottom: 4px solid var(--color-text);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

h1 {
  margin: 0;
  font-size: 3rem;
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.5rem;
}

.cart-empty {
  text-align: center;

  h2 {
    margin-top: 0;
  }
}

.emoji {
  font-size: 3rem;
}
</style>
