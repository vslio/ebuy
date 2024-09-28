<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path d="M20 12H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup lang="ts">
type Props = {
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 32
})
</script>

<style scoped>
path {
  stroke: var(--color-button);
}
</style>
