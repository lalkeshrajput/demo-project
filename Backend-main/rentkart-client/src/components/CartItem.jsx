import React, { useState } from 'react';
import { Trash2, Minus, Plus, Calendar, Package } from 'lucide-react';



const CartItem = ({ item, onDelete, onQuantityChange, onDateChange }) => {
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [checking, setChecking] = useState(false);
  const token = localStorage.getItem('token');

  const getItemId = () => {
    return item?.item?._id || item?._id || null;
  };

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1) {
      onQuantityChange(item.cartItemId || item._id, newQty); // ✅ use correct cart subdoc ID
    }
  };


  const checkAvailability = async (startDate, endDate) => {
    const itemId = getItemId();

    if (!itemId || !startDate || !endDate) return;

    try {
      setChecking(true);
      const res = await fetch('/api/items/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: itemId,
          rental_start_date: startDate,
          rental_end_date: endDate,
        }),
      });

      const data = await res.json();
      setAvailabilityMessage(data.message);
    } catch (err) {
      console.error("❌ Availability Error:", err);
      setAvailabilityMessage('Error checking availability');
    } finally {
      setChecking(false);
    }
  };

  const handleStartDateChange = (e) => {
    const date = e.target.value;
    onDateChange(item._id, 'rental_start_date', date);
    checkAvailability(date, item.rental_end_date);
  };

  const handleEndDateChange = (e) => {
    const date = e.target.value;
    onDateChange(item._id, 'rental_end_date', date);
    checkAvailability(item.rental_start_date, date);
  };

  const handleInputBlur = (e) => {
    const newQty = parseInt(e.target.value);
    if (newQty > 0) {
      onQuantityChange(item._id, newQty);
    } else {
      e.target.value = item.quantity.toString();
    }
  };

  const getAutoEndDate = (startDate, rentalType) => {
    if (!startDate || !rentalType) return '';
    const start = new Date(startDate);
    let daysToAdd = 1;
    if (rentalType === 'per_week') daysToAdd = 7;
    else if (rentalType === 'per_month') daysToAdd = 30;
    const end = new Date(start);
    end.setDate(start.getDate() + daysToAdd);
    return end.toISOString().split('T')[0];
  };


  const calculateRentalDays = () => {
    if (item.rental_start_date && item.rental_end_date) {
      const startDate = new Date(item.rental_start_date);
      const endDate = new Date(item.rental_end_date);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 1;
  };

  const rentalDays = calculateRentalDays();
  const unitPrice = item.pricing?.[item.rental_type] || item.price || 0;
  let durationMultiplier = 1;

  if (item.rental_type === 'per_day') {
    durationMultiplier = rentalDays;
  } else if (item.rental_type === 'per_week') {
    durationMultiplier = Math.ceil(rentalDays / 7);
  } else if (item.rental_type === 'per_month') {
    durationMultiplier = Math.ceil(rentalDays / 30);
  }

  const totalPrice = unitPrice * item.quantity * durationMultiplier;



  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
            {item.image || item.images?.[0] ? (
              <img
                src={item.image || item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            {/* Left Section - Product Info */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Rental Period */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Rental Period
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={item.rental_start_date ? item.rental_start_date.slice(0, 10) : ''}
                      onChange={(e) => {
                        const startDate = e.target.value;
                        const autoEndDate = getAutoEndDate(startDate, item.rental_type);
                        onDateChange(item._id, 'rental_start_date', startDate);
                        onDateChange(item._id, 'rental_end_date', autoEndDate);
                        checkAvailability(startDate, autoEndDate);
                      }}


                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={item.rental_end_date ? item.rental_end_date.slice(0, 10) : ''}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-not-allowed"
                    />

                  </div>
                </div>
                {rentalDays > 1 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Duration: {rentalDays} day{rentalDays > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {availabilityMessage && (
                <p
                  className={`text-sm mt-2 ${availabilityMessage.includes('not') ? 'text-red-600' : 'text-green-600'
                    }`}
                >
                  {checking ? 'Checking availability...' : availabilityMessage}
                </p>
              )}

              {/* Price Information */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{totalPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    ₹{unitPrice}/{item.rental_type?.replace('per_', '') || 'day'} × {item.quantity} item{item.quantity > 1 ? 's' : ''}
                    {item.rental_type === 'per_day' && (
                      <> × {rentalDays} day{rentalDays > 1 ? 's' : ''}</>
                    )}
                    {item.rental_type === 'per_week' && (
                      <> × {Math.ceil(rentalDays / 7)} week{Math.ceil(rentalDays / 7) > 1 ? 's' : ''}</>
                    )}
                    {item.rental_type === 'per_month' && (
                      <> × {Math.ceil(rentalDays / 30)} month{Math.ceil(rentalDays / 30) > 1 ? 's' : ''}</>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex flex-row lg:flex-col gap-4 lg:items-end">
              {/* Quantity Controls */}
              <div className="flex flex-col items-center lg:items-end">
                <label className="text-xs font-medium text-gray-600 mb-2">
                  Quantity
                </label>
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                  <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    onBlur={handleInputBlur}
                    min="1"
                    className="w-16 text-center py-2 bg-transparent border-none focus:outline-none text-gray-900 font-medium"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Remove Button */}
              <div className="flex flex-col items-center lg:items-end">
                <label className="text-xs font-medium text-gray-600 mb-2 opacity-0">
                  Remove
                </label>
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-3 rounded-lg transition-all duration-200 group"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

