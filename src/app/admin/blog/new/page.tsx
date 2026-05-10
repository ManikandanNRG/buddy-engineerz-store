'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BlogForm from '../BlogForm'

export default function NewBlogPostPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
        <p className="text-gray-500">Draft your next engineering fashion insight</p>
      </div>

      <BlogForm />
    </div>
  )
}
