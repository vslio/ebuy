<template>
  <div v-if="cart.length > 0">
    <h2 class="text-center">Looks like you did some shopping.</h2>
    <table>
      <thead>
        <tr>
          <th></th>
          <th><h3 class="text-center">Quantity</h3></th>
          <th><h3 class="text-right">Price</h3></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cart" :key="item.product.id" class="cart-item">
          <td>
            <div class="in-row">
              <div data-skew>
                <button @click="removeFromCart(item.product.id)">
                  <DeleteIcon />
                </button>
              </div>
              <RouterLink :to="`/product/${item.product.id}`" class="in-row">
                <ProductImage
                  :url="item.product.image"
                  :alt="`Image of product ${item.product.name}`"
                  class="cart-item-image"
                />
                <h3 data-wavy>{{ item.product.name }}</h3>
              </RouterLink>
            </div>
          </td>
          <td>
            <div class="in-row cart-item-quantity">
              <button @click="decreaseItemQuantity(item.product.id)"><MinusIcon /></button>
              <h3>{{ item.quantity }}</h3>
              <button
                @click="increaseItemQuantity(item.product.id)"
                :disabled="item.product.stock === 0"
              >
                <PlusIcon />
              </button>
            </div>
          </td>
          <td>
            <h3 class="text-right">€{{ (item.product.price * item.quantity).toFixed(2) }}</h3>
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
  </div>
  <div v-else>
    <div class="cart-empty">
      <img src="/icons/lobster.svg" width="60" height="60" />
      <h2>Your cart is empty &hellip;</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductImage from '@/components/ProductImage.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import MinusIcon from '@/components/icons/MinusIcon.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
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

const increaseItemQuantity = async (productId: number) => {
  try {
    const response = await fetch(`/api/cart/${productId}/increase`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Not enough stock')
      } else {
        throw new Error("Couldn't increase the item quantity")
      }
    }

    cart.value = await response.json()
  } catch (err) {
    console.error('Error increasing the product quantity:', err)
  }
}

const decreaseItemQuantity = async (productId: number) => {
  try {
    const response = await fetch(`/api/cart/${productId}/decrease`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error("Couldn't increase the item quantity")
    }

    cart.value = await response.json()
  } catch (err) {
    console.error('Error increasing the product quantity:', err)
  }
}

const removeFromCart = async (productId: number) => {
  try {
    const response = await fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error("Couldn't remove the product from the cart")
    }

    cart.value = await response.json()
  } catch (err) {
    console.error('Error removing the product from the cart:', err)
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

button {
  padding: 0;
  background-color: transparent;
}

.cart-item-image {
  width: 80px;
}

.cart-item-quantity {
  justify-content: center;
}

h1 {
  margin: 0;
}

.cart-total {
  padding-right: 12px;
}

.cart-empty {
  text-align: center;

  h2 {
    margin-top: 0;
  }
}
</style>
