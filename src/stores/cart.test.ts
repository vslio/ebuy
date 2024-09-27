import { useCartStore } from '@/stores/cart'
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Store: Cart', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const cart = useCartStore()

    expect(cart.count).toBe(0)
    cart.increment()
    expect(cart.count).toBe(1)
  })

  it('increments by amount', () => {
    const counter = useCartStore()

    counter.increment(100)
    expect(counter.count).toBe(100)
  })

  it('decrements', () => {
    const cart = useCartStore()

    cart.count = 1

    cart.decrement()
    expect(cart.count).toBe(0)
  })

  it('decrements by amount', () => {
    const cart = useCartStore()

    cart.count = 100
    cart.decrement(99)
    expect(cart.count).toBe(1)
  })
})
