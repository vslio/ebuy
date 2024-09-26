import { http, HttpResponse } from 'msw'
import { productsData } from '@/services/api/data'

type ResponseError = { error?: string }

export type Product = {
  id: number
  name: string
  category: string
  price: number
  image: string
  description: string
  stock: number
}

type CartItem = {
  productId: number
  quantity: number
}

export type CartItemWithProduct = {
  product: Product
  quantity: number
}

const products: Product[] = productsData

let cart: CartItem[] = []

function getCartWithProductDetails(): CartItemWithProduct[] {
  return cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)

      if (product) {
        return {
          product,
          quantity: item.quantity
        }
      }

      return undefined
    })
    .filter((item) => item !== undefined)
}

export const handlers = [
  http.get<never, never, Product[] | ResponseError, '/api/products'>('/api/products', () => {
    return HttpResponse.json(products)
  }),

  http.get<{ term: string }, never, Product[] | ResponseError, '/api/products/search/:term'>(
    '/api/products/search/:term',
    ({ params }) => {
      if (!params.term) {
        return HttpResponse.json({ error: 'Search query is required' }, { status: 400 })
      }

      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(params.term.toLowerCase())
      )

      return HttpResponse.json(filteredProducts)
    }
  ),

  http.get<{ id: string }, { id: string }, Product | ResponseError, '/api/products/:id'>(
    '/api/products/:id',
    ({ params }) => {
      const id = Number(params.id)
      const product = products.find((p) => p.id === id)

      if (product) {
        return HttpResponse.json(product)
      } else {
        return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
      }
    }
  ),

  http.get<never, never, CartItemWithProduct[] | ResponseError, '/api/cart'>('/api/cart', () => {
    if (!cart.length) return HttpResponse.json([])

    const cartWithProduct = getCartWithProductDetails()

    return HttpResponse.json(cartWithProduct)
  }),

  http.post<never, CartItem, { message?: string } | ResponseError, '/api/cart'>(
    '/api/cart',
    async ({ request }) => {
      const { productId, quantity } = await request.json()
      const product = products.find((p) => p.id === productId)

      if (!product) {
        return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      if (product.stock < quantity) {
        return HttpResponse.json({ error: 'No stock' }, { status: 400 })
      }

      const existingItem = cart.find((item) => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.push({ productId, quantity })
      }

      product.stock -= quantity

      return HttpResponse.json({ message: 'Product added to cart' })
    }
  ),

  http.put<
    { productId: string },
    CartItem[],
    CartItemWithProduct[] | ResponseError,
    '/api/cart/:productId/increase'
  >('/api/cart/:productId/increase', ({ params }) => {
    const productId = Number(params.productId)
    const item = cart.find((item) => item.productId === productId)
    const product = products.find((p) => p.id === productId)

    if (item && product) {
      if (product.stock > 0) {
        item.quantity += 1
        product.stock -= 1

        return HttpResponse.json(getCartWithProductDetails())
      } else {
        return HttpResponse.json({ error: 'Not enough stock for this product' }, { status: 400 })
      }
    }

    return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
  }),

  http.put<
    { productId: string },
    CartItem[],
    CartItemWithProduct[] | ResponseError,
    '/api/cart/:productId/decrease'
  >('/api/cart/:productId/decrease', ({ params }) => {
    const productId = Number(params.productId)
    const item = cart.find((item) => item.productId === productId)
    const product = products.find((p) => p.id === productId)

    if (item && product) {
      if (item.quantity > 0) {
        item.quantity -= 1
        product.stock += 1

        if (item.quantity === 0) {
          cart = cart.filter((i) => i.productId !== productId)
        }

        return HttpResponse.json(getCartWithProductDetails())
      }
    }

    return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
  }),

  http.delete<
    { productId: string },
    CartItem[],
    CartItemWithProduct[] | ResponseError,
    '/api/cart/:productId'
  >('/api/cart/:productId', ({ params }) => {
    const productId = Number(params.productId)
    const item = cart.find((item) => item.productId === productId)
    const product = products.find((p) => p.id === productId)

    if (item && product) {
      product.stock += item.quantity
      cart = cart.filter((i) => i.productId !== productId)

      return HttpResponse.json(getCartWithProductDetails())
    }

    return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
  })
]
