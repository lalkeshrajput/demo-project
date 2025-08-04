import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, Download, Bell, UserCircle, Menu, X, ClipboardList } from 'lucide-react';

const OrderHeader = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, onExport, isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">RentKart</h1>
              <p className="text-sm text-gray-500">Order Management</p>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8 space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search orders, customers, order numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden lg:block">Export</span>
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">Home</Link>
            <Link to="/items" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">Browse Items</Link>
            <Link to="/orders" className="flex items-center space-x-1 text-gray-800 font-medium">
              <ClipboardList className="w-5 h-5" />
              <span>Orders</span>
            </Link>
            
            <button className="relative text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>

            {isLoggedIn ? (
              <Link to="/dashboard" className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors">
                <UserCircle className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link to="/signup" className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">Join Now</Link>
            )}
          </nav>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search and Filter */}
        <div className="md:hidden mt-2 space-y-3 px-1 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-lg">
              <Search className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 flex-1">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 pl-3 pr-8 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/home" className="block px-3 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100">Home</Link>
              <Link to="/items" className="block px-3 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100">Browse Items</Link>
              <Link to="/orders" className="block px-3 py-2 text-gray-800 font-medium rounded-lg bg-gray-100">Orders</Link>
              
              <div className="pt-2 border-t border-gray-200">
                {isLoggedIn ? (
                  <Link to="/dashboard" className="block px-3 py-2 bg-gray-800 text-white rounded-lg font-medium">Dashboard</Link>
                ) : (
                  <Link to="/signup" className="block px-3 py-2 bg-gray-800 text-white rounded-lg font-medium text-center">Join Now</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default OrderHeader;