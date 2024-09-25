<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="m19.5 5.5-.886 14.621A2 2 0 0 1 16.617 22H7.383a2 2 0 0 1-1.996-1.879L4.5 5.5M3 5.5h5m13 0h-5m0 0-1.24-2.894A1 1 0 0 0 13.84 2h-3.68a1 1 0 0 0-.92.606L8 5.5m8 0H8M9.5 16.5v-6M14.5 16.5v-6"
      stroke="#2c3e50"
      stroke-width="2"
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
