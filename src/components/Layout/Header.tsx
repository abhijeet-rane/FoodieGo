
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useViewStore } from '@/store/store';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Search, Menu, LogOut, User, ShoppingCart, Sun, Moon, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/store';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useViewStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const cartItemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-foodie-red">FoodieGo</h1>
            </Link>

            <div className="hidden md:flex">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search restaurants, cuisines..."
                  className="pl-10 w-[300px] lg:w-[400px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </form>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              <Link to="/restaurants">
                <Button variant="ghost">Restaurants</Button>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/cart">
                    <Button variant="ghost" className="relative">
                      <ShoppingCart size={20} />
                      {cartItemCount > 0 && (
                        <Badge
                          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-foodie-red text-white"
                          variant="outline"
                        >
                          {cartItemCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarImage src={user?.profileImage} alt={user?.name} />
                          <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/orders')}>
                        <MapPin className="mr-2 h-4 w-4" />
                        My Orders
                      </DropdownMenuItem>
                      {user?.role === 'restaurant_owner' && (
                        <DropdownMenuItem onClick={() => navigate('/owner/dashboard')}>
                          Restaurant Dashboard
                        </DropdownMenuItem>
                      )}
                      {user?.role === 'admin' && (
                        <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="default" className="bg-foodie-red hover:bg-red-600">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu */}
            <div className="md:hidden flex items-center gap-2">
              {isAuthenticated && (
                <Link to="/cart">
                  <Button variant="ghost" className="relative">
                    <ShoppingCart size={20} />
                    {cartItemCount > 0 && (
                      <Badge
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-foodie-red text-white"
                        variant="outline"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>FoodieGo</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <form onSubmit={handleSearch} className="relative mb-6">
                      <Input
                        type="text"
                        placeholder="Search restaurants, cuisines..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </form>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={toggleDarkMode}
                      >
                        {darkMode ? (
                          <>
                            <Sun size={16} className="mr-2" /> Light Mode
                          </>
                        ) : (
                          <>
                            <Moon size={16} className="mr-2" /> Dark Mode
                          </>
                        )}
                      </Button>

                      <Link to="/restaurants">
                        <Button variant="ghost" className="w-full justify-start">
                          Restaurants
                        </Button>
                      </Link>

                      {isAuthenticated ? (
                        <>
                          <Link to="/profile">
                            <Button variant="ghost" className="w-full justify-start">
                              <User className="mr-2 h-4 w-4" />
                              Profile
                            </Button>
                          </Link>
                          <Link to="/orders">
                            <Button variant="ghost" className="w-full justify-start">
                              <MapPin className="mr-2 h-4 w-4" />
                              My Orders
                            </Button>
                          </Link>
                          {user?.role === 'restaurant_owner' && (
                            <Link to="/owner/dashboard">
                              <Button variant="ghost" className="w-full justify-start">
                                Restaurant Dashboard
                              </Button>
                            </Link>
                          )}
                          {user?.role === 'admin' && (
                            <Link to="/admin/dashboard">
                              <Button variant="ghost" className="w-full justify-start">
                                Admin Dashboard
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={handleLogout}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link to="/login">
                            <Button variant="ghost" className="w-full justify-start">
                              Login
                            </Button>
                          </Link>
                          <Link to="/signup">
                            <Button
                              variant="default"
                              className="w-full justify-start bg-foodie-red hover:bg-red-600"
                            >
                              Sign Up
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
