
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAddresses, useDeleteAddress } from '@/hooks/use-addresses';
import { useUserOrders } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import AddressForm from '@/components/User/AddressForm';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Package, 
  MapPin, 
  User, 
  LogOut, 
  Phone, 
  Mail, 
  PlusCircle, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: addresses, isLoading: isLoadingAddresses } = useAddresses(user?.id);
  const { data: orders, isLoading: isLoadingOrders } = useUserOrders(user?.id);
  const { mutate: deleteAddress } = useDeleteAddress();
  
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteAddress(addressId);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="addresses">
            <MapPin className="h-4 w-4 mr-2" /> Addresses {addresses?.length ? `(${addresses.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="orders">
            <Package className="h-4 w-4 mr-2" /> Orders {orders?.length ? `(${orders.length})` : ''}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{user.role}</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h4>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</h4>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span>{user.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">User ID</h4>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {user.id}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="bg-foodie-red hover:bg-red-600">Edit Profile</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="addresses">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Addresses</h2>
            <Button 
              className="bg-foodie-red hover:bg-red-600"
              onClick={() => setIsAddressDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>
          
          {isLoadingAddresses ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : addresses && addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{address.label}</h3>
                          {address.is_default && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          {address.full_address}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDeleteAddress(address.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-medium mb-2">No addresses found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                  You haven't added any delivery addresses yet.
                </p>
                <Button 
                  className="bg-foodie-red hover:bg-red-600"
                  onClick={() => setIsAddressDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              </CardContent>
            </Card>
          )}
          
          <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Add a new delivery address to your account.
                </DialogDescription>
              </DialogHeader>
              <AddressForm 
                onSuccess={() => setIsAddressDialogOpen(false)}
                onCancel={() => setIsAddressDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Orders</h2>
          </div>
          
          {isLoadingOrders ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Order #{order.id.substring(0, 8)}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                          }`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.placed_at).toLocaleDateString()} at {new Date(order.placed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                          <img 
                            src={order.restaurant?.featured_image} 
                            alt={order.restaurant?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{order.restaurant?.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.restaurant?.address}
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {item.quantity}x {item.item.name}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            +{order.items.length - 3} more
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Order Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-medium mb-2">No orders found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                  You haven't placed any orders yet.
                </p>
                <Button 
                  className="bg-foodie-red hover:bg-red-600"
                  onClick={() => navigate('/restaurants')}
                >
                  Browse Restaurants
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
