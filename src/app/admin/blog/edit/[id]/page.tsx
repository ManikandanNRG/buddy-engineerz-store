'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import BlogForm from '../../BlogForm'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/blog'

export default function EditBlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) {
        setPost(data)
      }
      setLoading(false)
    }

    if (params.id) {
      loadPost()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Post not found</h2>
        <Link href="/admin/blog" className="text-purple-600 hover:underline">
          Return to Blog Management
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Management
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
        <p className="text-gray-500">Updating: {post.title}</p>
      </div>

      <BlogForm initialData={post} isEditing />
    </div>
  )
}
