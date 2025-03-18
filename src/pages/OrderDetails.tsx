
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useOrderWithDetails } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { MapPin, Package, ChevronLeft, Clock, Check, X } from 'lucide-react';
import { CartItem } from '@/types';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    case 'preparing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    case 'out_for_delivery':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: order, isLoading, error, refetch } = useOrderWithDetails(id);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (order) {
      // Set progress based on status
      switch (order.status) {
        case 'pending':
          setProgress(25);
          break;
        case 'preparing':
          setProgress(50);
          break;
        case 'out_for_delivery':
          setProgress(75);
          break;
        case 'delivered':
          setProgress(100);
          break;
        default:
          setProgress(0);
      }
    }
  }, [order]);
  
  if (isLoading) {
    return (
      <div className="container-custom py-8 flex justify-center">
        <div className="w-12 h-12 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="container-custom py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          {error?.message || 'Order not found'}
        </div>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => navigate('/orders')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }
  
  // Format date and time
  const orderDate = new Date(order.placed_at);
  const formattedDate = orderDate.toLocaleDateString();
  const formattedTime = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Cast order.items to CartItem[] for proper typing
  const items = order.items as unknown as CartItem[];
  
  // Calculate total
  const subtotal = items.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = 2.99;
  
  return (
    <div className="container-custom py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="outline" 
          className="mr-4" 
          onClick={() => navigate('/orders')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
                <CardDescription>
                  Placed on {formattedDate} at {formattedTime}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Order Progress */}
            <div className="mb-8">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-foodie-red bg-red-100">
                      Order Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-foodie-red">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                  <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-foodie-red transition-all duration-500"
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className={order.status === 'pending' ? 'font-bold text-foodie-red' : ''}>Order Placed</span>
                  <span className={order.status === 'preparing' ? 'font-bold text-foodie-red' : ''}>Preparing</span>
                  <span className={order.status === 'out_for_delivery' ? 'font-bold text-foodie-red' : ''}>Out for Delivery</span>
                  <span className={order.status === 'delivered' ? 'font-bold text-foodie-red' : ''}>Delivered</span>
                </div>
              </div>
            </div>
            
            {/* Restaurant Info */}
            {order.restaurant && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Restaurant</h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                    <img 
                      src={order.restaurant.featured_image} 
                      alt={order.restaurant.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{order.restaurant.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.restaurant.address}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Delivery Address */}
            {order.address && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Delivery Address</h3>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-foodie-red" />
                  <div>
                    <h4 className="font-medium">{order.address.label}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.address.full_address}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Order Items */}
            <div>
              <h3 className="text-lg font-medium mb-3">Order Items</h3>
              <div className="border rounded-md divide-y">
                {items.map((cartItem, index) => (
                  <div key={index} className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                        <img 
                          src={cartItem.item.image} 
                          alt={cartItem.item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{cartItem.item.name}</h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>Qty: {cartItem.quantity}</span>
                          {cartItem.item.is_vegetarian && (
                            <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-xs">Veg</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">
                      ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment Method</span>
                  <Badge variant="outline">
                    {order.payment_method.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment Status</span>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : (order.payment_status === 'failed' ? 'destructive' : 'outline')}>
                    {order.payment_status === 'paid' ? (
                      <Check className="h-3.5 w-3.5 mr-1" />
                    ) : order.payment_status === 'failed' ? (
                      <X className="h-3.5 w-3.5 mr-1" />
                    ) : null}
                    {order.payment_status.toUpperCase()}
                  </Badge>
                </div>
                
                {/* Estimated Delivery */}
                {order.estimated_delivery_time && (
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium">Estimated Delivery</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-foodie-red" />
                      <span>{new Date(order.estimated_delivery_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <Button 
                  variant="destructive" 
                  className="w-full mt-6"
                  onClick={() => toast.error("Feature coming soon!")}
                >
                  Cancel Order
                </Button>
              )}
              
              {order.status === 'delivered' && (
                <Button 
                  className="w-full mt-6 bg-foodie-red hover:bg-red-700"
                  onClick={() => navigate(`/restaurants/${order.restaurant_id}`)}
                >
                  Order Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;
