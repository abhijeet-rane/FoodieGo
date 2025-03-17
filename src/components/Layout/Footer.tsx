
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-12 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">FoodieGo</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Discover the best food & drinks in your area with our easy-to-use food delivery service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-foodie-red">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-foodie-red">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-foodie-red">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-foodie-red">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-foodie-red dark:hover:text-foodie-red">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-foodie-red dark:hover:text-foodie-red">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-foodie-red dark:hover:text-foodie-red">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/partner-with-us" className="text-gray-600 dark:text-gray-400 hover:text-foodie-red dark:hover:text-foodie-red">
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">For Foodies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurants" className="text-gray-600 dark:text-gray-400 hover:text-foodie-red dark:hover:text-foodie-red">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/user/orders" className="text-gray-600 dark:text-gray-400 hover:text-foodie-red dark:hover:text-foodie-red">
                  Your Orders
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-foodie-red dark:hover:text-foodie-red">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-foodie-red dark:hover:text-foodie-red">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-foodie-red dark:hover:text-foodie-red">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-foodie-red mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  1234 Food Street, Delicious City, Tasty State, 56789
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-foodie-red mr-2" />
                <span className="text-gray-600 dark:text-gray-400">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-foodie-red mr-2" />
                <span className="text-gray-600 dark:text-gray-400">support@foodiego.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} FoodieGo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
