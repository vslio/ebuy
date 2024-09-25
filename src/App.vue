<script setup lang="ts">
import CartIcon from '@/components/icons/CartIcon.vue'
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">👋 e-μπάι</RouterLink>
      <RouterLink to="/cart"><CartIcon /></RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  padding: 24px 0;
}

a {
  font-weight: 700;
  padding: 0 12px;
  font-size: 1.5rem;
  line-height: 1;

  &:first-child {
    padding-left: 0;
  }
}
</style>
