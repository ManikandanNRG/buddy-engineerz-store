import { supabase } from './supabase'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  published_at: string
  tags: string[]
  created_at: string
  updated_at: string
}

export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return { posts: [], error }
  }

  return { posts: data as BlogPost[], error: null }
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return { post: null, error }
  }

  return { post: data as BlogPost, error: null }
}

export async function createBlogPost(post: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single()

  if (error) {
    console.error('Error creating blog post:', error)
    return { post: null, error }
  }

  return { post: data as BlogPost, error: null }
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating blog post:', error)
    return { post: null, error }
  }

  return { post: data as BlogPost, error: null }
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting blog post:', error)
    return { error }
  }

  return { error: null }
}
