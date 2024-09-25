<script setup lang="ts">
import CartIcon from '@/components/icons/CartIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="in-row">
      <RouterLink to="/" class="logo">👋 e-μπάι</RouterLink>
      <div class="in-row">
        <RouterLink to="/search"><SearchIcon :size="32" /></RouterLink>
        <RouterLink to="/cart"><CartIcon /></RouterLink>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  flex-direction: row;
  justify-content: space-between;
  padding: 24px 0;
}

a {
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1;
  transform: scale(1);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:not(.logo):hover {
    transform: scale(1.15);
  }
}

.in-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  padding: 0;
}
</style>
