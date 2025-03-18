
import { useState } from 'react';
import { MenuItem } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MenuItemCard from '@/components/Restaurant/MenuItemCard';
import FoodItemDetails from '@/components/Restaurant/FoodItemDetails';

interface RestaurantMenuProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  isItemInCart: (itemId: string) => boolean;
  getItemQuantity: (itemId: string) => number;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
}

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  menuItems,
  onAddToCart,
  isItemInCart,
  getItemQuantity,
  updateCartItemQuantity,
}) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Group menu items by category
  const categories = [...new Set(menuItems.map(item => item.category))];
  const menuByCategory = categories.map(category => ({
    category,
    items: menuItems.filter(item => item.category === category)
  }));

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="mb-6 flex w-full overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="flex-shrink-0">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {menuByCategory.map(({ category, items }) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <div key={item.id} onClick={() => handleItemClick(item)} className="cursor-pointer">
                  <MenuItemCard
                    item={item}
                    onAddToCart={onAddToCart}
                    isInCart={isItemInCart(item.id)}
                    currentQuantity={getItemQuantity(item.id)}
                    onUpdateQuantity={updateCartItemQuantity}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <FoodItemDetails
        item={selectedItem}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};

export default RestaurantMenu;
