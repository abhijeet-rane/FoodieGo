
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MenuItem } from '@/types';
import { toast } from 'sonner';

// Get menu items by restaurant ID
export const useMenuItems = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('category')
        .order('name');

      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !!restaurantId,
  });
};

// Get menu item by ID
export const useMenuItem = (id?: string) => {
  return useQuery({
    queryKey: ['menuItem', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as MenuItem;
    },
    enabled: !!id,
  });
};

// Create menu item
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (menuItem: Omit<MenuItem, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(menuItem)
        .select()
        .single();

      if (error) throw error;
      return data as MenuItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', data.restaurant_id] });
      toast.success('Menu item created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create menu item');
    },
  });
};

// Update menu item
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<MenuItem>;
    }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as MenuItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', data.restaurant_id] });
      queryClient.invalidateQueries({ queryKey: ['menuItem', data.id] });
      toast.success('Menu item updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update menu item');
    },
  });
};

// Delete menu item
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Get the menu item first to have the restaurant_id for cache invalidation
      const { data: menuItem } = await supabase
        .from('menu_items')
        .select('restaurant_id')
        .eq('id', id)
        .single();
      
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id, restaurantId: menuItem?.restaurant_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', data.restaurantId] });
      toast.success('Menu item deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete menu item');
    },
  });
};
