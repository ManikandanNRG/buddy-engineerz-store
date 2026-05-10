'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X, Image as ImageIcon } from 'lucide-react'
import { createBlogPost, updateBlogPost, type BlogPost } from '@/lib/blog'

interface BlogFormProps {
  initialData?: BlogPost
  isEditing?: boolean
}

export default function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    image: initialData?.image || '',
    author: initialData?.author || 'Buddy Engineerz Team',
    tags: initialData?.tags?.join(', ') || '',
    published_at: initialData?.published_at ? new Date(initialData.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  })

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
    setFormData({ ...formData, slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    try {
      if (isEditing && initialData) {
        const { error } = await updateBlogPost(initialData.id, postData)
        if (error) throw error
      } else {
        const { error } = await createBlogPost(postData)
        if (error) throw error
      }
      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save blog post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              onBlur={!formData.slug ? generateSlug : undefined}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="e.g. The Future of Engineering Fashion"
            />
          </div>

          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-semibold text-gray-700">Slug</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="future-of-engineering-fashion"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-gray-700">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-20 resize-none"
              placeholder="A brief summary of the article..."
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-gray-700">Content (Markdown supported)</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-64 resize-y font-mono"
              placeholder="Write your article content here..."
            />
          </div>

          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-semibold text-gray-700">Featured Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-semibold text-gray-700">Author</label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-semibold text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="fashion, tech, guides"
            />
          </div>

          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-semibold text-gray-700">Publish Date</label>
            <input
              type="date"
              required
              value={formData.published_at}
              onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 md:flex-none bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {isEditing ? 'Update Article' : 'Publish Article'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 md:flex-none bg-white text-gray-600 border border-gray-200 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <X className="h-5 w-5" />
          Cancel
        </button>
      </div>
    </form>
  )
}
