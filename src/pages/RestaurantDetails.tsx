
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/hooks/use-restaurants';
import { useMenuItems } from '@/hooks/use-menu-items';
import { useRestaurantReviews } from '@/hooks/use-reviews';
import { useCartStore, useAuthStore } from '@/store/store';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Utensils, Info, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { MenuItem } from '@/types';

// Import the new components
import RestaurantHero from '@/components/Restaurant/RestaurantHero';
import RestaurantMenu from '@/components/Restaurant/RestaurantMenu';
import RestaurantInfo from '@/components/Restaurant/RestaurantInfo';
import RestaurantReviews from '@/components/Restaurant/RestaurantReviews';

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { cart, addToCart, updateQuantity } = useCartStore();
  
  const [activeTab, setActiveTab] = useState('menu');
  
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(id);
  const { data: menuItems, isLoading: menuLoading } = useMenuItems(id);
  const { data: reviews, isLoading: reviewsLoading } = useRestaurantReviews(id);
  
  // Handle add to cart
  const handleAddToCart = (item: MenuItem) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart');
      navigate('/login');
      return;
    }
    
    if (cart && cart.restaurant_id && cart.restaurant_id !== id) {
      if (!window.confirm(
        'Your cart contains items from another restaurant. Would you like to clear your cart and add this item?'
      )) {
        return;
      }
    }
    
    if (restaurant) {
      addToCart(restaurant.id, restaurant.name, item, 1);
      toast.success(`Added ${item.name} to your cart`);
    }
  };
  
  // Check if an item is in the cart
  const isItemInCart = (itemId: string): boolean => {
    if (!cart) return false;
    return cart.items.some(cartItem => cartItem.item.id === itemId);
  };
  
  // Get item quantity in cart
  const getItemQuantity = (itemId: string): number => {
    if (!cart) return 0;
    const cartItem = cart.items.find(item => item.item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };
  
  if (restaurantLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Restaurant not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The restaurant you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/restaurants')}
            className="bg-foodie-red hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Restaurant Hero Section */}
      <RestaurantHero restaurant={restaurant} cart={cart} />
      
      {/* Restaurant Info & Menu Tabs */}
      <div className="container-custom py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="menu">
              <Utensils className="h-4 w-4 mr-2" /> Menu
            </TabsTrigger>
            <TabsTrigger value="info">
              <Info className="h-4 w-4 mr-2" /> Info
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <MessageSquare className="h-4 w-4 mr-2" /> Reviews ({reviews?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu">
            <RestaurantMenu
              restaurantId={id || ''}
              menuItems={menuItems}
              isLoading={menuLoading}
              onAddToCart={handleAddToCart}
              isItemInCart={isItemInCart}
              getItemQuantity={getItemQuantity}
              onUpdateQuantity={updateQuantity}
            />
          </TabsContent>
          
          <TabsContent value="info">
            <RestaurantInfo restaurant={restaurant} />
          </TabsContent>
          
          <TabsContent value="reviews">
            <RestaurantReviews
              restaurantId={id || ''}
              reviews={reviews}
              isLoading={reviewsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDetails;
