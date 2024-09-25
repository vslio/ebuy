<template>
  <header>
    <nav class="in-row">
      <RouterLink to="/" class="logo">👋 e-μπάι</RouterLink>
      <SearchBar />
      <RouterLink to="/cart"><CartIcon /></RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import CartIcon from '@/components/icons/CartIcon.vue'
import SearchBar from '@/components/SearchBar.vue'
</script>

<style scoped>
nav {
  flex-direction: row;
  justify-content: space-between;
  padding: 24px 0;
}

a {
  display: flex;
  align-items: center;
}

a:not(.logo) {
  transform: scale(1);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:not(.logo):hover {
    transform: scale(1.15);
  }
}

.logo {
  padding: 0;
  font-weight: 700;
  font-size: 2rem;
  line-height: 1;
}
</style>
