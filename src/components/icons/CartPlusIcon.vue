<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M13 21h-2.068c-2.75 0-4.126 0-5.08-.76-1.301-1.046-1.39-3.167-1.651-4.652l-.593-3.375a1.93 1.93 0 0 0-1.09-1.4.484.484 0 0 1-.27-.335c-.17-.807-.622-1.931.39-2.377C2.867 8 3.18 8 3.804 8H7.5m4 0h8.696c.625 0 .937 0 1.166.1 1.012.447.56 1.57.39 2.378a.484.484 0 0 1-.27.335 1.988 1.988 0 0 0-.802.687M15 17.5h7M18.5 21v-7M6.5 11 10 3m5 0 2.5 5"
      class="stroke-color"
      stroke-width="2"
      stroke-linecap="round"
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
