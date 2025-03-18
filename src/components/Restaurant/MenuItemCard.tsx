
import { MenuItem, CartItem } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  isInCart: boolean;
  currentQuantity: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  isInCart,
  currentQuantity,
  onUpdateQuantity,
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-foodie-red text-white">Popular</Badge>
          </div>
        )}
        {(item.is_vegetarian || item.is_vegan) && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-foodie-green text-white border-0">
              {item.is_vegan ? 'Vegan' : 'Vegetarian'}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
            <span className="font-semibold text-lg">${item.price.toFixed(2)}</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
            {item.description}
          </p>
          
          {item.calories && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {item.calories} calories
            </div>
          )}
        </div>
        
        <div className="mt-3">
          {!isInCart ? (
            <Button 
              className="w-full bg-foodie-red hover:bg-red-600"
              onClick={() => onAddToCart(item)}
              disabled={!item.is_available}
            >
              {item.is_available ? (
                <>
                  <Plus className="mr-1 h-4 w-4" /> Add to Cart
                </>
              ) : (
                'Currently Unavailable'
              )}
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdateQuantity(item.id, currentQuantity - 1)}
                disabled={currentQuantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="font-medium">
                {currentQuantity}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdateQuantity(item.id, currentQuantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;
