
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Address } from '@/types';
import { toast } from 'sonner';

// Alias for backward compatibility
export const useAddresses = useUserAddresses;

// Get user addresses
export function useUserAddresses(userId?: string) {
  return useQuery({
    queryKey: ['addresses', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });
        
      if (error) throw error;
      
      return data as Address[];
    },
    enabled: !!userId
  });
}

// Get address by ID
export function useAddress(id?: string) {
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
    enabled: !!id
  });
}

// Create address
export function useCreateAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (address: Omit<Address, 'id'>) => {
      const { data, error } = await supabase
        .from('addresses')
        .insert([address])
        .select()
        .single();
        
      if (error) throw error;
      
      // If this is default address, unset others
      if (address.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', address.user_id)
          .neq('id', data.id);
      }
      
      return data as Address;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses', data.user_id] });
      toast.success('Address added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add address');
    }
  });
}

// Update address
export function useUpdateAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (address: Address) => {
      const { data, error } = await supabase
        .from('addresses')
        .update(address)
        .eq('id', address.id)
        .select()
        .single();
        
      if (error) throw error;
      
      // If this is default address, unset others
      if (address.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', address.user_id)
          .neq('id', address.id);
      }
      
      return data as Address;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['address', data.id] });
      toast.success('Address updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update address');
    }
  });
}

// Delete address
export function useDeleteAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string, userId: string }) => {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return { id, userId };
    },
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
      toast.success('Address deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete address');
    }
  });
}

// Set default address
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string, userId: string }) => {
      // First, unset all default addresses for this user
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
        
      // Then set the new default
      const { data, error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return data as Address;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses', data.user_id] });
      toast.success('Default address updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to set default address');
    }
  });
}
