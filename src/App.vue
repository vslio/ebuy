<template>
  <header>
    <nav>
      <RouterLink to="/?category=all&page=1" class="logo">
        <img src="/icons/ebuy.svg" width="44" height="44" />
        <h3>e-μπάι</h3>
      </RouterLink>
      <SearchBar class="search-bar" />
      <RouterLink
        :class="['cart-container', { animate: animateCart }]"
        to="/cart"
        @animationend="animateCart = false"
      >
        <h4 data-test-cart-item-count>{{ cartStore.count }}</h4>
        <span>
          <CartIcon />
        </span>
      </RouterLink>
    </nav>
  </header>

  <RouterView v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in">
      <Component
        :is="Component"
        :key="`${route.path}${route.query?.page}${route.query?.category}`"
      />
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
import CartIcon from '@/components/icons/CartIcon.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useCartStore } from '@/stores/cart'
import { ref, watch } from 'vue'

const cartStore = useCartStore()

const animateCart = ref(false)

watch(
  () => cartStore.count,
  () => {
    animateCart.value = true
  }
)
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

.cart-container {
  display: flex;
  justify-self: flex-end;
  align-items: center;
  gap: 8px;
  transform: scale(1);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &.animate {
    animation: skew-scale 0.5s ease-in-out;
  }

  &:hover {
    transform: scale(1.15);
  }
}
</style>
