import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Filter, Grid, List } from 'lucide-react';
import ItemCard from '../components/ItemCard';

const CategoryItems = () => {
  const { slug } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const categoryInfo = {
    electronics: {
      name: 'Electronics',
      description: 'Rent the latest gadgets and electronic devices',
      icon: '📱',
      color: 'bg-blue-500'
    },
    furniture: {
      name: 'Furniture',
      description: 'Quality furniture for your home and office',
      icon: '🪑',
      color: 'bg-amber-500'
    },
    vehicles: {
      name: 'Vehicles',
      description: 'Cars, bikes, and other transportation',
      icon: '🚗',
      color: 'bg-green-500'
    },
    tools: {
      name: 'Tools & Equipment',
      description: 'Professional tools and equipment for any job',
      icon: '🔧',
      color: 'bg-orange-500'
    },
    sports: {
      name: 'Sports & Recreation',
      description: 'Sports equipment and recreational gear',
      icon: '⚽',
      color: 'bg-purple-500'
    }
  };

  const currentCategory = categoryInfo[slug] || {
    name: slug?.charAt(0).toUpperCase() + slug?.slice(1),
    description: 'Browse items in this category',
    icon: '📦',
    color: 'bg-neutral-500'
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/items/category/${slug}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch category items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [slug]);

  const handleLike = async (id) => {
    try {
      await fetch(`/api/items/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchItems();
    } catch (err) {
      console.error("Failed to like item:", err);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: item._id,
          quantity: 1
        })
      });
      
      if (res.ok) {
        alert('Item added to cart successfully!');
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.pricing?.per_day || a.price) - (b.pricing?.per_day || b.price);
      case 'price-high':
        return (b.pricing?.per_day || b.price) - (a.pricing?.per_day || a.price);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'popular':
        return (b.likes || 0) - (a.likes || 0);
      default:
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4">
                  <div className="h-56 bg-neutral-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/items"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Items
          </Link>
          
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${currentCategory.color} rounded-2xl flex items-center justify-center text-2xl`}>
              {currentCategory.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">{currentCategory.name}</h1>
              <p className="text-neutral-600 mt-1">{currentCategory.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-neutral-600">
              <Package className="w-5 h-5" />
              <span>{sortedItems.length} items found</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-16">
            <div className={`w-24 h-24 mx-auto mb-6 ${currentCategory.color} rounded-full flex items-center justify-center text-4xl`}>
              {currentCategory.icon}
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No items in {currentCategory.name}
            </h3>
            <p className="text-neutral-600 mb-6">
              Be the first to list an item in this category!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/items"
                className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
              >
                Browse All Items
              </Link>
              <button className="border border-neutral-200 text-neutral-700 px-6 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors">
                List Your Item
              </button>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {sortedItems.map(item => (
              <ItemCard 
                key={item._id} 
                item={item} 
                handleLike={handleLike}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* Category Stats */}
        {sortedItems.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-6 border border-neutral-100">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              {currentCategory.name} Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">{sortedItems.length}</div>
                <div className="text-sm text-neutral-600">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  ₹{Math.min(...sortedItems.map(item => item.pricing?.per_day || item.price || 0))}
                </div>
                <div className="text-sm text-neutral-600">Starting From</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {(sortedItems.reduce((sum, item) => sum + (item.rating || 4), 0) / sortedItems.length).toFixed(1)}
                </div>
                <div className="text-sm text-neutral-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {sortedItems.filter(item => (item.likes || 0) > 5).length}
                </div>
                <div className="text-sm text-neutral-600">Popular Items</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItems;
