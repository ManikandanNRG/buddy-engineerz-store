import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/lib/supabase'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  isHydrated: boolean
  addItem: (product: Product, size: string, color: string, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  setHydrated: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: true,
      isHydrated: false,
      
      addItem: (product, size, color, quantity = 1) => {
        const existingItemId = `${product.id}-${size}-${color}`
        const existingItem = get().items.find(item => item.id === existingItemId)
        
        if (existingItem) {
          set((state) => ({
            items: state.items.map(item =>
              item.id === existingItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }))
        } else {
          const newItem: CartItem = {
            id: existingItemId,
            product,
            quantity,
            size,
            color
          }
          set((state) => ({
            items: [...state.items, newItem]
          }))
        }
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      openCart: () => {
        set({ isOpen: true })
      },
      
      closeCart: () => {
        set({ isOpen: false })
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      },

      setHydrated: () => {
        set({ isHydrated: true, isLoading: false })
      }
    }),
    {
      name: 'buddy-engineerz-cart',
      onRehydrateStorage: () => (state) => {
        // Called when hydration is complete
        if (state) {
          state.setHydrated()
        }
      },
    }
  )
) 