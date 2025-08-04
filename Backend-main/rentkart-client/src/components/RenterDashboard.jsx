import React from 'react';
import { Calendar, Clock, MapPin, Star, Package, TrendingUp } from 'lucide-react';

const RenterDashboard = () => {
  const activeRentals = [
    {
      id: 1,
      item: 'Canon EOS R5 Camera',
      owner: 'Photography Pro',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      dailyRate: 45,
      image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      status: 'active'
    },
    {
      id: 2,
      item: 'MacBook Pro 16"',
      owner: 'Tech Rentals',
      startDate: '2024-01-18',
      endDate: '2024-01-25',
      dailyRate: 35,
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      status: 'active'
    }
  ];

  const recentActivity = [
    { action: 'Returned', item: 'DJI Mavic Air 2', date: '2024-01-10', amount: 180 },
    { action: 'Booked', item: 'Canon EOS R5', date: '2024-01-15', amount: 225 },
    { action: 'Reviewed', item: 'Sony A7III', date: '2024-01-12', rating: 5 }
  ];

  const stats = [
    { label: 'Active Rentals', value: '2', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Spent', value: '$1,245', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Items Rented', value: '12', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg Rating', value: '4.8', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' }
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Rentals */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Active Rentals</h3>
          <div className="space-y-4">
            {activeRentals.map((rental) => (
              <div key={rental.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex space-x-4">
                  <img
                    src={rental.image}
                    alt={rental.item}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{rental.item}</h4>
                    <p className="text-sm text-gray-600 mb-2">by {rental.owner}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {rental.startDate} - {rental.endDate}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        ${rental.dailyRate}/day
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      {activity.action} {activity.item}
                    </p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className="font-semibold text-gray-800">${activity.amount}</p>
                    )}
                    {activity.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm">{activity.rating}</span>
                      </div>
                    )}
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

export default RenterDashboard;
