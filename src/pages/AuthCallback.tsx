
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        navigate('/login');
        return;
      }
      
      if (data.session) {
        navigate('/');
      } else {
        navigate('/login');
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-foodie-red mb-4">FoodieGo</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Completing authentication...</p>
        <div className="mt-6 w-16 h-16 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
