
import { Restaurant, Cart } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, DollarSign, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RestaurantHeroProps {
  restaurant: Restaurant;
  cart: Cart | null;
}

const RestaurantHero: React.FC<RestaurantHeroProps> = ({ restaurant, cart }) => {
  const navigate = useNavigate();

  // Format price range
  const renderPriceRange = (priceRange: number): string => {
    return '$'.repeat(priceRange);
  };

  return (
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
  );
};

export default RestaurantHero;
