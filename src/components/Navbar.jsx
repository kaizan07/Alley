import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, ChevronDown, LogOut, Settings, UserPlus, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { getCartItemCount, items } = useCart();

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  // Refresh cart when user logs in
  useEffect(() => {
    if (isLoggedIn && userInfo) {
      // The cart will be loaded when the user navigates to cart page
      // or when components use the useCart hook
    }
  }, [isLoggedIn, userInfo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserInfo(null);
    setIsProfileOpen(false);
    navigate('/login');
  };

  const handleLogin = () => {
    setIsProfileOpen(false);
    navigate('/login');
  };

  const handleSignUp = () => {
    setIsProfileOpen(false);
    navigate('/signup');
  };

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate('/profile');
  };

  const handleSettings = () => {
    setIsProfileOpen(false);
    navigate('/settings');
  };

  return (
    <nav className="bg-[#caa47c] px-10 py-2 shadow-md flex items-center justify-between font-inter text-base text-stone-900 h-15 relative">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <img
          src="/src/assets/img/home/logo.png"
          alt="Alley Logo"
          className="w-6 h-6"
        />
        <span className="font-semibold text-lg">Alley</span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6">
        <Link to="/home" className="hover:text-amber-900 transition-colors">Home</Link>
        <Link to="/AllProduct" className="hover:text-amber-900 transition-colors">AllProduct</Link>
        {/* <Link to="/bestsellers" className="hover:text-amber-900 transition-colors">Best Sellers</Link>
        <Link to="/more" className="hover:text-amber-900 transition-colors">More</Link> */}
      </div>

      {/* Right Section*/}
      
      <div className="flex items-center space-x-4">
        <Link to="/cart" className="relative cursor-pointer hover:text-amber-900 transition-colors space-x-2">
          <ShoppingCart size={22} />
          <span className="absolute -top-2 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {getCartItemCount()}
          </span>
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-1 hover:text-amber-900 transition-colors focus:outline-none"
          >
            <User size={22} />
            {isLoggedIn && userInfo && (
              <span className="hidden md:block text-sm font-medium">
                {userInfo.name || 'User'}
              </span>
            )}
            <ChevronDown 
              size={16} 
              className={`transform transition-transform duration-200 ${
                isProfileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50">
              {isLoggedIn ? (
                // Logged in user options
                <>
                  <div className="px-4 py-2 border-b border-stone-200">
                    <p className="text-sm font-medium text-stone-900">
                      {userInfo?.name || 'User'}
                    </p>
                    <p className="text-xs text-stone-600">
                      {userInfo?.email || 'user@email.com'}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </button>
                  
                  <Link
                    to="/orders"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <ShoppingCart size={16} />
                    <span>My Orders</span>
                  </Link>
                  
                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-stone-200 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-stone-200">
                    <p className="text-sm font-medium text-stone-900">Welcome to Alley</p>
                    <p className="text-xs text-stone-600">Sign in to access your account</p>
                  </div>
                  
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <LogIn size={16} />
                    <span>Sign In</span>
                  </button>
                  
                  <button
                    onClick={handleSignUp}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <UserPlus size={16} />
                    <span>Create Account</span>
                  </button>
                  
                  
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden">
        <button className="p-2 hover:bg-stone-200 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
