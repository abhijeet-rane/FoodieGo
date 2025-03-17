
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the home page
    navigate('/', { replace: true });
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to FoodieGo</h1>
        <p className="text-xl text-gray-600">Redirecting you to our homepage...</p>
        <div className="mt-6 w-12 h-12 border-4 border-foodie-red border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;
