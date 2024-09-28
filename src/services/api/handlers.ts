import { http, HttpResponse } from 'msw'
import { productsData } from '@/services/api/data'
import { useCartStore } from '@/stores/cart'

export const API_ERROR_PAGE_NOT_FOUND = 'Not enough pages for you, innit?'
export const API_ERROR_PRODUCT_ID_REQUIRED = 'Need a product id mate'
export const API_ERROR_PRODUCT_NOT_FOUND = 'Product not found'
export const API_ERROR_PRODUCT_NOT_IN_STOCK = 'No stock'
export const API_ERROR_SEARCH_QUERY_REQUIRED = 'Search query is required'

export type ResponseWithPagination<T> = {
  data: T
  pagination: {
    current: number
    total: number
  }
}

export type ResponseWithoutPagination<T> = {
  data: T
}

export type ResponseError = { error?: string }

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
  return cart.reduce((acc: CartItemWithProduct[], item) => {
    const product = products.find((p) => p.id === item.productId)

    if (product) {
      acc.push({
        product,
        quantity: item.quantity
      })
    }

    return acc
  }, [])
}

export const handlers = [
  http.get<never, never, ResponseWithPagination<Product[]> | ResponseError, '/api/products'>(
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
        return HttpResponse.json({ error: API_ERROR_PAGE_NOT_FOUND }, { status: 404 })
      }

      const response = {
        data: paginatedProducts,
        pagination: {
          current: page,
          total
        }
      }
      return HttpResponse.json(response)
    }
  ),

  http.get<
    { term: string },
    never,
    ResponseWithoutPagination<Product[]> | ResponseError,
    '/api/products/search/:term?'
  >('/api/products/search/:term?', ({ params }) => {
    if (!params.term) {
      return HttpResponse.json({ error: API_ERROR_SEARCH_QUERY_REQUIRED }, { status: 400 })
    }

    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(params.term.toLowerCase())
    )

    return HttpResponse.json({
      data: filteredProducts
    })
  }),

  http.get<
    { id: string },
    { id: string },
    ResponseWithoutPagination<Product> | ResponseError,
    '/api/product/:id?'
  >('/api/product/:id?', ({ params }) => {
    if (!params.id) {
      return HttpResponse.json({ error: API_ERROR_PRODUCT_ID_REQUIRED }, { status: 400 })
    }

    const id = Number(params.id)
    const product = products.find((p) => p.id === id)

    if (product) {
      return HttpResponse.json({
        data: product
      })
    } else {
      return HttpResponse.json({ error: API_ERROR_PRODUCT_NOT_FOUND }, { status: 404 })
    }
  }),

  http.get<
    never,
    never,
    ResponseWithoutPagination<CartItemWithProduct[]> | ResponseError,
    '/api/cart'
  >('/api/cart', () => {
    if (!cart.length) return HttpResponse.json({ data: [] })

    const cartWithProduct = getCartWithProductDetails()

    return HttpResponse.json({
      data: cartWithProduct
    })
  }),

  http.post<never, CartItem, ResponseWithoutPagination<Product> | ResponseError, '/api/cart'>(
    '/api/cart',
    async ({ request }) => {
      const cartStore = useCartStore()
      const { productId, quantity } = await request.json()
      const product = products.find((p) => p.id === productId)

      if (!product) {
        return HttpResponse.json({ error: API_ERROR_PRODUCT_NOT_FOUND }, { status: 404 })
      }

      if (product.stock < quantity) {
        return HttpResponse.json({ error: API_ERROR_PRODUCT_NOT_IN_STOCK }, { status: 400 })
      }

      const existingItem = cart.find((item) => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.push({ productId, quantity })
      }

      cartStore.increment(quantity)

      product.stock -= quantity

      return HttpResponse.json({
        data: product
      })
    }
  ),

  http.put<
    { productId: string },
    CartItem[],
    ResponseWithoutPagination<CartItemWithProduct[]> | ResponseError,
    '/api/cart/:productId/increase'
  >('/api/cart/:productId/increase', ({ params }) => {
    const cartStore = useCartStore()
    const productId = Number(params.productId)
    const item = cart.find((item) => item.productId === productId)
    const product = products.find((p) => p.id === productId)

    if (item && product) {
      if (product.stock > 0) {
        item.quantity += 1
        product.stock -= 1

        cartStore.increment()

        return HttpResponse.json({
          data: getCartWithProductDetails()
        })
      } else {
        return HttpResponse.json({ error: API_ERROR_PRODUCT_NOT_IN_STOCK }, { status: 400 })
      }
    }

    return HttpResponse.json({ error: API_ERROR_PRODUCT_NOT_FOUND }, { status: 404 })
  }),

  http.put<
    { productId: string },
    CartItem[],
    ResponseWithoutPagination<CartItemWithProduct[]> | ResponseError,
    '/api/cart/:productId/decrease'
  >('/api/cart/:productId/decrease', ({ params }) => {
    const cartStore = useCartStore()
    const productId = Number(params.productId)
    const item = cart.find((item) => item.productId === productId)
    const product = products.find((p) => p.id === productId)

    if (item && product) {
      if (item.quantity > 0) {
        item.quantity -= 1
        product.stock += 1

        cartStore.decrement()

        if (item.quantity === 0) {
          cart = cart.filter((i) => i.productId !== productId)
        }

        return HttpResponse.json({
          data: getCartWithProductDetails()
        })
      }
    }

    return HttpResponse.json({ error: API_ERROR_PRODUCT_NOT_FOUND }, { status: 404 })
  }),

  http.delete<
    { productId: string },
    CartItem[],
    ResponseWithoutPagination<CartItemWithProduct[]> | ResponseError,
    '/api/cart/:productId'
  >('/api/cart/:productId', ({ params }) => {
    const cartStore = useCartStore()
    const productId = Number(params.productId)
    const item = cart.find((item) => item.productId === productId)
    const product = products.find((p) => p.id === productId)

    if (item && product) {
      product.stock += item.quantity
      cart = cart.filter((i) => i.productId !== productId)

      cartStore.decrement(item.quantity)

      return HttpResponse.json({
        data: getCartWithProductDetails()
      })
    }

    return HttpResponse.json({ error: API_ERROR_PRODUCT_NOT_FOUND }, { status: 404 })
  })
]
