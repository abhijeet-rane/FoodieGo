
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MenuItem } from '@/types';
import { Utensils, Clock, Leaf } from 'lucide-react';

interface FoodItemDetailsProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
}

const FoodItemDetails: React.FC<FoodItemDetailsProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{item.name}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.is_vegetarian && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-0">
                  <Leaf className="h-3 w-3 mr-1" /> Vegetarian
                </Badge>
              )}
              {item.is_vegan && (
                <Badge variant="outline" className="bg-green-200 text-green-800 border-0">
                  <Leaf className="h-3 w-3 mr-1" /> Vegan
                </Badge>
              )}
              {item.featured && (
                <Badge variant="default" className="bg-amber-500">Popular</Badge>
              )}
              {item.calories && (
                <Badge variant="outline" className="border-gray-300">
                  {item.calories} calories
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md overflow-hidden h-56">
            <img 
              src={item.image || '/placeholder.svg'} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {item.description || 'No description available.'}
            </p>
          </div>

          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-100 border-0">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex justify-between items-center">
            <div>
              <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
            </div>
            <Button 
              className="bg-foodie-red hover:bg-red-600" 
              disabled={!item.is_available}
              onClick={() => {
                onAddToCart(item);
                onClose();
              }}
            >
              {item.is_available ? 'Add to Cart' : 'Currently Unavailable'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FoodItemDetails;
