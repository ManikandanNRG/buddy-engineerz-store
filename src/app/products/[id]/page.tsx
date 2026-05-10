import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/database'
import ProductDetails from './ProductDetails'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const featuredProducts = [
  {
    id: 'featured-1',
    name: 'Algorithm Tee',
    description: 'Premium cotton tee with minimalist algorithm design',
    price: 999,
    original_price: 1299,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center'],
    category: 'tshirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    stock: 10,
    featured: true,
    gender: 'unisex' as const,
    tags: ['algorithm', 'coding', 'developer'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'featured-2',
    name: 'Code Hoodie',
    description: 'Comfortable hoodie perfect for coding sessions',
    price: 1999,
    original_price: 2499,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center'],
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Black'],
    stock: 15,
    featured: true,
    gender: 'unisex' as const,
    tags: ['coding', 'hoodie', 'comfortable'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'featured-3',
    name: 'Binary Mug',
    description: 'Start your day with binary coffee',
    price: 599,
    original_price: 799,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&crop=center'],
    category: 'accessories',
    sizes: ['One Size'],
    colors: ['White'],
    stock: 5,
    featured: true,
    gender: 'unisex' as const,
    tags: ['binary', 'coffee', 'mug'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

async function getProduct(id: string) {
  // Check featured products first
  const featured = featuredProducts.find(p => p.id === id)
  if (featured) return featured

  // Fetch from database
  const { product } = await getProductById(id)
  return product
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: 'Product Not Found | Buddy Engineerz'
    }
  }

  return {
    title: `${product.name} | Buddy Engineerz`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    }
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product as any} />
}