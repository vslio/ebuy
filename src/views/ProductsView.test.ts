import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ProductsView from '@/views/ProductsView.vue'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { setupServer } from 'msw/node'
import { handlers } from '@/services/api/handlers'
import { routes } from '@/router'

const server = setupServer(...handlers)

beforeAll(() => {
  vi.stubGlobal('scrollTo', vi.fn())
  server.listen()
  setActivePinia(createPinia())
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe('Products View', () => {
  let router: Router

  beforeAll(() => {
    router = createRouter({
      history: createWebHistory(),
      routes
    })
  })

  it('Navigates previous and next pages correctly', async () => {
    const wrapper = mount(ProductsView, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.find('[data-test-current-page]').text()).toBe('Page 1 of 4') // MSW response has pagination info

    await wrapper.find('[data-test-button-next]').trigger('click')

    await flushPromises()

    expect(wrapper.find('[data-test-current-page]').text()).toBe('Page 2 of 4')

    const productCards = wrapper.findAll('.product-card')
    expect(productCards.length).toBeGreaterThan(0)
  })
})
