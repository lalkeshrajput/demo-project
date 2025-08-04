import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  Bell, 
  UserCircle, 
  Menu, 
  X,
  Home,
  List,
  ClipboardList,
  Settings,
  BarChart3
} from 'lucide-react';

const OwnerOrdersHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  dateFilter,
  setDateFilter,
  onExport, 
  isLoggedIn,
  showFilters,
  setShowFilters 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Items', href: '/my-listings', icon: List },
    { name: 'Orders', href: '/owner-orders', icon: ClipboardList, active: true },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">RentKart</h1>
              <p className="text-sm text-neutral-500">Owner Dashboard</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ name, href, icon: Icon, active }) => (
              <Link
                key={name}
                to={href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  active 
                    ? 'text-neutral-900 bg-neutral-100' 
                    : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{name}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders, renters, items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all duration-200 bg-neutral-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 py-2 border border-neutral-300 rounded-lg text-sm font-medium transition-colors duration-200 ${
                showFilters 
                  ? 'bg-neutral-100 text-neutral-900' 
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:block">Filters</span>
            </button>

            {/* Export Button */}
            <button
              onClick={onExport}
              className="inline-flex items-center gap-2 px-3 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:block">Export</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-neutral-500 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-neutral-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile */}
            {isLoggedIn ? (
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 p-2 text-neutral-500 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                  <UserCircle className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium">Profile</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="bg-neutral-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-neutral-700 transition-colors duration-200"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders, renters, items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-neutral-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              {navLinks.map(({ name, href, icon: Icon, active }) => (
                <Link
                  key={name}
                  to={href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                    active 
                      ? 'text-neutral-900 bg-neutral-100' 
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{name}</span>
                </Link>
              ))}

              {/* Mobile Actions */}
              <div className="pt-2 border-t border-neutral-200 space-y-1">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                >
                  <Filter className="w-4 h-4" />
                  <span>Toggle Filters</span>
                </button>
                <button
                  onClick={onExport}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Orders</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Filters Bar (when enabled) */}
        {showFilters && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Return Requested">Return Requested</option>
                  <option value="Returned">Returned</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-white transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default OwnerOrdersHeader;