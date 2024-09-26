<template>
  <img :src="getImagePath()" :alt="alt" />
</template>

<script setup lang="ts">
const props = defineProps<{
  url: string
  alt: string
}>()

function getImagePath() {
  return new URL(`../assets/images/products/${props.url}`, import.meta.url).href
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
  flex-direction: column;
  align-items: flex-start;
}

h2,
h3 {
  margin: 0;
}

h2 {
  font-size: 1.6rem;
}

.product-price {
  font-family: 'PPNeueMachina';
  font-size: 1.2rem;
}

img {
  width: 100%;
}
</style>
