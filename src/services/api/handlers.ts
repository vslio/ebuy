import { http, HttpResponse } from 'msw'
import { productsData } from '@/services/api/data'

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current: number
    total: number
  }
}

type ResponseError = { error?: string }

export type Categories = 'all' | 't-shirts' | 'tea-towels' | 'caps'

export type Product = {
  id: number
  name: string
  category: string
  price: number
  image: string
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
  http.get<never, never, PaginatedResponse<Product> | ResponseError, '/api/products'>(
    '/api/products',
    ({ request }) => {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page') || '1')
      const category = url.searchParams.get('category')

      const productsPerPage = 10
      const startIndex = (page - 1) * productsPerPage
      const endIndex = startIndex + productsPerPage

      const filteredProducts =
        category === 'all' ? products : products.filter((p) => p.category === category)

      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

      const total = Math.ceil(filteredProducts.length / productsPerPage)

      if (page > total) {
        return HttpResponse.json({ error: 'Not enough pages for you, innit?' }, { status: 400 })
      }

      const response: PaginatedResponse<Product> = {
        data: paginatedProducts,
        pagination: {
          current: page,
          total
        }
      }
      return HttpResponse.json(response)
    }
  ),

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

  http.post<never, CartItem, Product | ResponseError, '/api/cart'>(
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

      return HttpResponse.json(product)
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
