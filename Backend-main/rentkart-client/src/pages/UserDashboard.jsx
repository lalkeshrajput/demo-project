import React, { useEffect, useState } from 'react';
import RenterDashboard from '../components/RenterDashboard';
import OwnerDashboard from '../components/OwnerDashboard';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  LogOut, 
  Settings, 
  Bell, 
  Heart,
  Package,
  Calendar,
  DollarSign,
  Plus,
  Eye,
  Truck,
  Shield
} from 'lucide-react';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('renter');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      joinDate: '2024-01-15',
      verified: true
    };
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const quickActions = {
    renter: [
      { icon: Eye, label: 'Browse Items', color: 'bg-gray-600 hover:bg-gray-700', action: () => navigate('/items') },
      { icon: Heart, label: 'My Wishlist', color: 'bg-gray-700 hover:bg-gray-800', action: () => navigate('/wishlist') },
      { icon: Calendar, label: 'My Orders', color: 'bg-gray-500 hover:bg-gray-600', action: () => navigate('/orders') },
      { icon: DollarSign, label: 'Payment History', color: 'bg-gray-800 hover:bg-gray-900', action: () => navigate('/payments') }
    ],
    owner: [
      { icon: Plus, label: 'Add New Item', color: 'bg-gray-600 hover:bg-gray-700', action: () => navigate('/add-item') },
      { icon: Package, label: 'My Listings', color: 'bg-gray-700 hover:bg-gray-800', action: () => navigate('/my-listings') },
      { icon: Truck, label: 'Rental Orders', color: 'bg-gray-500 hover:bg-gray-600', action: () => navigate('/owner-order') },
      { icon: DollarSign, label: 'Earnings', color: 'bg-gray-800 hover:bg-gray-900', action: () => navigate('/earnings') }
    ]
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                RentKart
              </h1>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.verified && <Shield className="w-3 h-3 inline text-gray-600 mr-1" />}
                      Verified User
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Manage your rentals and listings from your personalized dashboard
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-600" />
              Personal Information
            </h3>
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium hover:underline"
            >
              Edit Profile
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <p className="text-sm font-medium text-gray-800">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="text-sm font-medium text-gray-800">{user.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                <p className="text-sm font-medium text-gray-800">{user.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('renter')}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'renter'
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              🏠 Renter Dashboard
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'owner'
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              🏢 Owner Dashboard
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions[activeTab].map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white p-6 rounded-2xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200`}
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-3" />
                  <p className="text-sm font-medium">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === 'renter' ? <RenterDashboard /> : <OwnerDashboard />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

