
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useUserOrders } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart } from 'lucide-react';
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

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading } = useUserOrders(user?.id);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (isLoading) {
    return (
      <div className="container-custom py-8 flex justify-center">
        <div className="w-12 h-12 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      {!orders || orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-medium mb-2">No orders yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Looks like you haven't placed any orders yet.
          </p>
          <Button 
            className="bg-foodie-red hover:bg-red-600"
            onClick={() => navigate('/restaurants')}
          >
            Browse Restaurants
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className={`h-1 ${order.status === 'delivered' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-foodie-red'}`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.restaurant?.name || "Restaurant"}</CardTitle>
                    <CardDescription>
                      {new Date(order.placed_at).toLocaleDateString()} at{' '}
                      {new Date(order.placed_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden">
                    <img 
                      src={order.restaurant?.featured_image || '/placeholder.svg'} 
                      alt={order.restaurant?.name || 'Restaurant'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Order ID:</span> #{order.id.substring(0, 8)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Items:</span> {(order.items as unknown as CartItem[]).reduce((acc, item) => acc + item.quantity, 0)}
                    </p>
                    <p className="text-sm font-medium">
                      Total: ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-foodie-red hover:bg-red-600"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <Package className="h-4 w-4 mr-2" />
                  View Order Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
