import { setupServer } from 'msw/node'
import {
  API_ERROR_PAGE_NOT_FOUND,
  API_ERROR_PRODUCT_ID_REQUIRED,
  API_ERROR_PRODUCT_NOT_FOUND,
  API_ERROR_PRODUCT_NOT_IN_STOCK,
  API_ERROR_SEARCH_QUERY_REQUIRED,
  handlers,
  type CartItemWithProduct,
  type Product,
  type ResponseError,
  type ResponseWithoutPagination,
  type ResponseWithPagination
} from './handlers'
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { productsData } from '@/services/api/data'

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen()
  setActivePinia(createPinia())
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('API: Product List', () => {
  it('Returns many products with pagination', async () => {
    const response = await fetch('/api/products?page=1&category=all')
    const data = (await response.json()) as ResponseWithPagination<Product[]>

    expect(response.status).toBe(200)
    expect(data.pagination.current).toBe(1)
    expect(data.pagination.total).toBeGreaterThan(0)
    expect(data.data.length).toBeGreaterThan(0)
  })

  it('Returns an error when the requested page exceeds the total pages', async () => {
    const response = await fetch('/api/products?page=999&category=all')
    const { error } = (await response.json()) as ResponseError

    expect(response.status).toBe(404)
    expect(error).toBe(API_ERROR_PAGE_NOT_FOUND)
  })
})

describe('API: Product Search', () => {
  it('Returns many products', async () => {
    const response = await fetch('/api/products/search/cat')
    const data = (await response.json()) as ResponseWithPagination<Product[]>

    expect(response.status).toBe(200)
    expect(data.data.length).toBeGreaterThan(0)
  })

  it('Returns an error when no search term is provided', async () => {
    const response = await fetch('/api/products/search/')
    const { error } = (await response.json()) as ResponseError

    expect(response.status).toBe(400)
    expect(error).toBe(API_ERROR_SEARCH_QUERY_REQUIRED)
  })
})

describe('API: Single product', () => {
  it('Returns a product', async () => {
    const response = await fetch('/api/product/1')
    const data = (await response.json()) as ResponseWithoutPagination<Product>

    expect(response.status).toBe(200)
    expect(data.data.id).toBeDefined()
  })

  it('Returns an error when no product id is provided', async () => {
    const response = await fetch('/api/product/')
    const { error } = (await response.json()) as ResponseError

    expect(response.status).toBe(400)
    expect(error).toBe(API_ERROR_PRODUCT_ID_REQUIRED)
  })

  it('Returns an error when the product is not found', async () => {
    const response = await fetch('/api/product/1000')
    const { error } = (await response.json()) as ResponseError

    expect(response.status).toBe(404)
    expect(error).toBe(API_ERROR_PRODUCT_NOT_FOUND)
  })
})

describe('API: Cart', () => {
  it('Add: adds a product to the cart and updates its stock', async () => {
    const requestBody = {
      productId: 1,
      quantity: 1
    }

    const originalProduct = {
      ...productsData.find((p) => p.id === requestBody.productId)!
    }

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const { data } = (await response.json()) as ResponseWithoutPagination<Product>

    expect(response.status).toBe(200)
    expect(data.id).toBe(1)
    expect(data.stock).toBe(originalProduct.stock - 1)

    await fetch(`/api/cart/${requestBody.productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('Add: returns an error when the product is not found', async () => {
    const requestBody = { productId: 999, quantity: 1 }

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const data = (await response.json()) as ResponseError
    expect(response.status).toBe(404)
    expect(data.error).toBe(API_ERROR_PRODUCT_NOT_FOUND)
  })

  it('Add: returns an error when product is out of stock', async () => {
    const requestBody = { productId: 1, quantity: 1000 }

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })

    const data = (await response.json()) as ResponseError

    expect(response.status).toBe(400)
    expect(data.error).toBe(API_ERROR_PRODUCT_NOT_IN_STOCK)
  })

  it('Add: if the item exists, increment its quantity and updates its stock', async () => {
    const requestBody = { productId: 1, quantity: 1 }

    const originalProduct = {
      ...productsData.find((p) => p.id === requestBody.productId)!
    }

    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })

    const response = await fetch('/api/cart')
    const { data } = (await response.json()) as ResponseWithoutPagination<CartItemWithProduct[]>

    const item = data.find((i) => i.product.id === requestBody.productId)

    expect(response.status).toBe(200)
    expect(item).toBeDefined()
    expect(item!.quantity).toBe(2)
    expect(item?.product.stock).toBe(originalProduct.stock - item!.quantity)

    await fetch(`/api/cart/${requestBody.productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('Add: if the item exists, increment its quantity but fail', async () => {
    const requestBody = { productId: 1, quantity: 2 }

    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const incrementResponse = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })

    const { error } = (await incrementResponse.json()) as ResponseError

    expect(incrementResponse.status).toBe(400)
    expect(error).toBe(API_ERROR_PRODUCT_NOT_IN_STOCK)

    await fetch(`/api/cart/${requestBody.productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('Increase: updates the quantity of a cart item and its stock', async () => {
    const originalProduct = {
      ...productsData.find((p) => p.id === 1)!
    }

    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: 1,
        quantity: 1
      })
    })

    const response = await fetch('/api/cart/1/increase', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const { data } = (await response.json()) as ResponseWithoutPagination<CartItemWithProduct[]>

    const item = data.find((i) => i.product.id === 1)

    expect(response.status).toBe(200)
    expect(item).toBeDefined()
    expect(item!.product.id).toBe(1)
    expect(item!.product.stock).toBe(originalProduct.stock - 2)

    await fetch('/api/cart/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('Decrease: updates the quantity of a cart item and its stock', async () => {
    const originalProduct = {
      ...productsData.find((p) => p.id === 1)!
    }

    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: 1,
        quantity: 2
      })
    })

    const response = await fetch('/api/cart/1/decrease', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const { data } = (await response.json()) as ResponseWithoutPagination<CartItemWithProduct[]>

    const item = data.find((i) => i.product.id === 1)

    expect(response.status).toBe(200)
    expect(item).toBeDefined()
    expect(item!.product.id).toBe(1)
    expect(item!.product.stock).toBe(originalProduct.stock - 1)

    await fetch('/api/cart/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('Decrease: if quantity is back to 0, remove the item and update its stock', async () => {
    const originalProduct = {
      ...productsData.find((p) => p.id === 1)!
    }

    const addResponse = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: 1,
        quantity: 1
      })
    })

    const { data: addedProduct } = (await addResponse.json()) as ResponseWithoutPagination<Product>

    const decreaseResponse = await fetch(`/api/cart/1/decrease`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const { data } = (await decreaseResponse.json()) as ResponseWithoutPagination<
      CartItemWithProduct[]
    >

    const item = data.find((i) => i.product.id === 1)

    expect(decreaseResponse.status).toBe(200)
    expect(item).toBeUndefined()
    expect(addedProduct.stock).toBe(originalProduct.stock - 1)

    await fetch('/api/cart/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('Delete: removes a product from the cart and updates its stock', async () => {
    const addResponse = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: 1,
        quantity: 2
      })
    })

    const addResponseJson = (await addResponse.json()) as ResponseWithoutPagination<Product>
    expect(addResponseJson.data.id).toBe(1)

    await fetch('/api/cart/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const cartResponse = await fetch('/api/cart')
    const { data } = await cartResponse.json()

    expect(data.length).toBe(0)
  })

  it("Delete: returns an error when the productId doesn't exist", async () => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: 1,
        quantity: 1
      })
    })

    const deleteResponse = await fetch('/api/cart/100', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const { error } = (await deleteResponse.json()) as ResponseError

    expect(deleteResponse.status).toBe(404)
    expect(error).toBe(API_ERROR_PRODUCT_NOT_FOUND)

    await fetch('/api/cart/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
})
