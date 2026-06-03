import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/database'
import { createClient } from '@supabase/supabase-js'
import ProductDetails from './ProductDetails'
import type { Product } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ id: string }>
}

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', currentId)
    .gt('stock', 0)
    .limit(4)
  return (data as Product[]) || []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { product } = await getProductById(id)

  if (!product) {
    return { title: 'Product Not Found | Buddy Engineerz' }
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
  const { product } = await getProductById(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)

  return <ProductDetails product={product} relatedProducts={relatedProducts} />
}