
import { Restaurant } from '@/types';
import { MapPin } from 'lucide-react';

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({ restaurant }) => {
  return (
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
  );
};

export default RestaurantInfo;
