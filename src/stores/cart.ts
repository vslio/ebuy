import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('counter', () => {
  const count = ref(0)

  function increment(quantity = 1) {
    count.value = count.value + quantity
  }

  function decrement(quantity = 1) {
    count.value = count.value - quantity
  }

  return {
    count,
    increment,
    decrement
  }
})
