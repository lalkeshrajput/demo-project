import React, { useState, useEffect } from 'react';
import {
  Edit3,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  Package,
  MoreVertical,
  Clock,
  AlertCircle,
  Search,
  Filter,
  SortDesc,
  Eye,
  Copy,
  TrendingUp,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MyListings = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stats, setStats] = useState({
    totalItems: 0,
    availableItems: 0,
    totalViews: 0,
    totalBookings: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchQuery, sortBy, filterCategory, filterStatus]);

  const fetchUserItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items/owner', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();
      
      if (Array.isArray(data)) {
        setItems(data);
        calculateStats(data);
      } else if (Array.isArray(data.items)) {
        setItems(data.items);
        calculateStats(data.items);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (itemsData) => {
    const totalItems = itemsData.length;
    const availableItems = itemsData.filter(item => item.isAvailable).length;
    const totalViews = itemsData.reduce((sum, item) => sum + (item.views || 0), 0);
    const totalBookings = itemsData.reduce((sum, item) => sum + (item.bookings || 0), 0);

    setStats({
      totalItems,
      availableItems,
      totalViews,
      totalBookings
    });
  };

  const filterAndSortItems = () => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category?.title === filterCategory);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => 
        filterStatus === 'available' ? item.isAvailable : !item.isAvailable
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return (b.pricing?.per_day || 0) - (a.pricing?.per_day || 0);
        case 'price-low':
          return (a.pricing?.per_day || 0) - (b.pricing?.per_day || 0);
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const updatedItems = items.filter(i => i._id !== id);
      setItems(updatedItems);
      calculateStats(updatedItems);
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const res = await fetch(`/api/items/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isAvailable: !item.isAvailable })
      });
      const updated = await res.json();
      const updatedItems = items.map(i => i._id === updated._id ? updated : i);
      setItems(updatedItems);
      calculateStats(updatedItems);
    } catch (err) {
      setError('Failed to update availability');
    }
  };

  const handleDuplicate = async (item) => {
    try {
      const duplicatedItem = {
        ...item,
        title: `${item.title} (Copy)`,
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined
      };

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(duplicatedItem)
      });

      const newItem = await res.json();
      const updatedItems = [newItem, ...items];
      setItems(updatedItems);
      calculateStats(updatedItems);
    } catch (err) {
      setError('Failed to duplicate item');
    }
  };

  const handleAddItemClick = () => {
    navigate('/add-item');
  };

  const handleEdit = (item) => {
    navigate(`/edit-item/${item._id}`);
  };

  const openImageModal = (item, index = 0) => {
    setSelectedItem(item);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction) => {
    if (!selectedItem?.images) return;
    
    const maxIndex = selectedItem.images.length - 1;
    if (direction === 'next') {
      setCurrentImageIndex(currentImageIndex === maxIndex ? 0 : currentImageIndex + 1);
    } else {
      setCurrentImageIndex(currentImageIndex === 0 ? maxIndex : currentImageIndex - 1);
    }
  };

  const getStatusColor = (item) => {
    if (!item.isAvailable) return 'bg-red-100 text-red-700';
    if (item.isRented) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (item) => {
    if (!item.isAvailable) return 'Unavailable';
    if (item.isRented) return 'Rented';
    return 'Available';
  };

  const categories = [...new Set(items.map(item => item.category?.title).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onAddItemClick={handleAddItemClick} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddItemClick={handleAddItemClick} />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
            <p className="text-gray-600">Manage your rental items and track performance</p>
          </div>
          <button
            onClick={handleAddItemClick}
            className="mt-4 lg:mt-0 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Item</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableItems}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="popularity">Most Popular</option>
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {items.length === 0 ? 'No listings yet' : 'No items match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {items.length === 0 
                ? 'Start by adding your first item to rent out'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {items.length === 0 && (
              <button
                onClick={handleAddItemClick}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Item</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden">
                {/* Image Section */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <div className="relative w-full h-full">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => openImageModal(item, 0)}
                      />
                      {item.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                          +{item.images.length - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item)}`}>
                    {getStatusText(item)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
                    <div className="relative">
                      <button className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{item.location || 'Location not set'}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="font-medium text-gray-900">₹{item.pricing?.per_day || 0}/day</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Eye className="w-4 h-4 mr-2" />
                      <span>{item.views || 0} views</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                        item.isAvailable
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDuplicate(item)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {selectedItem.images && selectedItem.images.length > 0 && (
              <img
                src={selectedItem.images[currentImageIndex]}
                alt={`${selectedItem.title} - Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
            
            {selectedItem.images && selectedItem.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {selectedItem.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
