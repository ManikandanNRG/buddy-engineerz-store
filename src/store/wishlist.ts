import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/lib/supabase'

interface WishlistStore {
  items: Product[]
  isHydrated: boolean
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  getTotalItems: () => number
  setHydrated: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,
      
      addItem: (product) => {
        const existingItem = get().items.find(item => item.id === product.id)
        
        if (!existingItem) {
          set((state) => ({
            items: [...state.items, product]
          }))
        }
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }))
      },
      
      toggleItem: (product) => {
        const isInWishlist = get().isInWishlist(product.id)
        
        if (isInWishlist) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId)
      },
      
      getTotalItems: () => {
        return get().items.length
      },
      
      setHydrated: () => {
        set({ isHydrated: true })
      }
    }),
    {
      name: 'buddy-engineerz-wishlist',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      }
    }
  )
) 