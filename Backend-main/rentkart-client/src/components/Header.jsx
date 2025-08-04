import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, MapPin, ShoppingCart, ClipboardList, UserCircle, Menu, X } from 'lucide-react';

const Header = ({ location, setLocation, isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">RentKart</h1>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8 space-x-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for items, categories..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 rounded-xl"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-lg">
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="pl-2 pr-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 w-40"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-gray-600 hover:text-gray-800 font-medium">Home</Link>
            <Link to="/items" className="text-gray-600 hover:text-gray-800 font-medium">Browse Items</Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-800">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </Link>
            <Link to="/orders" className="text-gray-600 hover:text-gray-800"><ClipboardList className="w-5 h-5" /></Link>
            {isLoggedIn ? (
              <Link to="/dashboard" className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <UserCircle className="w-4 h-4" /><span>Dashboard</span>
              </Link>
            ) : (
              <Link to="/signup" className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium">Join Now</Link>
            )}
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className="md:hidden mt-2 flex items-center space-x-2 px-1 pb-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="pl-2 pr-3 py-2 border border-gray-300 rounded-xl text-sm w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
