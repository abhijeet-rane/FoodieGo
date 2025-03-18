
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Address } from '@/types';
import { MapPin, Star, PenSquare, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  canDelete?: boolean;
  showActions?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  canDelete = true,
  showActions = true,
}) => {
  return (
    <Card className={`overflow-hidden ${address.is_default ? 'border-foodie-red' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-foodie-red mt-1">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{address.label}</h3>
              {address.is_default && (
                <Badge variant="outline" className="border-amber-400 text-amber-600">
                  <Star className="h-3 w-3 mr-1 fill-amber-400" /> Default
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{address.full_address}</p>
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="px-4 py-3 flex justify-between bg-gray-50 dark:bg-gray-800/50">
          <div>
            {!address.is_default && (
              <Button 
                variant="ghost" 
                className="h-8 px-2 text-amber-600"
                onClick={() => onSetDefault(address.id)}
              >
                <Star className="h-4 w-4 mr-1" /> Set as Default
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500"
              onClick={() => onEdit(address)}
            >
              <PenSquare className="h-4 w-4" />
            </Button>
            {canDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-500"
                onClick={() => onDelete(address.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AddressCard;
