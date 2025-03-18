
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useCartStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, ShoppingCart, Trash } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [subTotal, setSubTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    if (cart) {
      const subtotalAmount = cart.items.reduce(
        (acc, item) => acc + (item.item.price * item.quantity),
        0
      );
      
      const taxRate = 0.1; // 10% tax
      const tax = subtotalAmount * taxRate;
      const delivery = subtotalAmount > 0 ? 2.99 : 0; // $2.99 delivery fee if cart is not empty
      
      setSubTotal(subtotalAmount);
      setTaxAmount(tax);
      setDeliveryFee(delivery);
      setTotal(subtotalAmount + tax + delivery);
    } else {
      setSubTotal(0);
      setTaxAmount(0);
      setDeliveryFee(0);
      setTotal(0);
    }
  }, [cart]);
  
  const handleCheckout = () => {
    if (!user) {
      toast.error('Please log in to continue to checkout');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };
  
  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };
  
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button 
            className="bg-foodie-red hover:bg-red-600"
            onClick={() => navigate('/restaurants')}
          >
            Browse Restaurants
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Order from {cart.restaurant_name}
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => clearCart()}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Clear Cart
                  </Button>
                </div>
                
                <Separator className="mb-4" />
                
                {cart.items.map((item) => (
                  <div key={item.item.id} className="py-4 flex items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img 
                        src={item.item.image || '/placeholder.svg'} 
                        alt={item.item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{item.item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${item.item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.item.id, item.quantity - 1)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.item.id, item.quantity + 1)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="font-medium">
                        ${(item.item.price * item.quantity).toFixed(2)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 p-0 h-auto"
                        onClick={() => handleRemoveItem(item.item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full bg-foodie-red hover:bg-red-600"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4 text-center">
                  <Button 
                    variant="link" 
                    className="text-gray-500 dark:text-gray-400"
                    onClick={() => navigate('/restaurants')}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
