import { http, HttpResponse } from 'msw'

type ResponseError = { error?: string }

export type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
  stock: number
}

type CartItem = {
  productId: number
  quantity: number
}

const products: Product[] = [
  {
    id: 1,
    name: 'Product 1',
    price: 15,
    image: 'https://picsum.photos',
    description: "This is a random text. Totally the best description text you've never seen.",
    stock: 14
  },
  {
    id: 2,
    name: 'Product 2',
    price: 30,
    image: 'https://picsum.photos',
    description: 'This is another random text, used for description.',
    stock: 17
  },
  {
    id: 3,
    name: 'Product 3',
    price: 100,
    image: 'https://picsum.photos',
    description: "I'm really smashing it with the descriptions here.",
    stock: 2
  },
  {
    id: 4,
    name: 'Product 4',
    price: 1000,
    image: 'https://picsum.photos',
    description: "I'm really running out of ideas.",
    stock: 0
  },
  {
    id: 5,
    name: 'Product 5',
    price: 1000,
    image: 'https://picsum.photos',
    description:
      "Use your imagination. Imagine that this is a decent description. It's not, but just try!",
    stock: 7
  }
]

const cart: CartItem[] = []

export const handlers = [
  http.get<never, never, Product[] | ResponseError, '/api/products'>('/api/products', () => {
    return HttpResponse.json(products)
  }),

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
  )
]
