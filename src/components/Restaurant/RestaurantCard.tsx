
import { Link } from 'react-router-dom';
import { Star, Clock, DollarSign } from 'lucide-react';
import { Restaurant } from '@/types';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const {
    id,
    name,
    cuisine_type,
    rating,
    price_range,
    delivery_time,
    featured_image,
  } = restaurant;

  // Price range display
  const renderPriceRange = () => {
    const dollars = [];
    for (let i = 0; i < 4; i++) {
      dollars.push(
        <DollarSign
          key={i}
          size={14}
          className={i < price_range ? 'fill-current' : 'opacity-30'}
        />
      );
    }
    return dollars;
  };

  return (
    <Link to={`/restaurant/${id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative h-48">
          <img
            src={featured_image || '/placeholder.svg'}
            alt={name}
            className="w-full h-full object-cover"
          />
          {rating > 4.5 && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-foodie-red text-white">Popular</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-1 truncate">{name}</h3>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            {cuisine_type.slice(0, 3).join(', ')}
            {cuisine_type.length > 3 && '...'}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="ml-1 text-sm font-medium">
                {rating.toFixed(1)}
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="ml-1 text-sm">{delivery_time} min</span>
            </div>
            
            <div className="flex items-center">
              {renderPriceRange()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
