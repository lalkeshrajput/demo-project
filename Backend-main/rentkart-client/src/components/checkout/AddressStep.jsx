import React, { useState, useEffect } from 'react';
import { Home, Building, Plus, Edit, Trash2, Save, MapPin, User, Mail, Phone } from 'lucide-react';

const AddressStep = ({ 
  shippingInfo, 
  setShippingInfo, 
  errors, 
  selectedAddressId, 
  setSelectedAddressId 
}) => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const addresses = await res.json();
        setSavedAddresses(addresses);
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress && !selectedAddressId) {
          setSelectedAddressId(defaultAddress._id);
        }
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const saveAddress = async () => {
  try {
    const token = localStorage.getItem('token');
    const method = editingAddress ? 'PUT' : 'POST';
    const url = editingAddress
      ? `/api/addresses/${editingAddress._id}`
      : '/api/addresses';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(shippingInfo),
    });

    if (res.ok) {
      const saved = await res.json(); // ✅ response has the address
      setSelectedAddressId(saved._id); // ✅ set it as selected
      fetchSavedAddresses(); // refresh list

      setShowAddressForm(false);
      setEditingAddress(null);
      setShippingInfo({
        fullName: '', email: '', phone: '', address: '', city: '', state: '',
        pincode: '', landmark: '', addressType: 'home', isDefault: false
      });
    }
  } catch (err) {
    console.error('Error saving address:', err);
  }
};


  const deleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchSavedAddresses();
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
      }
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Delivery Address</h3>
      
      {/* Saved Addresses */}
      {savedAddresses.length > 0 && !showAddressForm && (
        <div className="space-y-4 mb-6">
          {savedAddresses.map(address => (
            <div
              key={address._id}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                selectedAddressId === address._id
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => setSelectedAddressId(address._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      selectedAddressId === address._id
                        ? 'border-neutral-900 bg-neutral-900'
                        : 'border-neutral-300'
                    }`}></div>
                    <span className="font-medium text-neutral-900">{address.fullName}</span>
                    {address.addressType === 'home' ? (
                      <Home className="w-4 h-4 text-neutral-500" />
                    ) : (
                      <Building className="w-4 h-4 text-neutral-500" />
                    )}
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600 text-sm">
                    {address.address}, {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-neutral-500 text-sm">{address.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAddress(address);
                      setShippingInfo(address);
                      setShowAddressForm(true);
                    }}
                    className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAddress(address._id);
                    }}
                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Address Button */}
      {!showAddressForm && (
        <button
          onClick={() => setShowAddressForm(true)}
          className="w-full border-2 border-dashed border-neutral-300 rounded-xl p-6 text-neutral-600 hover:border-neutral-400 hover:text-neutral-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Address
        </button>
      )}

      {/* Address Form */}
      {showAddressForm && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                    errors.fullName ? 'border-red-300' : 'border-neutral-200'
                  }`}
                  placeholder="Enter full name"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-neutral-200'
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-neutral-200'
                }`}
                placeholder="Enter email address"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-neutral-400 w-4 h-4" />
              <textarea
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.address ? 'border-red-300' : 'border-neutral-200'
                }`}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.city ? 'border-red-300' : 'border-neutral-200'
                }`}
                placeholder="Enter city"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={shippingInfo.state}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="Enter state"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={shippingInfo.pincode}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.pincode ? 'border-red-300' : 'border-neutral-200'
                }`}
                placeholder="Enter pincode"
              />
              {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Landmark (Optional)
            </label>
            <input
              type="text"
              name="landmark"
              value={shippingInfo.landmark}
              onChange={handleInputChange}
              className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              placeholder="Enter landmark"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="home"
                name="addressType"
                value="home"
                checked={shippingInfo.addressType === 'home'}
                onChange={handleInputChange}
                className="text-neutral-900 focus:ring-neutral-900"
              />
              <label htmlFor="home" className="text-sm text-neutral-700">Home</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="office"
                name="addressType"
                value="office"
                checked={shippingInfo.addressType === 'office'}
                onChange={handleInputChange}
                className="text-neutral-900 focus:ring-neutral-900"
              />
              <label htmlFor="office" className="text-sm text-neutral-700">Office</label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={shippingInfo.isDefault}
              onChange={handleInputChange}
              className="text-neutral-900 focus:ring-neutral-900"
            />
            <label htmlFor="isDefault" className="text-sm text-neutral-700">
              Set as default address
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
                setShippingInfo({
                  fullName: '', email: '', phone: '', address: '', city: '', state: '', 
                  pincode: '', landmark: '', addressType: 'home', isDefault: false
                });
              }}
              className="flex-1 border border-neutral-200 text-neutral-700 py-3 px-4 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveAddress}
              className="flex-1 bg-neutral-900 text-white py-3 px-4 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Address
            </button>
          </div>
        </div>
      )}

      {errors.address && !showAddressForm && (
        <p className="text-red-500 text-sm mt-2">{errors.address}</p>
      )}
    </div>
  );
};

export default AddressStep;