
import { create } from 'zustand';
import { User, Cart, Restaurant, FilterOptions } from '@/types';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

interface CartState {
  cart: Cart | null;
  addToCart: (restaurantId: string, restaurantName: string, item: any, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

interface FilterState {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  resetFilters: () => void;
}

interface ViewState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Cart Store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      addToCart: (restaurantId, restaurantName, item, quantity) => {
        const currentCart = get().cart;
        
        // If cart is empty or from a different restaurant, create a new cart
        if (!currentCart || currentCart.restaurant_id !== restaurantId) {
          set({
            cart: {
              restaurant_id: restaurantId,
              restaurant_name: restaurantName,
              items: [{ item, quantity }],
            },
          });
          return;
        }
        
        // Check if item already exists in cart
        const existingItemIndex = currentCart.items.findIndex(
          (cartItem) => cartItem.item.id === item.id
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const updatedItems = [...currentCart.items];
          updatedItems[existingItemIndex].quantity += quantity;
          
          set({
            cart: {
              ...currentCart,
              items: updatedItems,
            },
          });
        } else {
          // Add new item to cart
          set({
            cart: {
              ...currentCart,
              items: [...currentCart.items, { item, quantity }],
            },
          });
        }
      },
      removeFromCart: (itemId) => {
        const currentCart = get().cart;
        if (!currentCart) return;
        
        const updatedItems = currentCart.items.filter(
          (cartItem) => cartItem.item.id !== itemId
        );
        
        // If cart becomes empty, clear it
        if (updatedItems.length === 0) {
          set({ cart: null });
          return;
        }
        
        set({
          cart: {
            ...currentCart,
            items: updatedItems,
          },
        });
      },
      updateQuantity: (itemId, quantity) => {
        const currentCart = get().cart;
        if (!currentCart) return;
        
        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }
        
        const updatedItems = currentCart.items.map((cartItem) =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity }
            : cartItem
        );
        
        set({
          cart: {
            ...currentCart,
            items: updatedItems,
          },
        });
      },
      clearCart: () => set({ cart: null }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Filter Store
export const useFilterStore = create<FilterState>()(
  (set) => ({
    filters: {},
    setFilters: (filters) => set({ filters: { ...filters } }),
    resetFilters: () => set({ filters: {} }),
  })
);

// View preferences Store
export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'view-storage',
    }
  )
);
