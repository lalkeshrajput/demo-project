// ...your imports remain the same
import React, { useEffect, useState } from 'react';
import {
  Package, User, Calendar, MapPin, Phone, Mail, Clock,
  CheckCircle, XCircle, AlertTriangle, Filter, Search, Download,
  TrendingUp, DollarSign, Eye, MessageCircle, Star, MoreVertical
} from 'lucide-react';
import OwnerOrdersHeader from '../components/OwnerOrdersHeader';

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeRentals: 0
  });

  const statusConfig = {
    Pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    Approved: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
    Delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: Package },
    'Return Requested': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: AlertTriangle },
    Returned: { color: 'bg-neutral-100 text-neutral-800 border-neutral-200', icon: CheckCircle },
    Cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
  };

  useEffect(() => {
    fetchOwnerOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const fetchOwnerOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders/owner', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      calculateStats(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const stats = {
      totalOrders: ordersData.length,
      pendingOrders: ordersData.filter(o => o.status === 'Pending').length,
      totalRevenue: ordersData.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      activeRentals: ordersData.filter(o => o.status === 'Delivered').length
    };
    setStats(stats);
  };

  const filterOrders = () => {
    let filtered = [...orders];
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item =>
          item.item_id?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      filtered = filtered.filter(order =>
        new Date(order.createdAt) >= filterDate
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(prev =>
          prev.map(o =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
        alert(`Order status updated to "${newStatus}"`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Something went wrong!');
    }
  };

  const handleContactRenter = (order) => {
    const message = `Hi ${order.user?.name}, regarding your rental request for ${order.items?.[0]?.item_id?.title}...`;
    window.open(`mailto:${order.user?.email}?subject=Rental Request&body=${encodeURIComponent(message)}`);
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Renter', 'Item', 'Status', 'Amount', 'Date'].join(','),
      ...filteredOrders.map(order => [
        order._id?.slice(-8),
        order.user?.name,
        order.items?.[0]?.item_id?.title,
        order.status,
        order.totalAmount,
        new Date(order.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owner-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-50">
      <OwnerOrdersHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onExport={exportOrders}
        isLoggedIn={!!localStorage.getItem('token')}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No orders found</h3>
          </div>
        ) : (
          filteredOrders.map(order => {
            const status = statusConfig[order.status] || statusConfig.Pending;
            const StatusIcon = status.icon;

            return (
              <div key={order._id} className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{order.user?.name}</h3>
                    <p className="text-sm text-gray-500">{order.user?.email} | {order.user?.phone}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-sm border ${status.color} flex items-center gap-2`}>
                    <StatusIcon className="w-4 h-4" />
                    {order.status}
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <img
                        src={item.item_id?.images?.[0] || 'https://via.placeholder.com/64'}
                        alt={item.item_id?.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{item.item_id?.title}</h4>
                        <p className="text-sm text-gray-600">
                          {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'} - {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <MapPin className="inline w-4 h-4 mr-1 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">₹{order.totalAmount?.toLocaleString()}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleContactRenter(order)}
                      className="text-blue-600 underline"
                    >
                      Contact
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="px-3 py-1 border rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Return Requested">Return Requested</option>
                      <option value="Returned">Returned</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OwnerOrders;


