import React from 'react';
import { Package, DollarSign, Eye, Calendar, TrendingUp, Star, Clock, MapPin } from 'lucide-react';

const OwnerDashboard = () => {
  const myListings = [
    {
      id: 1,
      title: 'Professional DSLR Camera',
      category: 'Photography',
      dailyRate: 45,
      weeklyRate: 280,
      monthlyRate: 1000,
      image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      status: 'available',
      views: 156,
      bookings: 8
    },
    {
      id: 2,
      title: 'Gaming Laptop RTX 4080',
      category: 'Electronics',
      dailyRate: 55,
      weeklyRate: 350,
      monthlyRate: 1200,
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      status: 'rented',
      views: 203,
      bookings: 12
    },
    {
      id: 3,
      title: 'Mountain Bike - Trek',
      category: 'Sports',
      dailyRate: 25,
      weeklyRate: 150,
      monthlyRate: 500,
      image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      status: 'available',
      views: 89,
      bookings: 5
    }
  ];

  const recentBookings = [
    {
      id: 1,
      item: 'Professional DSLR Camera',
      renter: 'Sarah Johnson',
      startDate: '2024-01-20',
      endDate: '2024-01-25',
      amount: 225,
      status: 'confirmed'
    },
    {
      id: 2,
      item: 'Gaming Laptop RTX 4080',
      renter: 'Mike Chen',
      startDate: '2024-01-18',
      endDate: '2024-01-28',
      amount: 550,
      status: 'active'
    }
  ];

  const stats = [
    { label: 'Total Listings', value: '3', icon: Package, color: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'Monthly Earnings', value: '$1,850', icon: DollarSign, color: 'text-gray-700', bg: 'bg-gray-100' },
    { label: 'Total Views', value: '448', icon: Eye, color: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'Avg Rating', value: '4.9', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-gray-100 text-gray-800';
      case 'rented':
        return 'bg-gray-200 text-gray-900';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-gray-100 text-gray-800';
      case 'active':
        return 'bg-gray-200 text-gray-900';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Listings */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">My Listings</h3>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Add New Item
            </button>
          </div>
          <div className="space-y-4">
            {myListings.map((listing) => (
              <div key={listing.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex space-x-4">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{listing.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{listing.category}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>${listing.dailyRate}/day</span>
                      <span>${listing.weeklyRate}/week</span>
                      <span>${listing.monthlyRate}/month</span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {listing.views} views
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {listing.bookings} bookings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800 text-sm">{booking.item}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getBookingStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">by {booking.renter}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {booking.startDate} - {booking.endDate}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      ${booking.amount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;