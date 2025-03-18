
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useCartStore } from '@/store/store';
import { useUserAddresses } from '@/hooks/use-addresses';
import { useCreateOrder } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CreditCard, Home, MapPin, Timer, Truck } from 'lucide-react';
import AddressForm from '@/components/User/AddressForm';

const PaymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay with your card',
    icon: CreditCard,
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Home,
  },
  {
    id: 'upi',
    name: 'UPI',
    description: 'Pay with UPI apps',
    icon: CreditCard,
  },
];

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { data: addresses, isLoading: addressesLoading } = useUserAddresses(user?.id);
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'upi'>('card');
  const [subTotal, setSubTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (!cart) {
      navigate('/cart');
    }
  }, [cart, navigate]);
  
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.is_default);
      setSelectedAddressId(defaultAddress?.id || addresses[0].id);
    }
  }, [addresses]);
  
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
    }
  }, [cart]);
  
  const handlePlaceOrder = () => {
    if (!user) {
      toast.error('Please log in to place an order');
      navigate('/login');
      return;
    }
    
    if (!cart) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
    
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    
    createOrder(
      {
        userId: user.id,
        restaurantId: cart.restaurant_id,
        addressId: selectedAddressId,
        items: cart.items,
        totalAmount: total,
        paymentMethod,
      },
      {
        onSuccess: (data) => {
          toast.success('Order placed successfully!');
          navigate(`/orders/${data.id}`);
        },
      }
    );
  };
  
  if (!cart || !user) {
    return null;
  }
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Address
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  {showAddressForm ? 'Cancel' : '+ Add New Address'}
                </Button>
              </div>
              
              <Separator className="mb-4" />
              
              {showAddressForm && (
                <div className="mb-6 p-4 border rounded-lg">
                  <AddressForm 
                    onSuccess={() => setShowAddressForm(false)}
                    onCancel={() => setShowAddressForm(false)}
                  />
                </div>
              )}
              
              {addressesLoading ? (
                <div className="flex justify-center p-8">
                  <div className="w-8 h-8 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : addresses && addresses.length > 0 ? (
                <RadioGroup 
                  value={selectedAddressId} 
                  onValueChange={setSelectedAddressId}
                  className="space-y-3"
                >
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-start space-x-3 border rounded-lg p-4">
                      <RadioGroupItem value={address.id} id={address.id} />
                      <div className="flex-1">
                        <Label htmlFor={address.id} className="flex items-center">
                          {address.label}
                          {address.is_default && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {address.full_address}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No addresses found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Please add a delivery address to continue
                  </p>
                  {!showAddressForm && (
                    <Button
                      className="bg-foodie-red hover:bg-red-600"
                      onClick={() => setShowAddressForm(true)}
                    >
                      Add New Address
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </h2>
              
              <Separator className="mb-4" />
              
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as 'card' | 'cash' | 'upi')}
                className="space-y-3"
              >
                {PaymentMethods.map((method) => (
                  <div key={method.id} className="flex items-start space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                    <div className="flex-1">
                      <Label htmlFor={`payment-${method.id}`} className="flex items-center">
                        <method.icon className="h-4 w-4 mr-2" />
                        {method.name}
                      </Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {method.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          {/* Delivery Time */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Timer className="h-5 w-5 mr-2" />
                Estimated Delivery Time
              </h2>
              
              <Separator className="mb-4" />
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Truck className="h-10 w-10 text-foodie-red mr-4" />
                  <div>
                    <p className="font-medium">Your order will arrive in</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {cart.items.length > 0 ? '30-45 minutes' : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden sticky top-24">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Items ({cart.items.reduce((acc, item) => acc + item.quantity, 0)})
                  </span>
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
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || isCreatingOrder}
              >
                {isCreatingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
