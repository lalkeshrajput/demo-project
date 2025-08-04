import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Star, ShoppingCart, Eye } from 'lucide-react';

const ItemCard = ({ item, handleLike, onAddToCart }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    handleLike(item._id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  const handleRentNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div 
        className="group bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <Link to={`/items/${item._id}`}>
            <div className="relative overflow-hidden">
              <img
                src={item.images?.[0] || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600'}
                alt={item.title}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
          
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Actions Overlay */}
          <div className={`absolute inset-x-4 bottom-4 flex gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-white/90 backdrop-blur-sm text-neutral-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center justify-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <Link
              to={`/items/${item._id}`}
              className="bg-neutral-800/90 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          {/* Availability Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Available
            </span>
          </div>
        </div>

        <div className="p-6">
          <Link to={`/items/${item._id}`}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1 group-hover:text-neutral-700 transition-colors">
                {item.title}
              </h3>
              
              <div className="flex items-center gap-1 text-neutral-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{item.location}</span>
              </div>

              <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                {item.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (item.rating || 4) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  ({item.reviews || 12} reviews)
                </span>
              </div>
            </div>
          </Link>

          {/* Pricing */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-neutral-900">
                ₹{item.pricing?.per_day || item.price}
              </span>
              <span className="text-neutral-600 text-sm ml-1">/day</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-500 text-xs">
              <Calendar className="w-3 h-3" />
              <span>Min 1 day</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleRentNow}
              className="flex-1 bg-neutral-900 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              Rent Now
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2.5 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          {/* Like Count */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-1 text-neutral-500 text-sm">
              <Heart className="w-4 h-4" />
              <span>{item.likes || 0} likes</span>
            </div>
            <span className="text-xs text-neutral-400">
              Listed 2 days ago
            </span>
          </div>
        </div>
      </div>

      {/* Rent Now Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Rent {item.title}
              </h3>
              <p className="text-neutral-600">
                Choose your rental period and confirm booking
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Rental Period
                </label>
                <select className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent">
                  <option>1 Day - ₹{item.pricing?.per_day || item.price}</option>
                  <option>1 Week - ₹{item.pricing?.per_week || (item.price * 7)}</option>
                  <option>1 Month - ₹{item.pricing?.per_month || (item.price * 30)}</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  // Add booking logic here
                }}
                className="flex-1 px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemCard;