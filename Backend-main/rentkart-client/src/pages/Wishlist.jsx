import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';

const Wishlist = () => {
  const [items, setItems] = useState([]);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get('/api/wishlist', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(res.data);
  };

  const removeFromWishlist = async (itemId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/api/wishlist/remove/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(items.filter(item => item._id !== itemId));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Wishlist</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map(item => (
            <div key={item._id} className="bg-white border rounded-xl shadow-md p-4 relative">
              <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4" />
                  <span>4.8</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.location}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">₹{item.pricing.per_day}/day</span>
                <button onClick={() => removeFromWishlist(item._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
