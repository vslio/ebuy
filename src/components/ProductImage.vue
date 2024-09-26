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
