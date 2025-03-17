
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Restaurant, FilterOptions } from '@/types';
import { toast } from 'sonner';

// Get all restaurants
export const useRestaurants = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: ['restaurants', filters],
    queryFn: async () => {
      let query = supabase.from('restaurants').select('*').eq('is_active', true);

      // Apply filters if provided
      if (filters) {
        if (filters.cuisine_type && filters.cuisine_type.length > 0) {
          // Use overlap operator to find restaurants that have at least one matching cuisine
          query = query.contains('cuisine_type', filters.cuisine_type);
        }

        if (filters.price_range && filters.price_range.length > 0) {
          // Find restaurants with price range in the provided array
          query = query.in('price_range', filters.price_range);
        }

        if (filters.rating) {
          query = query.gte('rating', filters.rating);
        }

        if (filters.delivery_time) {
          query = query.lte('delivery_time', filters.delivery_time);
        }
      }

      // Apply sorting if provided
      if (filters?.sort_by) {
        switch (filters.sort_by) {
          case 'rating':
            query = query.order('rating', { ascending: false });
            break;
          case 'delivery_time':
            query = query.order('delivery_time', { ascending: true });
            break;
          case 'price_low_to_high':
            query = query.order('price_range', { ascending: true });
            break;
          case 'price_high_to_low':
            query = query.order('price_range', { ascending: false });
            break;
          default:
            query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
        }
      } else {
        // Default sorting: featured first, then by rating
        query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Restaurant[];
    },
  });
};

// Get restaurant by ID
export const useRestaurant = (id?: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Restaurant;
    },
    enabled: !!id,
  });
};

// Get restaurants by owner ID
export const useRestaurantsByOwner = (ownerId?: string) => {
  return useQuery({
    queryKey: ['restaurants', 'owner', ownerId],
    queryFn: async () => {
      if (!ownerId) return [];
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', ownerId);

      if (error) throw error;
      return data as Restaurant[];
    },
    enabled: !!ownerId,
  });
};

// Create restaurant
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (restaurant: Omit<Restaurant, 'id' | 'created_at' | 'rating'>) => {
      const { data, error } = await supabase
        .from('restaurants')
        .insert({
          ...restaurant,
          rating: 0,
          is_active: true,
          is_featured: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Restaurant;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'owner', data.owner_id] });
      toast.success('Restaurant created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create restaurant');
    },
  });
};

// Update restaurant
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Restaurant>;
    }) => {
      const { data, error } = await supabase
        .from('restaurants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Restaurant;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', data.id] });
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'owner', data.owner_id] });
      toast.success('Restaurant updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update restaurant');
    },
  });
};

// Delete restaurant
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Instead of deleting, mark as inactive
      const { data, error } = await supabase
        .from('restaurants')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Restaurant;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', data.id] });
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'owner', data.owner_id] });
      toast.success('Restaurant deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete restaurant');
    },
  });
};

// Search restaurants
export const useSearchRestaurants = (searchTerm: string) => {
  return useQuery({
    queryKey: ['restaurants', 'search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,cuisine_type.cs.{${searchTerm}}`)
        .order('is_featured', { ascending: false })
        .order('rating', { ascending: false });

      if (error) throw error;
      return data as Restaurant[];
    },
    enabled: searchTerm.length >= 2,
  });
};
