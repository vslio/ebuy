<template>
  <header>
    <nav>
      <RouterLink to="/?page=1" class="logo">
        <img src="/icons/ebuy.svg" width="44" height="44" />
        <h3>e-μπάι</h3>
      </RouterLink>
      <SearchBar class="search-bar" />
      <RouterLink class="cart-icon" to="/cart"><CartIcon /></RouterLink>
    </nav>
  </header>

  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="`${route.path}${route.query?.page}`" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import CartIcon from '@/components/icons/CartIcon.vue'
import SearchBar from '@/components/SearchBar.vue'
</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  background-color: var(--color-background);
  z-index: 1;
}

nav {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 24px 0;
  margin-bottom: 12px;
}

.logo {
  display: flex;
  gap: 12px;
  padding: 0;
  font-size: 2rem;
  line-height: 1;

  &:hover {
    h3 {
      font-variation-settings: 'wght' 700;
    }
  }
}

h3 {
  font-family: 'Syne';
  font-variation-settings: 'wght' 800;
  transition: font-variation-settings 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.search-bar {
  justify-self: center;
}

.cart-icon {
  display: flex;
  justify-self: flex-end;
  align-items: center;
  transform: scale(1);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    transform: scale(1.15);
  }
}
</style>
