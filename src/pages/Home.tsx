
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRestaurants } from '@/hooks/use-restaurants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import RestaurantGrid from '@/components/Restaurant/RestaurantGrid';
import { Search, ArrowRight, MapPin, Clock, Star, Utensils, ChevronRight } from 'lucide-react';

const cuisineTypes = [
  { name: 'Indian', icon: '🍛' },
  { name: 'Italian', icon: '🍕' },
  { name: 'Chinese', icon: '🥢' },
  { name: 'Mexican', icon: '🌮' },
  { name: 'Japanese', icon: '🍣' },
  { name: 'Thai', icon: '🍜' },
  { name: 'American', icon: '🍔' },
  { name: 'Mediterranean', icon: '🥙' },
  { name: 'Vegetarian', icon: '🥗' },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: featuredRestaurants, isLoading } = useRestaurants();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const featuredRestaurantsData = featuredRestaurants
    ?.filter(restaurant => restaurant.is_featured)
    .slice(0, 3);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with Glassmorphism */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-90 z-0"></div>
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=2070)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gradient">
                Delicious Food <span className="text-yellow-300">Delivered</span> Fast
              </h1>
              <p className="text-lg mb-8 text-white/90 max-w-xl">
                Order from thousands of local restaurants and get your favorite meals delivered to your doorstep. Discover new flavors today.
              </p>
              
              <form onSubmit={handleSearch} className="flex w-full max-w-lg bg-white/10 p-1.5 rounded-lg backdrop-blur-sm">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-white" />
                  <Input
                    type="text"
                    placeholder="Search for food or restaurants..."
                    className="pl-10 h-12 rounded-md border-0 bg-white/20 text-white placeholder:text-white/70 focus-visible:ring-offset-0 focus-visible:ring-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-12 px-6 ms-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </form>
            </div>
            
            <div className="hidden md:flex justify-end">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop"
                  alt="Delicious Food"
                  className="rounded-lg shadow-2xl max-w-md object-cover transform hover:scale-105 transition-transform duration-300"
                  style={{ height: '400px' }}
                />
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <div className="bg-green-500 rounded-full p-2">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Time</p>
                      <p className="font-medium">20-30 min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Cuisine Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Explore By <span className="text-foodie-red">Cuisine</span></h2>
            <Button 
              variant="ghost" 
              className="text-foodie-red"
              onClick={() => navigate('/restaurants')}
            >
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
            {cuisineTypes.map((cuisine) => (
              <Link 
                key={cuisine.name} 
                to={`/restaurants?cuisine=${cuisine.name}`} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center hover:shadow-md transition-shadow transform hover:scale-105 transition-transform duration-200"
              >
                <div className="text-3xl mb-2">{cuisine.icon}</div>
                <h3 className="font-medium text-sm">{cuisine.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Restaurants with Cards */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured <span className="text-foodie-red">Restaurants</span></h2>
            <Button 
              variant="ghost" 
              className="text-foodie-red"
              onClick={() => navigate('/restaurants')}
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <RestaurantGrid 
            restaurants={featuredRestaurantsData || []} 
            loading={isLoading} 
          />
        </div>
      </section>
      
      {/* How It Works with Modern Cards */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">How <span className="text-foodie-red">FoodieGo</span> Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-red-50 dark:bg-gray-700 text-foodie-red rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Choose a Restaurant</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Browse through hundreds of restaurants and cuisines to find exactly what you're craving.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-orange-50 dark:bg-gray-700 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Place Your Order</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select your favorite dishes, customize as needed, and checkout with your preferred payment method.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-yellow-500 to-green-500"></div>
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-green-50 dark:bg-gray-700 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Track your order in real-time and enjoy your meal delivered straight to your doorstep.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Download App CTA with Glass Morphism */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-foodie-red opacity-95 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521767704734-17fdb66d5f8f?q=80&w=1974')] bg-cover bg-center opacity-20 z-0"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-4">Get the FoodieGo App</h2>
              <p className="text-lg mb-8 text-white/90">
                Get a better experience and more features by downloading our mobile app. Order food anytime, anywhere.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-black hover:bg-gray-900 text-white">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  App Store
                </Button>
                <Button className="bg-black hover:bg-gray-900 text-white">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop"
                  alt="Mobile App"
                  className="max-w-sm rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-5 -right-5 bg-yellow-400 text-black font-bold p-3 rounded-lg shadow-lg rotate-12">
                  50% OFF
                  <div className="text-xs font-normal">First Order</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our <span className="text-foodie-red">Customers</span> Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                rating: 5,
                comment: "FoodieGo has been a lifesaver during busy workdays. The delivery is always on time and the food arrives hot!"
              },
              {
                name: "Michael Chen",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                rating: 5,
                comment: "I love the variety of restaurants available. I've discovered so many new favorite places through this app."
              },
              {
                name: "Priya Sharma",
                image: "https://randomuser.me/api/portraits/women/63.jpg",
                rating: 4,
                comment: "Great service and user-friendly app. I use it at least twice a week for lunch and dinner orders."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white dark:bg-gray-800 shadow-md overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 border-2 border-foodie-red"
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="italic text-gray-600 dark:text-gray-300">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
