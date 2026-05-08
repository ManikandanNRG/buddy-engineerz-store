import { redirect } from 'next/navigation'

// /admin root redirects to /admin/dashboard
export default function AdminRootPage() {
  redirect('/admin/dashboard')
}
