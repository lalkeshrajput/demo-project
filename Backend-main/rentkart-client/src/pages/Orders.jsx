import React, { useState, useEffect, useMemo } from 'react';
import {
  Package, Truck, CheckCircle, Clock, X, Search, Eye,
  Calendar, MapPin, Phone, Mail, AlertCircle, Star,
  Download, MessageCircle, RotateCcw, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderHeader from '../components/OrderHeader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, filterStatus, searchQuery, sortBy]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const isLoggedIn = !!localStorage.getItem('token'); // optional

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load orders');

      // Normalize and map structure
      const formatted = data.map(order => ({
        id: order._id,
        createdAt: order.createdAt,
        total: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod || 'COD',
        items: order.items.map(item => ({
          _id: item.item_id._id,
          title: item.item_id.title,
          description: item.item_id.description,
          images: item.item_id.images || [],
          pricing: item.item_id.pricing || {},
          quantity: item.quantity,
          rental_start_date: item.startDate,  // ✅ use correct key
          rental_end_date: item.endDate
        })),
      }));


      setOrders(formatted);
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleExport = () => {
    // Optional: implement real CSV/Excel export later
    console.log('Export clicked');
  };

  const orderStats = useMemo(() => {
    const now = new Date();
    const activeRentals = orders.filter(order => {
      return order.items.some(item => {
        const startDate = new Date(item.rental_start_date);
        const endDate = new Date(item.rental_end_date);
        return startDate <= now && endDate >= now && order.status === 'delivered';
      });
    });

    const upcomingRentals = orders.filter(order => {
      return order.items.some(item => {
        const startDate = new Date(item.rental_start_date);
        return startDate > now && (order.status === 'confirmed' || order.status === 'shipped');
      });
    });

    return {
      total: orders.length,
      active: activeRentals.length,
      upcoming: upcomingRentals.length,
      completed: orders.filter(o => o.status === 'returned').length,
    };
  }, [orders]);

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'rental-start':
          const aStart = Math.min(...a.items.map(item => new Date(item.rental_start_date)));
          const bStart = Math.min(...b.items.map(item => new Date(item.rental_start_date)));
          return aStart - bStart;
        default: return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'returned': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      case 'returned': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusMessage = (order) => {
    const now = new Date();
    const startDate = new Date(Math.min(...order.items.map(item => new Date(item.rental_start_date))));
    const endDate = new Date(Math.max(...order.items.map(item => new Date(item.rental_end_date))));

    switch (order.status) {
      case 'confirmed':
        const daysUntilStart = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
        return daysUntilStart > 0 ? `Rental starts in ${daysUntilStart} days` : 'Rental starting soon';
      case 'shipped':
        return order.estimatedDelivery
          ? `Expected delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}`
          : 'On the way to you';
      case 'delivered':
        const daysUntilReturn = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        if (daysUntilReturn > 0) {
          return `Return in ${daysUntilReturn} days`;
        } else if (daysUntilReturn === 0) {
          return 'Return today';
        } else {
          return 'Return overdue';
        }
      case 'returned':
        return 'Rental completed';
      case 'cancelled':
        return 'Order cancelled';
      default:
        return '';
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
    setShowTrackingModal(true);
  };

  const handleContactVendor = (order) => {
    // Implementation for contacting vendor
    console.log('Contacting vendor for order:', order.id);
  };

  const handleRentAgain = (order) => {
    // Navigate to product pages with the same items
    console.log('Rent again:', order.id);
  };

  const handleReportIssue = (order) => {
    // Implementation for reporting issues
    console.log('Reporting issue for order:', order.id);
  };

  const getRentalDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-gray-200 border-t-gray-600 rounded-full mx-auto" />
          <p className="text-gray-600">Loading your rentals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Order Header with search/filter/export */}
      <OrderHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onExport={handleExport}
        isLoggedIn={isLoggedIn}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rentals</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.active}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{orderStats.upcoming}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{orderStats.completed}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <Package className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}


        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rentals found</h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0
                ? "You haven't rented anything yet. Start exploring!"
                : "Try adjusting your filters to see more rentals."
              }
            </p>
            {orders.length === 0 && (
              <button
                onClick={() => navigate('/items')}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Browse Items
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  {console.log('🔍 Order:', order)}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
                      <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                      <p className="text-sm text-blue-600 mt-1">{getStatusMessage(order)}</p>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map(item => {
                      console.log("🧾 Order Item:", item);
                      return (
                        <div key={item._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.images?.[0] || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=100'}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />

                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.title || 'Item not found'}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <div className="flex gap-4 text-xs text-gray-500 mt-1">
                              <span>From:{ new Date(item.rental_start_date).toLocaleDateString('en-IN')}</span>
                              <span> To: {item.rental_end_date ? new Date(item.rental_end_date).toLocaleDateString('en-IN') : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}




                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                      <span className="text-sm text-gray-600">via {order.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(order.status === 'shipped' || order.status === 'delivered') && (
                        <button
                          onClick={() => handleTrackOrder(order)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Track Order"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleContactVendor(order)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Contact Vendor"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      {order.status === 'returned' && (
                        <button
                          onClick={() => handleRentAgain(order)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Rent Again"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOrderClick(order)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.id.slice(-8)}</h2>
                    <p className="text-gray-600">{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </div>
                    <p className="text-sm text-blue-600 mt-1">{getStatusMessage(selectedOrder)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Payment Method</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                {/* Rental Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map(item => (
                      <div key={item._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.images?.[0] || 'https://images.pexels.com/photos/441794/pexels-photo-441794.jpeg'}
                          alt={item.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>From: {new Date(item.rental_start_date).toLocaleDateString()}</span>
                            <span>To: {new Date(item.rental_end_date).toLocaleDateString()}</span>
                            <span>Duration: {getRentalDuration(item.rental_start_date, item.rental_end_date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleContactVendor(selectedOrder)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Vendor
                  </button>
                  {selectedOrder.status === 'delivered' && (
                    <button
                      onClick={() => handleReportIssue(selectedOrder)}
                      className="flex-1 px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Report Issue
                    </button>
                  )}
                  {selectedOrder.status === 'returned' && (
                    <button
                      onClick={() => handleRentAgain(selectedOrder)}
                      className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Rent Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Modal */}
        {showTrackingModal && trackingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Track Order</h2>
                  <button
                    onClick={() => setShowTrackingModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Order #{trackingOrder.id.slice(-8)}</p>
                    {trackingOrder.trackingNumber && (
                      <p className="text-sm font-medium text-gray-900">Tracking: {trackingOrder.trackingNumber}</p>
                    )}
                  </div>

                  {/* Tracking Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order Confirmed</p>
                        <p className="text-sm text-gray-600">{new Date(trackingOrder.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {trackingOrder.status !== 'confirmed' && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Truck className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Shipped</p>
                          <p className="text-sm text-gray-600">On the way to you</p>
                        </div>
                      </div>
                    )}

                    {trackingOrder.status === 'delivered' && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Delivered</p>
                          <p className="text-sm text-gray-600">Rental period active</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {trackingOrder.estimatedDelivery && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Estimated Delivery</p>
                      <p className="text-sm text-blue-700">{new Date(trackingOrder.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

