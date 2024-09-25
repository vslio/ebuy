<template>
  <div :class="`search-container ${isFocussed ? 'focussed' : ''}`">
    <input
      v-model="searchQuery"
      @keyup.enter="performSearch"
      @focusin="isFocussed = true"
      @focusout="isFocussed = false"
      type="text"
      placeholder="What do you seek?"
      ref="searchInput"
    />
    <button @click="performSearch"><SearchIcon :size="24" /></button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchIcon from '@/components/icons/SearchIcon.vue'

const router = useRouter()
const isFocussed = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { term: searchQuery.value }
    })
  }

  searchQuery.value = ''
  searchInput.value?.blur()
}
</script>

<style scoped>
.search-container {
  display: flex;
  padding: 4px 0;
  border-bottom: 3px solid #000;
}

.search-input-container {
  display: flex;
}

button {
  padding: 0;
  background-color: transparent;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);

  .focussed & {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
