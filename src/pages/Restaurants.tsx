import { useState, useEffect } from 'react';
import { useRestaurants } from '@/hooks/use-restaurants';
import { Restaurant, FilterOptions } from '@/types';
import RestaurantGrid from '@/components/Restaurant/RestaurantGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useFilterStore } from '@/store/store';

const cuisineTypes = [
  'All',
  'Indian',
  'Italian',
  'Chinese',
  'Mexican',
  'Japanese',
  'Thai',
  'American',
  'Mediterranean',
  'Vegetarian',
];

const Restaurants = () => {
  const { data: allRestaurants, isLoading } = useRestaurants();
  const { filters, setFilters, resetFilters } = useFilterStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Local filter state
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(filters.cuisine_type || []);
  const [priceRange, setPriceRange] = useState<number[]>(filters.price_range || [1, 4]);
  const [minRating, setMinRating] = useState<number>(filters.rating || 0);
  const [isVegetarian, setIsVegetarian] = useState<boolean>(filters.is_vegetarian || false);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(filters.delivery_time || 60);
  const [sortBy, setSortBy] = useState<string>(filters.sort_by || 'rating');
  
  // Apply filters
  useEffect(() => {
    if (allRestaurants) {
      let filtered = [...allRestaurants];
      
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(restaurant => 
          restaurant.name.toLowerCase().includes(query) || 
          restaurant.cuisine_type.some(cuisine => cuisine.toLowerCase().includes(query)) ||
          restaurant.description.toLowerCase().includes(query)
        );
      }
      
      // Cuisine filter
      if (selectedCuisines.length > 0) {
        filtered = filtered.filter(restaurant => 
          restaurant.cuisine_type.some(cuisine => selectedCuisines.includes(cuisine))
        );
      }
      
      // Price range filter
      filtered = filtered.filter(restaurant => 
        restaurant.price_range >= priceRange[0] && restaurant.price_range <= priceRange[1]
      );
      
      // Rating filter
      if (minRating > 0) {
        filtered = filtered.filter(restaurant => restaurant.rating >= minRating);
      }
      
      // Vegetarian filter
      if (isVegetarian) {
        filtered = filtered.filter(restaurant => 
          restaurant.cuisine_type.includes('Vegetarian') || restaurant.cuisine_type.includes('Vegan')
        );
      }
      
      // Delivery time filter
      if (maxDeliveryTime < 60) {
        filtered = filtered.filter(restaurant => restaurant.delivery_time <= maxDeliveryTime);
      }
      
      // Sorting
      if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'delivery_time') {
        filtered.sort((a, b) => a.delivery_time - b.delivery_time);
      } else if (sortBy === 'price_low_to_high') {
        filtered.sort((a, b) => a.price_range - b.price_range);
      } else if (sortBy === 'price_high_to_low') {
        filtered.sort((a, b) => b.price_range - a.price_range);
      }
      
      setFilteredRestaurants(filtered);
    }
  }, [
    allRestaurants, 
    searchQuery, 
    selectedCuisines, 
    priceRange, 
    minRating, 
    isVegetarian, 
    maxDeliveryTime, 
    sortBy
  ]);
  
  // Save filters to store when applying
  const applyFilters = () => {
    setFilters({
      cuisine_type: selectedCuisines.length > 0 ? selectedCuisines : undefined,
      price_range: priceRange,
      rating: minRating > 0 ? minRating : undefined,
      is_vegetarian: isVegetarian,
      delivery_time: maxDeliveryTime < 60 ? maxDeliveryTime : undefined,
      sort_by: sortBy as any,
    });
    setShowMobileFilters(false);
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCuisines([]);
    setPriceRange([1, 4]);
    setMinRating(0);
    setIsVegetarian(false);
    setMaxDeliveryTime(60);
    setSortBy('rating');
    resetFilters();
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is applied in useEffect
  };
  
  const toggleCuisine = (cuisine: string) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };
  
  // Format price range for display
  const formatPriceRange = (range: number[]) => {
    return range.map(price => '$'.repeat(price)).join(' - ');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 self-start sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                <X className="h-4 w-4 mr-1" /> Reset
              </Button>
            </div>
            
            <Accordion type="multiple" defaultValue={['cuisine', 'price', 'rating', 'other']} className="space-y-4">
              <AccordionItem value="cuisine">
                <AccordionTrigger>Cuisine Type</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cuisineTypes.slice(1).map((cuisine) => (
                      <Button
                        key={cuisine}
                        variant={selectedCuisines.includes(cuisine) ? 'default' : 'outline'}
                        size="sm"
                        className={selectedCuisines.includes(cuisine) ? 'bg-foodie-red' : ''}
                        onClick={() => toggleCuisine(cuisine)}
                      >
                        {cuisine}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="px-2">
                    <Slider
                      defaultValue={priceRange}
                      min={1}
                      max={4}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mt-6"
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>$</span>
                      <span>$$</span>
                      <span>$$$</span>
                      <span>$$$$</span>
                    </div>
                    <p className="mt-4 text-sm text-center">
                      {formatPriceRange(priceRange)}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="rating">
                <AccordionTrigger>Minimum Rating</AccordionTrigger>
                <AccordionContent>
                  <Select
                    value={minRating.toString()}
                    onValueChange={(value) => setMinRating(parseFloat(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="3.5">3.5+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="other">
                <AccordionTrigger>Other Filters</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vegetarian-filter">Vegetarian Only</Label>
                      <Switch
                        id="vegetarian-filter"
                        checked={isVegetarian}
                        onCheckedChange={setIsVegetarian}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Max Delivery Time: {maxDeliveryTime} mins</Label>
                      <Slider
                        min={10}
                        max={60}
                        step={5}
                        value={[maxDeliveryTime]}
                        onValueChange={(value) => setMaxDeliveryTime(value[0])}
                      />
                      <div className="flex justify-between text-sm">
                        <span>10 min</span>
                        <span>60 min</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating (High to Low)</SelectItem>
                  <SelectItem value="delivery_time">Delivery Time (Fast to Slow)</SelectItem>
                  <SelectItem value="price_low_to_high">Price (Low to High)</SelectItem>
                  <SelectItem value="price_high_to_low">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full mt-6 bg-foodie-red hover:bg-red-600"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">All Restaurants</h1>
              
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    <SelectItem value="delivery_time">Delivery Time</SelectItem>
                    <SelectItem value="price_low_to_high">Price (Low to High)</SelectItem>
                    <SelectItem value="price_high_to_low">Price (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleSearch} className="relative mb-6">
              <Input
                type="text"
                placeholder="Search restaurants, cuisines..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
            
            {/* Active filters display */}
            {(selectedCuisines.length > 0 || minRating > 0 || isVegetarian || maxDeliveryTime < 60) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCuisines.map(cuisine => (
                  <div key={cuisine} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                    {cuisine}
                    <button 
                      onClick={() => toggleCuisine(cuisine)}
                      className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {minRating > 0 && (
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                    {minRating}+ Stars
                    <button 
                      onClick={() => setMinRating(0)}
                      className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {isVegetarian && (
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Vegetarian
                    <button 
                      onClick={() => setIsVegetarian(false)}
                      className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {maxDeliveryTime < 60 && (
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                    ≤ {maxDeliveryTime} min
                    <button 
                      onClick={() => setMaxDeliveryTime(60)}
                      className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={handleResetFilters}
                  className="text-foodie-red hover:underline text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
            
            <RestaurantGrid restaurants={filteredRestaurants} loading={isLoading} />
          </div>
        </div>
      </div>
      
      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end md:hidden">
          <div className="w-4/5 bg-white dark:bg-gray-800 h-full overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <Accordion type="multiple" defaultValue={['cuisine', 'price', 'rating', 'other']} className="space-y-4">
              <AccordionItem value="cuisine">
                <AccordionTrigger>Cuisine Type</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cuisineTypes.slice(1).map((cuisine) => (
                      <Button
                        key={cuisine}
                        variant={selectedCuisines.includes(cuisine) ? 'default' : 'outline'}
                        size="sm"
                        className={selectedCuisines.includes(cuisine) ? 'bg-foodie-red' : ''}
                        onClick={() => toggleCuisine(cuisine)}
                      >
                        {cuisine}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="px-2">
                    <Slider
                      defaultValue={priceRange}
                      min={1}
                      max={4}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mt-6"
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>$</span>
                      <span>$$</span>
                      <span>$$$</span>
                      <span>$$$$</span>
                    </div>
                    <p className="mt-4 text-sm text-center">
                      {formatPriceRange(priceRange)}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="rating">
                <AccordionTrigger>Minimum Rating</AccordionTrigger>
                <AccordionContent>
                  <Select
                    value={minRating.toString()}
                    onValueChange={(value) => setMinRating(parseFloat(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="3.5">3.5+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="other">
                <AccordionTrigger>Other Filters</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mobile-vegetarian-filter">Vegetarian Only</Label>
                      <Switch
                        id="mobile-vegetarian-filter"
                        checked={isVegetarian}
                        onCheckedChange={setIsVegetarian}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Max Delivery Time: {maxDeliveryTime} mins</Label>
                      <Slider
                        min={10}
                        max={60}
                        step={5}
                        value={[maxDeliveryTime]}
                        onValueChange={(value) => setMaxDeliveryTime(value[0])}
                      />
                      <div className="flex justify-between text-sm">
                        <span>10 min</span>
                        <span>60 min</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating (High to Low)</SelectItem>
                  <SelectItem value="delivery_time">Delivery Time (Fast to Slow)</SelectItem>
                  <SelectItem value="price_low_to_high">Price (Low to High)</SelectItem>
                  <SelectItem value="price_high_to_low">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 mt-10">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleResetFilters}
              >
                Reset All
              </Button>
              <Button 
                className="flex-1 bg-foodie-red hover:bg-red-600"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
