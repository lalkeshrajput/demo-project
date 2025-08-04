import React from 'react';
import { Calendar, Clock, Truck, AlertCircle } from 'lucide-react';

const RentalStep = ({ rentalInfo, setRentalInfo, errors, calculateRentalDays }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRentalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Rental Details</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Start Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="date"
                name="startDate"
                value={rentalInfo.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.startDate ? 'border-red-300' : 'border-neutral-200'
                }`}
              />
            </div>
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              End Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="date"
                name="endDate"
                value={rentalInfo.endDate}
                onChange={handleInputChange}
                min={rentalInfo.startDate || new Date().toISOString().split('T')[0]}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.endDate ? 'border-red-300' : 'border-neutral-200'
                }`}
              />
            </div>
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>

        {rentalInfo.startDate && rentalInfo.endDate && (
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-sm text-neutral-600">
              Rental Duration: <span className="font-semibold text-neutral-900">
                {calculateRentalDays()} {calculateRentalDays() === 1 ? 'day' : 'days'}
              </span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Delivery Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <select
                name="deliveryTime"
                value={rentalInfo.deliveryTime}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              >
                <option value="10:00">10:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="18:00">6:00 PM</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Return Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <select
                name="returnTime"
                value={rentalInfo.returnTime}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              >
                <option value="10:00">10:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="18:00">6:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Delivery Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                rentalInfo.deliveryType === 'standard'
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => setRentalInfo(prev => ({ ...prev, deliveryType: 'standard' }))}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  rentalInfo.deliveryType === 'standard'
                    ? 'border-neutral-900 bg-neutral-900'
                    : 'border-neutral-300'
                }`}></div>
                <Truck className="w-5 h-5 text-neutral-600" />
                <div>
                  <p className="font-medium text-neutral-900">Standard Delivery</p>
                  <p className="text-sm text-neutral-600">2-3 business days • ₹99</p>
                </div>
              </div>
            </div>
            
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                rentalInfo.deliveryType === 'express'
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => setRentalInfo(prev => ({ ...prev, deliveryType: 'express' }))}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  rentalInfo.deliveryType === 'express'
                    ? 'border-neutral-900 bg-neutral-900'
                    : 'border-neutral-300'
                }`}></div>
                <Truck className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-neutral-900">Express Delivery</p>
                  <p className="text-sm text-neutral-600">Same day delivery • ₹199</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Special Instructions (Optional)
          </label>
          <div className="relative">
            <AlertCircle className="absolute left-3 top-3 text-neutral-400 w-4 h-4" />
            <textarea
              name="specialInstructions"
              value={rentalInfo.specialInstructions}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              placeholder="Any special delivery instructions..."
              rows={3}
            />
          </div>
        </div>

        {/* Rental Terms */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Rental Terms</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Items must be returned in the same condition</li>
                <li>• Late returns may incur additional charges</li>
                <li>• Security deposit will be refunded after inspection</li>
                <li>• Damage or loss will be charged from security deposit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalStep;