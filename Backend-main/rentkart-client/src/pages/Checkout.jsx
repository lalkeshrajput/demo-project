import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Shield
} from 'lucide-react';
import CheckoutNavbar from '../components/CheckoutNavbar';
import AddressStep from '../components/checkout/AddressStep';
import RentalStep from '../components/checkout/RentalStep';
import PaymentStep from '../components/checkout/PaymentStep';
import ConfirmationStep from '../components/checkout/ConfirmationStep';

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '',
    pincode: '', landmark: '', addressType: 'home', isDefault: false
  });

  const [rentalInfo, setRentalInfo] = useState({
    startDate: '', endDate: '', deliveryTime: '10:00', returnTime: '10:00',
    specialInstructions: '', deliveryType: 'standard'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '', expiryDate: '', cvv: '', cardholderName: ''
  });

  const [upiInfo, setUpiInfo] = useState({ upiId: '' });
  const [walletInfo, setWalletInfo] = useState({ walletType: 'paytm' });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    fetchCart();
    fetchSavedAddresses();
  }, []);


  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/cart/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const calculateRentalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };
  const getUnitPricePerDay = (item) => {
    if (item.rental_type === 'per_week') return item.price / 7;
    if (item.rental_type === 'per_month') return item.price / 30;
    return item.price; // assume per_day or fallback
  };


  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const days = calculateRentalDays(item.rental_start_date, item.rental_end_date);
      const perDayPrice = getUnitPricePerDay(item);
      return acc + perDayPrice * item.quantity * days;
    }, 0);
  };




  const calculateTax = (subtotal) => Math.round(subtotal * 0.18);
  const calculateDeliveryFee = () => rentalInfo.deliveryType === 'express' ? 199 : 99;
  const calculateSecurityDeposit = (subtotal) => Math.round(subtotal * 0.2);

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + calculateTax(subtotal) + calculateDeliveryFee() + calculateSecurityDeposit(subtotal);
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!selectedAddressId) {
        newErrors.address = 'Please select or add a delivery address';
      }
    }
    // } else if (currentStep === 2) {
    //   if (!rentalInfo.startDate) newErrors.startDate = 'Start date required';
    //   if (!rentalInfo.endDate) newErrors.endDate = 'End date required';
    //   if (new Date(rentalInfo.startDate) >= new Date(rentalInfo.endDate)) {
    //     newErrors.endDate = 'End date must be after start date';
    //   }
    // } 
    else if (currentStep === 3) {
      if (paymentMethod === 'card') {
        if (!cardInfo.cardNumber) newErrors.cardNumber = 'Card number required';
        if (!cardInfo.expiryDate) newErrors.expiryDate = 'Expiry date required';
        if (!cardInfo.cvv) newErrors.cvv = 'CVV required';
        if (!cardInfo.cardholderName) newErrors.cardholderName = 'Cardholder name required';
      } else if (paymentMethod === 'upi') {
        if (!upiInfo.upiId) newErrors.upiId = 'UPI ID required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/addresses/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSavedAddresses(data);
      } else {
        console.warn('Unexpected address response:', data);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };


  const handlePlaceOrder = async () => {
    if (!validateStep()) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');

      const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
      const user = JSON.parse(localStorage.getItem('user'));

      // ✅ Prevent self-rental
      // const selfOwnedItem = cartItems.find(item => item.owner_id === user._id);
      // if (selfOwnedItem) {
      //   alert(`❌ You cannot rent your own item: "${selfOwnedItem.title}". Please remove it from cart.`);
      //   setProcessing(false);
      //   return;
      // }
      const orderData = {
        items: cartItems.map(item => ({
          item_id: item.item_id,
          // owner_id: item.owner_id,
          quantity: item.quantity,
          rentalPeriod: 'day',
          startDate: rentalInfo.startDate,
          endDate: rentalInfo.endDate
        })),
        shippingAddress: selectedAddress,
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod.toUpperCase()

      };
      console.log("🛒 Sending order items:", cartItems.map(item => ({
        item_id: item.item_id,
        quantity: item.quantity
      })));


      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const result = await res.json();
        setOrderId(result.order._id);
        setOrderDetails({
          itemCount: cartItems.length,
          startDate: rentalInfo.startDate,
          endDate: rentalInfo.endDate,
          deliveryAddress: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
          paymentMethod: paymentMethod.toUpperCase(),
          total: calculateTotal()
        });
        setOrderConfirmed(true);
        setCurrentStep(4);

        await fetch('/api/users/cart/clear', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };


  const updateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/cart/update/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
      });
      setCartItems(prev => prev.map(item =>
        item._id === itemId ? { ...item, quantity: newQty } : item
      ));
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const steps = [
    { number: 1, title: 'Delivery Address' },
    { number: 2, title: 'Rental Details' },
    { number: 3, title: 'Payment' },
    { number: 4, title: 'Confirmation' }
  ];

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <CheckoutNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ConfirmationStep orderId={orderId} orderDetails={orderDetails} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <CheckoutNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const isActive = currentStep >= step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${isActive
                    ? 'bg-neutral-900 border-neutral-900 text-white'
                    : 'border-neutral-300 text-neutral-400'
                    }`}>
                    <span className="font-medium">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-0.5 mx-2 transition-all ${currentStep > step.number ? 'bg-neutral-900' : 'bg-neutral-300'
                      }`}></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              {steps[currentStep - 1]?.title}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <AddressStep
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
                errors={errors}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
              />
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Rental Details (Read Only)</h3>
                {cartItems.length === 0 ? (
                  <p className="text-neutral-600">No items in cart</p>) : (
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-neutral-900">{item.title}</h4>
                            <p className="text-sm text-neutral-600">
                              Start: <strong>{item.rental_start_date?.slice(0, 10)}</strong> <br />
                              End: <strong>{item.rental_end_date?.slice(0, 10)}</strong> <br />
                              Duration:{' '}
                              <strong>{calculateRentalDays(item.rental_start_date, item.rental_end_date)} day(s)</strong>
                            </p>
                          </div>
                          <img
                            src={item.images?.[0]}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {currentStep === 3 && (
              <PaymentStep
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                cardInfo={cardInfo}
                setCardInfo={setCardInfo}
                upiInfo={upiInfo}
                setUpiInfo={setUpiInfo}
                walletInfo={walletInfo}
                setWalletInfo={setWalletInfo}
                errors={errors}
              />
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 sticky top-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://via.placeholder.com/300x200'}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 text-sm truncate">{item.title}</p>
                      <p className="text-neutral-600 text-xs">Qty: {item.quantity}</p>
                      <p className="text-neutral-600 text-xs">
                        {item.rental_start_date?.slice(0, 10)} to {item.rental_end_date?.slice(0, 10)}
                      </p>
                      <p className="text-neutral-500 text-xs">
                        Duration: {calculateRentalDays(item.rental_start_date, item.rental_end_date)} day(s)
                      </p>

                    </div>
                    <div className="text-right">
                      <p className="font-medium text-neutral-900 text-sm">
                        ₹{(getUnitPricePerDay(item) * item.quantity * calculateRentalDays(item.rental_start_date, item.rental_end_date)).toLocaleString()}
                      </p>

                      <p className="text-neutral-500 text-xs">
                        ₹{item.price}/{
                          item.rental_type === 'per_day'
                            ? 'day'
                            : item.rental_type === 'per_week'
                              ? 'week'
                              : item.rental_type === 'per_month'
                                ? 'month'
                                : ''
                        }
                      </p>

                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax (10%)</span>
                  <span>₹{calculateTax(calculateSubtotal()).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Fee</span>
                  <span>₹{calculateDeliveryFee()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Security Deposit</span>
                  <span>₹{calculateSecurityDeposit(calculateSubtotal()).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-neutral-900 border-t border-neutral-200 pt-3">
                  <span>Total</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Secure Payment</p>
                    <p className="text-xs text-green-700">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Place Order
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export default Checkout;


