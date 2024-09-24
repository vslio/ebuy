<template>
  <div class="product-list">
    <div v-for="product in products" :key="product.id" class="product-item">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div class="product-details">
        <h2 class="product-name">{{ product.name }}</h2>
        <p class="product-price">${{ product.price.toFixed(2) }}</p>
        <p class="product-description">{{ product.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
}

const products = ref<Product[]>([
  {
    id: 1,
    name: 'Product 1',
    price: 15,
    image: 'https://picsum.photos/300/200',
    description: "This is a random text. Totally the best description text you've never seen."
  },
  {
    id: 2,
    name: 'Product 2',
    price: 30,
    image: 'https://picsum.photos/300/200',
    description: 'This is another random text, used for description.'
  },
  {
    id: 3,
    name: 'Product 3',
    price: 100,
    image: 'https://picsum.photos/300/200',
    description: "I'm really smashing it with the descriptions here."
  },
  {
    id: 4,
    name: 'Product 4',
    price: 1000,
    image: 'https://picsum.photos/300/200',
    description: "I'm really running out of ideas."
  },
  {
    id: 5,
    name: 'Product 5',
    price: 1000,
    image: 'https://picsum.photos/300/200',
    description:
      "Use your imagination. Imagine that this is a decent description. It's not, but just try!"
  }
])
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

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.product-details {
  margin-top: 10px;
}

.product-name {
  font-size: 1.2em;
  margin: 0 0 5px 0;
}

.product-price {
  font-weight: bold;
  color: #4caf50;
}

.product-description {
  font-size: 0.9em;
  color: #666;
}
</style>
