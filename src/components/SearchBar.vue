<template>
  <div data-wavy :class="`search-bar ${isFocussed ? 'is-focussed animate' : ''}`">
    <input
      v-model="searchQuery"
      @keyup.enter="performSearch"
      @keyup.esc="clear"
      @focusin="isFocussed = true"
      @focusout="isFocussed = false"
      type="text"
      placeholder="Seek what you must"
      ref="searchInput"
    />
    <button @click="performSearch"><SearchIcon :size="16" /></button>
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

const clear = () => {
  searchQuery.value = ''
  searchInput.value?.blur()
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      params: {
        term: searchQuery.value
      }
    })
  }

  clear()
}
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-self: center;
  padding: 4px 0;
  border-bottom: 3px solid var(--color-text);
  transition: all 0.6s var(--cubic-bezier);

  svg {
    @media (min-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }

  &.is-focussed,
  &:hover {
    border-color: transparent;
  }
}

input {
  font-family: 'PPNeueMachina';
  font-weight: 900;

  &::placeholder {
    color: var(--color-text);
  }
}

button {
  padding: 0;
  background-color: transparent;
}
</style>
