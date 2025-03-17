
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurants } from '@/hooks/use-restaurants';
import { Restaurant } from '@/types';
import RestaurantGrid from '@/components/Restaurant/RestaurantGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { useViewStore } from '@/store/store';

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

const Home = () => {
  const { darkMode } = useViewStore();
  const [activeTab, setActiveTab] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  
  const { data: restaurants, isLoading } = useRestaurants();
  
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  
  useEffect(() => {
    if (restaurants) {
      const featured = restaurants.filter(restaurant => restaurant.is_featured);
      setFeaturedRestaurants(featured);
      
      let filtered = restaurants;
      
      // Apply cuisine filter
      if (selectedCuisine !== 'All') {
        filtered = filtered.filter(restaurant => 
          restaurant.cuisine_type.includes(selectedCuisine)
        );
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(restaurant => 
          restaurant.name.toLowerCase().includes(query) || 
          restaurant.cuisine_type.some(cuisine => cuisine.toLowerCase().includes(query)) ||
          restaurant.description.toLowerCase().includes(query)
        );
      }
      
      setFilteredRestaurants(filtered);
    }
  }, [restaurants, selectedCuisine, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in the useEffect
  };

  const handleCuisineSelect = (cuisine: string) => {
    setSelectedCuisine(cuisine);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=2000&q=80" 
            alt="Food banner" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative container-custom h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Delicious Food, <br />Delivered to Your Door
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Order from your favorite restaurants and enjoy the convenience of home delivery.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search for restaurants or cuisines"
              className="pl-10 pr-4 py-6 text-black dark:text-white rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Button 
              type="submit" 
              className="absolute right-1 top-1 bg-foodie-red hover:bg-red-600"
            >
              Search
            </Button>
          </form>
          
          <div className="flex items-center mt-4 text-white">
            <MapPin className="h-5 w-5 mr-2" />
            <span>Find restaurants near you</span>
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom">
          <div className="flex overflow-x-auto pb-2 scrollbar-hide">
            {cuisineTypes.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => handleCuisineSelect(cuisine)}
                className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap ${
                  selectedCuisine === cuisine
                    ? 'bg-foodie-red text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="all">All Restaurants</TabsTrigger>
              </TabsList>
              <Link to="/restaurants">
                <Button variant="ghost" className="text-foodie-red">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <TabsContent value="featured" className="mt-4">
              <RestaurantGrid restaurants={featuredRestaurants} loading={isLoading} />
            </TabsContent>
            
            <TabsContent value="all" className="mt-4">
              <RestaurantGrid restaurants={filteredRestaurants} loading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 bg-foodie-red text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Restaurants</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore restaurants and cuisines available in your area.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 bg-foodie-orange text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18 2l4 4"></path>
                  <path d="M15 5l4 4"></path>
                  <path d="M15 9h4V5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select your favorite dishes and add them to your cart.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 bg-foodie-green text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your order in real-time until it arrives at your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get the full FoodieGo experience on your phone. Order food, track deliveries, and get special app-only deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.08 13.313c.734.733 1.383 1.054 1.785.656.598-.598-.145-1.772-1.175-2.802-.955-.956-2.001-1.627-2.598-1.03-.408.408-.087 1.057.656 1.801.678.678 1.148 1.19 1.332 1.374zM6.586 19.071c.181.181.698.65 1.377 1.329.743.743 1.392 1.064 1.8.656.598-.598-.074-1.643-1.03-2.599-1.03-1.03-2.205-1.773-2.802-1.175-.398.398-.078 1.047.655 1.785v.004zM21.631 11.498c-1.496-1.496-3.535-2.223-4.873-.885-.775.775-.518 1.847.13 2.974l-1.781 1.781c-1.127-.648-2.199-.905-2.973-.13-1.339 1.339-.612 3.378.885 4.873 1.496 1.497 3.535 2.224 4.873.885.775-.775.518-1.847-.13-2.974l1.781-1.781c1.127.648 2.199.905 2.973.13 1.339-1.339.612-3.378-.885-4.873zm-12.702-.726c-1.252.071-2.735-.4-4.325-1.422l-.24.241 4.893 4.894.241-.241c-1.02-1.59-1.492-3.071-1.42-4.323.041-.723.28-1.369.851-1.771L2.98 2.2 2.2 2.98l4.947 4.947c-.322.488-.874.841-1.618.895zm8.309 6.065c-.774.775-2.12.213-3.36-1.029-1.243-1.243-1.804-2.588-1.03-3.363.775-.773 2.12-.211 3.363 1.031 1.243 1.244 1.804 2.588 1.029 3.361h-.002zM10.782 21.83c-.775.775-2.12.213-3.363-1.029-1.242-1.242-1.804-2.588-1.029-3.361.773-.775 2.12-.213 3.363 1.029 1.242 1.242 1.804 2.586 1.029 3.361z"/>
                  </svg>
                  App Store
                </Button>
                <Button className="bg-black hover:bg-gray-800 text-white">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.273-.635V2.449c0-.228.087-.45.273-.635zM14.822 13.03l2.871-1.661 3.041 1.756a.996.996 0 0 1 0 1.751l-3.041 1.755-2.871-1.661 2.182-1.26-2.182-1.26zM5.876 1.043l10.431 6.022-2.868 1.656L5.876 1.043zm7.564 15.925l2.868 1.655-10.432 6.022 7.564-7.677z"/>
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=500&q=80"
                alt="Mobile App"
                className="max-w-full h-auto rounded-lg shadow-xl"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
