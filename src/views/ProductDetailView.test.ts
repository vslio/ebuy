import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductDetailView from '@/views/ProductDetailView.vue'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { routes } from '@/router'
import { setupServer } from 'msw/node'
import { handlers } from '@/services/api/handlers'
import { flushPromises } from '@vue/test-utils'

const server = setupServer(...handlers)
let router: Router

beforeAll(() => {
  server.listen()

  router = createRouter({
    history: createWebHistory(),
    routes
  })
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('Product Detail View', () => {
  it('renders the product details', async () => {
    router.push('/product/1')

    await router.isReady()

    const wrapper = mount(ProductDetailView, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.find('[data-test-add-to-cart-button]')).toBeDefined()
  })

  it('displays the error element if the product is not found', async () => {
    router.push('/product/10000')

    await router.isReady()

    const wrapper = mount(ProductDetailView, {
      global: {
        plugins: [router]
      }
    })

    await router.isReady()
    await flushPromises()

    expect(wrapper.find('.product-detail [data-test-error]')).toBeDefined()
  })
})
