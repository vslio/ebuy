<template>
  <header>
    <nav>
      <RouterLink to="/" class="logo"
        ><h3><span class="emoji">👋</span> e-μπάι</h3></RouterLink
      >
      <SearchBar class="search-bar" />
      <RouterLink class="cart-icon" to="/cart"><CartIcon /></RouterLink>
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 24px 0;
  margin-bottom: 12px;
}

.logo {
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
  margin: 0;
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
