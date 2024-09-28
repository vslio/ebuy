<template>
  <header>
    <nav>
      <RouterLink to="/?category=all&page=1" class="logo-container">
        <img src="/icons/ebuy.svg" />
        <h3>e-μπάι</h3>
      </RouterLink>
      <SearchBar class="search-bar" />
      <RouterLink
        :class="['cart-container', { animate: animateCart }]"
        to="/cart"
        @animationend="animateCart = false"
      >
        <h4 data-test-cart-item-count>{{ cartStore.count || '' }}</h4>
        <span>
          <CartIcon :size="28" />
        </span>
      </RouterLink>
    </nav>
  </header>

  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <Component :is="Component" />
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
  padding: 12px 0;
  background-color: var(--color-background);
  z-index: 1;
}

nav {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

h3 {
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
}

.logo-container {
  display: flex;
  gap: 12px;
  padding: 0;
  font-size: 2rem;
  line-height: 1;

  img {
    width: 28px;
    height: 28px;

    @media (min-width: 768px) {
      width: 44px;
      height: 44px;
    }
  }

  &:hover {
    h3 {
      font-variation-settings: 'wght' 700;
    }
  }
}

h3 {
  font-family: 'Syne';
  font-variation-settings: 'wght' 800;
  transition: font-variation-settings 0.4s var(--cubic-bezier);
}

.cart-container {
  display: flex;
  justify-self: flex-end;
  align-items: center;
  gap: 8px;
  transform: scale(1);
  transition: transform 0.4s var(--cubic-bezier);

  svg {
    @media (min-width: 768px) {
      width: 28px;
      height: 28px;
    }
  }

  &.animate {
    animation: skew-scale 0.5s ease-in-out;
  }

  &:active {
    transform: scale(0.9);
  }
}
</style>
