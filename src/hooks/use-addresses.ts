
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Address } from '@/types';
import { toast } from 'sonner';

// Get user addresses
export const useUserAddresses = (userId?: string) => {
  return useQuery({
    queryKey: ['addresses', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Address[];
    },
    enabled: !!userId,
  });
};

// Get address by ID
export const useAddress = (id?: string) => {
  return useQuery({
    queryKey: ['address', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Address;
    },
    enabled: !!id,
  });
};

// Create address
export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (address: Omit<Address, 'id' | 'created_at'>) => {
      // If this is the first address or marked as default, reset other defaults
      if (address.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', address.user_id);
      }
      
      const { data, error } = await supabase
        .from('addresses')
        .insert(address)
        .select()
        .single();

      if (error) throw error;
      return data as Address;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses', data.user_id] });
      toast.success('Address added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add address');
    },
  });
};

// Update address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Address>;
    }) => {
      // Get the address first to have the user_id for cache invalidation
      const { data: address } = await supabase
        .from('addresses')
        .select('user_id')
        .eq('id', id)
        .single();
      
      // If marking as default, reset other defaults
      if (updates.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', address?.user_id);
      }
      
      const { data, error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Address;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['address', data.id] });
      toast.success('Address updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update address');
    },
  });
};

// Delete address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Get the address first to have the user_id for cache invalidation
      const { data: address } = await supabase
        .from('addresses')
        .select('user_id, is_default')
        .eq('id', id)
        .single();
      
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // If the deleted address was the default, set a new default if other addresses exist
      if (address?.is_default) {
        const { data: remainingAddresses } = await supabase
          .from('addresses')
          .select('id')
          .eq('user_id', address.user_id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (remainingAddresses && remainingAddresses.length > 0) {
          await supabase
            .from('addresses')
            .update({ is_default: true })
            .eq('id', remainingAddresses[0].id);
        }
      }
      
      return { userId: address?.user_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses', data.userId] });
      toast.success('Address deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete address');
    },
  });
};
