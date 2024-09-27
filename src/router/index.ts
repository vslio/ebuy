import { createRouter, createWebHistory, type RouteLocation } from 'vue-router'
import ProductsView from '@/views/ProductsView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import CartView from '@/views/CartView.vue'
import SearchView from '@/views/SearchView.vue'

function addDefaultQueryParam(to: RouteLocation) {
  if (!Object.keys(to.query).length) {
    return {
      path: to.path,
      query: {
        page: 1
      }
    }
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ProductsView,
      beforeEnter: [addDefaultQueryParam]
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductDetailView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/search/:term?',
      name: 'search',
      component: SearchView
    }
  ]
})

export default router
