import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Star,
  Heart,
  Share2,
  Shield,
  Clock,
  User,
  MessageCircle,
  ShoppingCart,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/items/${id}`);
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error("Failed to fetch item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const getAutoEndDate = (startDate, rentalType) => {
    if (!startDate || !rentalType) return '';
    const start = new Date(startDate);
    let daysToAdd = 1;
    if (rentalType === 'day') daysToAdd = 1;
    else if (rentalType === 'week') daysToAdd = 7;
    else if (rentalType === 'month') daysToAdd = 30;
    const end = new Date(start);
    end.setDate(start.getDate() + daysToAdd);
    return end.toISOString().split('T')[0];
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const checkRes = await fetch('/api/items/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: item._id,
          rental_start_date: startDate,
          rental_end_date: endDate,
        }),
      });

      const checkData = await checkRes.json();
      alert(checkData.message);
      if (!checkData.available) {
        alert(checkData.message || 'Item not available for selected dates');
        return;
      }
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          item_id: item._id,                         // ✅ CORRECT key
          quantity: quantity,
          rental_type: `per_${selectedPeriod}`,      // ✅ per_day / per_week / per_month
          rental_start_date: startDate,
          rental_end_date: endDate
        })
      });


      if (res.ok) {
        alert('Item added to cart successfully!');
      } else {
        alert('Failed to add to cart');
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };
  const ownerSince = item?.owner_id?.createdAt
    ? new Date(item.owner_id.createdAt).getFullYear()
    : '2022';

  const calculatePrice = () => {
    const basePrice = item?.pricing?.[`per_${selectedPeriod}`] || item?.price || 0;
    return basePrice * quantity;
  };

  const features = [
    { icon: Shield, text: "Verified Owner" },
    { icon: CheckCircle, text: "Quality Guaranteed" },
    { icon: Clock, text: "24/7 Support" },
    { icon: AlertCircle, text: "Damage Protection" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-neutral-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-32 bg-neutral-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Item not found</h2>
          <p className="text-neutral-600 mb-6">The item you're looking for doesn't exist.</p>
          <Link
            to="/items"
            className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Browse All Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/items"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Items
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <Carousel
                showThumbs={true}
                infiniteLoop
                autoPlay
                showStatus={false}
                className="rounded-2xl overflow-hidden"
              >
                {item.images?.map((img, index) => (
                  <div key={index} className="h-[500px]">
                    <img
                      src={img}
                      alt={`${item.title} - Image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )) || (
                    <div className="h-[500px]">
                      <img
                        src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
              </Carousel>

              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all ${isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-neutral-600 hover:bg-white'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-full bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-neutral-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Header Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">{item.title}</h1>
                  <div className="flex items-center gap-4 text-neutral-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{item.rating || 4.5}</span>
                      <span className="text-sm">({item.reviews || 12} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    Available
                  </span>
                </div>
              </div>

              <p className="text-neutral-700 leading-relaxed">{item.description}</p>
            </div>

            {/* Owner Info */}
            {item.owner_id ? (
              <div className="bg-white rounded-xl p-6 border border-neutral-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      Owner: {item?.owner?.name || 'Unknown'}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Joined: {item?.owner?.createdAt ? new Date(item.owner.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-neutral-100 text-neutral-700 py-2 px-4 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact Owner
                </button>
              </div>
            ) : (
              <div className="text-neutral-500 text-sm">Loading owner info...</div>
            )}


            {/* Pricing & Booking */}
            <div className="bg-white rounded-xl p-6 border border-neutral-100 sticky top-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Rental Options</h3>

                {/* Period Selection */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['day', 'week', 'month'].map(period => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`p-3 rounded-lg border text-center transition-all ${selectedPeriod === period
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                    >
                      <div className="text-sm font-medium capitalize">{period}</div>
                      <div className="text-xs opacity-75">
                        ₹{item.pricing?.[`per_${period}`] || item.price} × {quantity} {period}(s)
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        const selectedStart = e.target.value;
                        const autoEnd = getAutoEndDate(selectedStart, selectedPeriod);
                        setStartDate(selectedStart);
                        setEndDate(autoEnd);
                      }}

                      className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t border-neutral-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-600">
                    ₹{item.pricing?.[`per_${selectedPeriod}`] || item.price} × {quantity} {selectedPeriod}(s)
                  </span>
                  <span className="font-medium">₹{calculatePrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-600">Service fee</span>
                  <span className="font-medium">₹{Math.round(calculatePrice() * 0.1).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-neutral-200 pt-2">
                  <span>Total</span>
                  <span>₹{Math.round(calculatePrice() * 1.1).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-neutral-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Book Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full border border-neutral-200 text-neutral-700 py-3 px-4 rounded-lg font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Confirm Booking
              </h3>
              <p className="text-neutral-600">
                Review your booking details before confirming
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 mb-2">{item.title}</h4>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p>Period: {quantity} {selectedPeriod}(s)</p>
                  <p>Start: {startDate}</p>
                  <p>End: {endDate}</p>
                  <p className="font-medium text-neutral-900">Total: ₹{Math.round(calculatePrice() * 1.1).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  try {

                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/cart/add', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        item_id: item._id,                         // ✅ CORRECT key
                        quantity: quantity,
                        rental_type: `per_${selectedPeriod}`,      // ✅ per_day / per_week / per_month
                        rental_start_date: startDate,
                        rental_end_date: endDate
                      })
                    });


                    if (res.ok) {
                      window.location.href = '/cart';
                    } else {
                      alert("Failed to add to cart");
                    }
                  } catch (err) {
                    console.error("Error adding to cart:", err);
                  }
                }}
                className="flex-1 px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
              >
                Confirm Booking
              </button>


            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;


