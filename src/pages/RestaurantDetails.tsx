
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/hooks/use-restaurants';
import { useMenuItems } from '@/hooks/use-menu-items';
import { useRestaurantReviews } from '@/hooks/use-reviews';
import { useCartStore, useAuthStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Clock,
  DollarSign,
  MapPin,
  Star,
  Info,
  Utensils,
  MessageSquare,
  Plus,
  Minus,
  Check,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';
import { CartItem, MenuItem } from '@/types';

// Component for menu item card
interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  isInCart: boolean;
  currentQuantity: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  isInCart,
  currentQuantity,
  onUpdateQuantity,
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-foodie-red text-white">Popular</Badge>
          </div>
        )}
        {(item.is_vegetarian || item.is_vegan) && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-foodie-green text-white border-0">
              {item.is_vegan ? 'Vegan' : 'Vegetarian'}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
            <span className="font-semibold text-lg">${item.price.toFixed(2)}</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
            {item.description}
          </p>
          
          {item.calories && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {item.calories} calories
            </div>
          )}
        </div>
        
        <div className="mt-3">
          {!isInCart ? (
            <Button 
              className="w-full bg-foodie-red hover:bg-red-600"
              onClick={() => onAddToCart(item)}
              disabled={!item.is_available}
            >
              {item.is_available ? (
                <>
                  <Plus className="mr-1 h-4 w-4" /> Add to Cart
                </>
              ) : (
                'Currently Unavailable'
              )}
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdateQuantity(item.id, currentQuantity - 1)}
                disabled={currentQuantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="font-medium">
                {currentQuantity}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdateQuantity(item.id, currentQuantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Main component
const RestaurantDetails = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { cart, addToCart, updateQuantity } = useCartStore();
  
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuCategories, setMenuCategories] = useState<string[]>([]);
  const [itemsByCategory, setItemsByCategory] = useState<Record<string, MenuItem[]>>({});
  
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId);
  const { data: menuItems, isLoading: menuLoading } = useMenuItems(restaurantId);
  const { data: reviews, isLoading: reviewsLoading } = useRestaurantReviews(restaurantId);
  
  // Organize menu items by category
  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      const categories = [...new Set(menuItems.map(item => item.category))];
      setMenuCategories(categories);
      
      const itemsMap: Record<string, MenuItem[]> = {};
      categories.forEach(category => {
        itemsMap[category] = menuItems.filter(item => item.category === category);
      });
      
      setItemsByCategory(itemsMap);
      setSelectedCategory(categories[0]);
    }
  }, [menuItems]);
  
  // Handle add to cart
  const handleAddToCart = (item: MenuItem) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart');
      navigate('/login');
      return;
    }
    
    if (cart && cart.restaurant_id && cart.restaurant_id !== restaurantId) {
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
  
  // Format price range
  const renderPriceRange = (priceRange: number): string => {
    return '$'.repeat(priceRange);
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
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
          <Button 
            onClick={() => navigate('/restaurants')}
            className="bg-foodie-red hover:bg-red-600"
          >
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Restaurant Hero */}
      <div className="relative h-[300px] md:h-[400px]">
        <div className="absolute inset-0">
          <img
            src={restaurant.featured_image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                  <div className="flex items-center">
                    <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4 mr-1" />
                    <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{restaurant.delivery_time} min</span>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>{renderPriceRange(restaurant.price_range)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {restaurant.cuisine_type.map(cuisine => (
                    <Badge key={cuisine} variant="secondary" className="bg-white/20">
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {cart && cart.restaurant_id === restaurant.id && (
                <Button 
                  className="mt-4 md:mt-0 bg-foodie-red hover:bg-red-600"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Cart ({cart.items.reduce((total, item) => total + item.quantity, 0)} items)
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Restaurant Info & Menu */}
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
            {menuLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : menuItems && menuItems.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-8">
                {/* Categories Sidebar */}
                <div className="md:w-1/4 md:sticky md:top-24 h-fit">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    <h3 className="font-bold text-lg mb-4">Categories</h3>
                    <ul className="space-y-1">
                      {menuCategories.map(category => (
                        <li key={category}>
                          <button
                            onClick={() => handleCategorySelect(category)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                              selectedCategory === category
                                ? 'bg-foodie-red text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {category}
                            <span className="ml-2 text-sm">
                              ({itemsByCategory[category]?.length || 0})
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="md:w-3/4">
                  {selectedCategory && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">{selectedCategory}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {itemsByCategory[selectedCategory]?.map(item => (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            onAddToCart={handleAddToCart}
                            isInCart={isItemInCart(item.id)}
                            currentQuantity={getItemQuantity(item.id)}
                            onUpdateQuantity={updateQuantity}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No menu items available</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This restaurant hasn't added any menu items yet.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="info">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Restaurant Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {restaurant.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Location</h3>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {restaurant.address}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded">
                      <span>Opening Time</span>
                      <span className="font-medium">{restaurant.opening_hours}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded">
                      <span>Closing Time</span>
                      <span className="font-medium">{restaurant.closing_hours}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {restaurant.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${restaurant.name} interior ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                
                <Button 
                  className="bg-foodie-red hover:bg-red-600"
                  onClick={() => navigate('/write-review/' + restaurant.id)}
                >
                  Write a Review
                </Button>
              </div>
              
              {reviewsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review: any) => (
                    <div 
                      key={review.id} 
                      className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={review.user?.profile_image} />
                            <AvatarFallback>
                              {review.user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{review.user?.name || 'Anonymous'}</h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(review.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4 mr-1" />
                          <span className="font-medium">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-gray-600 dark:text-gray-400">
                        {review.comment}
                      </div>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {review.images.map((image: string, index: number) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Be the first to review this restaurant!
                  </p>
                  <Button 
                    className="bg-foodie-red hover:bg-red-600"
                    onClick={() => navigate('/write-review/' + restaurant.id)}
                  >
                    Write a Review
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDetails;
