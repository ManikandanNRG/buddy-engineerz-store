import { Metadata } from 'next'
import { getProducts, getCategories } from '@/lib/database'
import ProductsList from './ProductsList'

export const metadata: Metadata = {
  title: 'Engineering Apparel & Tech Fashion | Buddy Engineerz',
  description: 'Shop the latest in engineering-themed apparel. High-quality hoodies, t-shirts, and accessories for developers, programmers, and tech enthusiasts.',
  openGraph: {
    title: 'Engineering Apparel & Tech Fashion | Buddy Engineerz',
    description: 'High-quality hoodies, t-shirts, and accessories for developers and tech enthusiasts.',
    type: 'website',
  }
}

export default async function ProductsPage() {
  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(),
    getCategories()
  ])

  const products = productsResult.products || []
  const categories = categoriesResult.categories || []

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductsList 
        initialProducts={products as any} 
        initialCategories={categories as any} 
      />
    </div>
  )
}