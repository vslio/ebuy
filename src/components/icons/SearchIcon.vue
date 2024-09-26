<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      class="stroke-color"
      d="M17.5 17.5 22 22M20 11a9 9 0 1 0-18 0 9 9 0 0 0 18 0Z"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
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
