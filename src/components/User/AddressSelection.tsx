
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { useUserAddresses, useCreateAddress, useSetDefaultAddress } from '@/hooks/use-addresses';
import { Address } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddressCard from '@/components/User/AddressCard';
import AddressForm from '@/components/User/AddressForm';

interface AddressSelectionProps {
  selectedAddressId: string;
  onAddressSelect: (addressId: string) => void;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({
  selectedAddressId,
  onAddressSelect,
}) => {
  const { user } = useAuth();
  const { data: addresses, isLoading } = useUserAddresses(user?.id);
  const { mutateAsync: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutateAsync: setDefaultAddress } = useSetDefaultAddress();
  
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  
  const handleAddAddress = async (addressData: Omit<Address, 'id'>) => {
    if (!user) return;
    
    try {
      const newAddress = await createAddress(addressData);
      onAddressSelect(newAddress.id);
      setIsAddressFormOpen(false);
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };
  
  const handleSetDefault = async (addressId: string) => {
    if (!user) return;
    
    try {
      await setDefaultAddress({ id: addressId, userId: user.id });
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-foodie-red" />
      </div>
    );
  }
  
  if (!addresses || addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You don't have any saved addresses yet.
        </p>
        <Button 
          onClick={() => setIsAddressFormOpen(true)}
          className="bg-foodie-red hover:bg-red-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
        
        <Dialog open={isAddressFormOpen} onOpenChange={setIsAddressFormOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            {user && (
              <AddressForm 
                userId={user.id}
                onSubmit={handleAddAddress}
                onCancel={() => setIsAddressFormOpen(false)}
                isSubmitting={isCreating}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <RadioGroup 
        value={selectedAddressId} 
        onValueChange={onAddressSelect}
        className="space-y-3"
      >
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3 pb-4">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className={`border rounded-md p-2 ${selectedAddressId === address.id ? 'border-foodie-red' : 'border-gray-200 dark:border-gray-700'}`}
              >
                <div className="flex items-center">
                  <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mr-3" />
                  <div className="flex-1">
                    <AddressCard 
                      address={address}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onSetDefault={handleSetDefault}
                      showActions={false}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </RadioGroup>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center"
        onClick={() => setIsAddressFormOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Address
      </Button>
      
      <Dialog open={isAddressFormOpen} onOpenChange={setIsAddressFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          {user && (
            <AddressForm 
              userId={user.id}
              onSubmit={handleAddAddress}
              onCancel={() => setIsAddressFormOpen(false)}
              isSubmitting={isCreating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressSelection;
