
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface ReviewType {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  images?: string[];
  user?: {
    name: string;
    profile_image?: string;
  };
}

interface RestaurantReviewsProps {
  restaurantId: string;
  reviews: ReviewType[] | undefined;
  isLoading: boolean;
}

const RestaurantReviews: React.FC<RestaurantReviewsProps> = ({ 
  restaurantId, 
  reviews, 
  isLoading 
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        
        <Button 
          className="bg-foodie-red hover:bg-red-600"
          onClick={() => navigate(`/restaurants/${restaurantId}/review`)}
        >
          Write a Review
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
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
                  {review.images.map((image, index) => (
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
            onClick={() => navigate(`/restaurants/${restaurantId}/review`)}
          >
            Write a Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantReviews;
