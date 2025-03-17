
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Review } from '@/types';
import { toast } from 'sonner';

// Get reviews by restaurant ID
export const useRestaurantReviews = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['reviews', 'restaurant', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*, user:profiles(name, profile_image)')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
    enabled: !!restaurantId,
  });
};

// Get reviews by user ID
export const useUserReviews = (userId?: string) => {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*, restaurant:restaurants(name, featured_image)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
    enabled: !!userId,
  });
};

// Create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (review: Omit<Review, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();

      if (error) throw error;
      
      // Update restaurant rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('restaurant_id', review.restaurant_id);
        
      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await supabase
          .from('restaurants')
          .update({ rating: avgRating })
          .eq('id', review.restaurant_id);
          
        queryClient.invalidateQueries({ queryKey: ['restaurants'] });
        queryClient.invalidateQueries({ queryKey: ['restaurant', review.restaurant_id] });
      }
      
      return data as Review;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'restaurant', data.restaurant_id] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user', data.user_id] });
      toast.success('Review submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });
};

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, restaurantId }: { reviewId: string, restaurantId: string }) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      
      // Update restaurant rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('restaurant_id', restaurantId);
        
      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await supabase
          .from('restaurants')
          .update({ rating: avgRating })
          .eq('id', restaurantId);
      } else {
        // If no reviews left, reset rating to 0
        await supabase
          .from('restaurants')
          .update({ rating: 0 })
          .eq('id', restaurantId);
      }
      
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
      
      return { restaurantId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'restaurant', data.restaurantId] });
      toast.success('Review deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete review');
    },
  });
};
