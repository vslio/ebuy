import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { routes } from '@/router'
import { setupServer } from 'msw/node'
import { handlers } from '@/services/api/handlers'
import { flushPromises } from '@vue/test-utils'
import CartView from '@/views/CartView.vue'
import { createPinia, setActivePinia } from 'pinia'

const server = setupServer(...handlers)
let router: Router

beforeAll(async () => {
  server.listen()
  setActivePinia(createPinia())

  router = createRouter({
    history: createWebHistory(),
    routes
  })

  await fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId: 2, quantity: 2 })
  })
})

afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

describe('View: Cart View', () => {
  it('renders the cart with items', async () => {
    await router.push('/cart')
    await router.isReady()

    const wrapper = mount(CartView, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.find('.cart-total').exists()).toBe(true)
  })

  it('increments the quantity of a cart item', async () => {
    await router.push('/cart')
    await router.isReady()

    const wrapper = mount(CartView, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    await wrapper.find('[data-test-cart-item-increment]').trigger('click')

    await flushPromises()

    expect(wrapper.find('[data-test-cart-item-quantity]').text()).toBe('3')
  })

  it('decrements the quantity of a cart item', async () => {
    await router.push('/cart')
    await router.isReady()

    const wrapper = mount(CartView, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    await wrapper.find('[data-test-cart-item-decrement]').trigger('click')

    await flushPromises()

    expect(wrapper.find('[data-test-cart-item-quantity]').text()).toBe('2')
  })
})
