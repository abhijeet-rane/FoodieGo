
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Order, CartItem } from '@/types';
import { toast } from 'sonner';
import { useCartStore } from '@/store/store';
import { useAuth } from '@/hooks/use-auth';

// Get user orders
export const useUserOrders = (userId?: string) => {
  return useQuery({
    queryKey: ['userOrders', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('placed_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch restaurant details for each order
      const ordersWithRestaurants = await Promise.all(
        orders.map(async (order) => {
          const { data: restaurant } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', order.restaurant_id)
            .single();
          
          return {
            ...order,
            restaurant,
            items: order.items as unknown as CartItem[] // Cast JSON to CartItem[]
          };
        })
      );
      
      return ordersWithRestaurants as unknown as Order[]; // Explicit type casting
    },
    enabled: !!userId
  });
};

// Get restaurant orders
export const useRestaurantOrders = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['orders', 'restaurant', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*, user:profiles(name, email)')
        .eq('restaurant_id', restaurantId)
        .order('placed_at', { ascending: false });

      if (error) throw error;
      
      // Transform database items back to CartItem[]
      return data.map(order => ({
        ...order,
        items: order.items as unknown as CartItem[]
      })) as unknown as Order[];
    },
    enabled: !!restaurantId,
  });
};

// Get order by ID
export const useOrder = (id?: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select('*, restaurant:restaurants(*, name, address, featured_image), user:profiles(name, email), address:addresses(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Transform database items back to CartItem[]
      return {
        ...data,
        items: data.items as unknown as CartItem[]
      } as unknown as Order;
    },
    enabled: !!id,
  });
};

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();
  
  return useMutation({
    mutationFn: async ({
      userId,
      restaurantId,
      addressId,
      items,
      totalAmount,
      paymentMethod,
    }: {
      userId: string;
      restaurantId: string;
      addressId: string;
      items: CartItem[];
      totalAmount: number;
      paymentMethod: 'card' | 'cash' | 'upi';
    }) => {
      // Calculate estimated delivery time (10 minutes for preparation + 10 minutes for delivery)
      const placedAt = new Date().toISOString();
      const estimatedDeliveryTime = new Date(
        new Date().getTime() + 10 * 60000
      ).toISOString();
      
      // Convert CartItem[] to JSON compatible format for Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          restaurant_id: restaurantId,
          address_id: addressId,
          items: items as unknown as any, // Cast items to any for Supabase JSON column
          total_amount: totalAmount,
          status: 'pending',
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cash' ? 'pending' : 'paid',
          placed_at: placedAt,
          estimated_delivery_time: estimatedDeliveryTime,
          is_complete: false
        })
        .select()
        .single();

      if (error) throw error;
      
      // Transform result back to Order type with correct items structure
      const resultOrder = {
        ...data,
        items: data.items as unknown as CartItem[]
      } as Order;
      
      // Simulate order status updates
      // After 5 minutes, update to "preparing"
      setTimeout(async () => {
        await supabase
          .from('orders')
          .update({ status: 'preparing' })
          .eq('id', resultOrder.id);
          
        queryClient.invalidateQueries({ queryKey: ['order', resultOrder.id] });
        queryClient.invalidateQueries({ queryKey: ['orders', 'user', userId] });
        queryClient.invalidateQueries({ queryKey: ['orders', 'restaurant', restaurantId] });
      }, 5 * 60 * 1000);
      
      // After 10 minutes, update to "out_for_delivery"
      setTimeout(async () => {
        await supabase
          .from('orders')
          .update({ status: 'out_for_delivery' })
          .eq('id', resultOrder.id);
          
        queryClient.invalidateQueries({ queryKey: ['order', resultOrder.id] });
        queryClient.invalidateQueries({ queryKey: ['orders', 'user', userId] });
        queryClient.invalidateQueries({ queryKey: ['orders', 'restaurant', restaurantId] });
      }, 10 * 60 * 1000);
      
      // After 15 minutes, update to "delivered"
      setTimeout(async () => {
        await supabase
          .from('orders')
          .update({
            status: 'delivered',
            delivered_at: new Date().toISOString(),
            is_complete: true
          })
          .eq('id', resultOrder.id);
          
        queryClient.invalidateQueries({ queryKey: ['order', resultOrder.id] });
        queryClient.invalidateQueries({ queryKey: ['orders', 'user', userId] });
        queryClient.invalidateQueries({ queryKey: ['orders', 'restaurant', restaurantId] });
      }, 15 * 60 * 1000);
      
      return resultOrder;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'user', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'restaurant', data.restaurant_id] });
      clearCart();
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to place order');
    },
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Order['status'];
    }) => {
      const updates: any = { status };
      
      // If status is delivered, set delivered_at and is_complete
      if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
        updates.is_complete = true;
      }
      
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform database items back to CartItem[]
      return {
        ...data,
        items: data.items as unknown as CartItem[]
      } as Order;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'user', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'restaurant', data.restaurant_id] });
      toast.success(`Order status updated to ${data.status}!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
};

// Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          is_complete: true
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform database items back to CartItem[]
      return {
        ...data,
        items: data.items as unknown as CartItem[]
      } as Order;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'user', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'restaurant', data.restaurant_id] });
      toast.success('Order cancelled successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel order');
    },
  });
};

// Add a function to fetch both order and related restaurant
export const useOrderWithDetails = (orderId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      
      // Fetch the order
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      if (!order) throw new Error('Order not found');
      
      // Fetch the restaurant
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', order.restaurant_id)
        .single();
      
      // Fetch the address
      const { data: address } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', order.address_id)
        .single();
      
      // Return the order with restaurant and address details
      return {
        ...order,
        items: order.items as unknown as CartItem[],
        restaurant,
        address,
        is_complete: order.is_complete || false
      } as unknown as Order;
    },
    enabled: !!user && !!orderId
  });
};
