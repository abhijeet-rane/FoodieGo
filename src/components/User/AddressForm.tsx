
import React, { useState, useEffect } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Address } from '@/types';
import { getUserLocation } from '@/lib/geolocation';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const addressSchema = z.object({
  label: z.string().min(1, 'Address label is required'),
  full_address: z.string().min(5, 'Full address is required'),
  is_default: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  userId: string;
  address?: Address;
  onSubmit: (data: AddressFormValues & { user_id: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  userId,
  address,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [isLocating, setIsLocating] = useState(false);
  
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: address ? {
      label: address.label,
      full_address: address.full_address,
      is_default: address.is_default,
      latitude: address.latitude,
      longitude: address.longitude,
    } : {
      label: '',
      full_address: '',
      is_default: false,
    },
  });
  
  useEffect(() => {
    if (address) {
      form.reset({
        label: address.label,
        full_address: address.full_address,
        is_default: address.is_default,
        latitude: address.latitude,
        longitude: address.longitude,
      });
    }
  }, [address, form]);
  
  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const location = await getCurrentLocation();
      
      if (location) {
        form.setValue('latitude', location.latitude);
        form.setValue('longitude', location.longitude);
        
        // Reverse geocoding would normally go here to get the address from coordinates
        toast.success('Location captured successfully');
      }
    } catch (error) {
      toast.error('Failed to get your location. Please enter address manually.');
    } finally {
      setIsLocating(false);
    }
  };
  
  const handleFormSubmit = (data: AddressFormValues) => {
    onSubmit({
      ...data,
      user_id: userId,
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Label</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Home, Work, etc." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="full_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="123 Main St, City, State, ZIP" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            className="flex gap-2 items-center" 
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            {isLocating ? 'Getting Location...' : 'Use Current Location'}
          </Button>
        </div>
        
        <FormField
          control={form.control}
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Set as Default Address</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
          <Button 
            type="button"
            variant="outline" 
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-foodie-red hover:bg-red-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              address ? 'Update Address' : 'Add Address'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddressForm;
