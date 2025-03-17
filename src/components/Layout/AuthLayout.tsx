
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showLoginLink?: boolean;
  showSignupLink?: boolean;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  showLoginLink = false,
  showSignupLink = false,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold text-foodie-red">FoodieGo</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        
        {children}
        
        <div className="mt-6 text-center">
          {showLoginLink && (
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-foodie-red hover:text-red-600">
                Log in
              </Link>
            </p>
          )}
          
          {showSignupLink && (
            <p className="text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-foodie-red hover:text-red-600">
                Sign up
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
