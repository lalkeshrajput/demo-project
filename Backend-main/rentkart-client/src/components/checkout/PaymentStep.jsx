import React from 'react';
import { CreditCard, Smartphone, Wallet, Banknote, Shield, AlertCircle } from 'lucide-react';

const PaymentStep = ({ 
  paymentMethod, 
  setPaymentMethod, 
  cardInfo, 
  setCardInfo, 
  upiInfo, 
  setUpiInfo, 
  walletInfo, 
  setWalletInfo, 
  errors 
}) => {
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Rupay' },
    { id: 'upi', name: 'UPI Payment', icon: Smartphone, description: 'Pay using UPI ID' },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet, description: 'Paytm, PhonePe, Google Pay' },
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when delivered' }
  ];

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleUpiChange = (e) => {
    const { name, value } = e.target;
    setUpiInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleWalletChange = (e) => {
    const { name, value } = e.target;
    setWalletInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Payment Method</h3>
      
      <div className="space-y-4 mb-6">
        {paymentMethods.map(method => {
          const MethodIcon = method.icon;
          return (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                paymentMethod === method.id
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === method.id
                    ? 'border-neutral-900 bg-neutral-900'
                    : 'border-neutral-300'
                }`}></div>
                <MethodIcon className="w-5 h-5 text-neutral-600" />
                <div>
                  <span className="font-medium text-neutral-900">{method.name}</span>
                  <p className="text-sm text-neutral-500">{method.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Details Forms */}
      {paymentMethod === 'card' && (
        <div className="space-y-4 border-t border-neutral-200 pt-6">
          <h4 className="font-medium text-neutral-900 mb-4">Card Details</h4>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Card Number *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                name="cardNumber"
                value={cardInfo.cardNumber}
                onChange={handleCardChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.cardNumber ? 'border-red-300' : 'border-neutral-200'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>
            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                name="expiryDate"
                value={cardInfo.expiryDate}
                onChange={handleCardChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.expiryDate ? 'border-red-300' : 'border-neutral-200'
                }`}
                placeholder="MM/YY"
                maxLength="5"
              />
              {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                CVV *
              </label>
              <input
                type="text"
                name="cvv"
                value={cardInfo.cvv}
                onChange={handleCardChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.cvv ? 'border-red-300' : 'border-neutral-200'
                }`}
                placeholder="123"
                maxLength="4"
              />
              {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Cardholder Name *
            </label>
            <input
              type="text"
              name="cardholderName"
              value={cardInfo.cardholderName}
              onChange={handleCardChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                errors.cardholderName ? 'border-red-300' : 'border-neutral-200'
              }`}
              placeholder="Enter cardholder name"
            />
            {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Secure Payment</p>
                <p className="text-xs text-green-700">Your card information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'upi' && (
        <div className="space-y-4 border-t border-neutral-200 pt-6">
          <h4 className="font-medium text-neutral-900 mb-4">UPI Payment</h4>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              UPI ID *
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                name="upiId"
                value={upiInfo.upiId}
                onChange={handleUpiChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.upiId ? 'border-red-300' : 'border-neutral-200'
                }`}
                placeholder="yourname@upi"
              />
            </div>
            {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">UPI Payment</p>
                <p className="text-xs text-blue-700">You'll be redirected to your UPI app to complete the payment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'wallet' && (
        <div className="space-y-4 border-t border-neutral-200 pt-6">
          <h4 className="font-medium text-neutral-900 mb-4">Digital Wallet</h4>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Select Wallet
            </label>
            <select
              name="walletType"
              value={walletInfo.walletType}
              onChange={handleWalletChange}
              className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="paytm">Paytm</option>
              <option value="phonepe">PhonePe</option>
              <option value="googlepay">Google Pay</option>
              <option value="amazonpay">Amazon Pay</option>
            </select>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Wallet className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-800">Wallet Payment</p>
                <p className="text-xs text-purple-700">You'll be redirected to your wallet app to complete the payment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'cod' && (
        <div className="border-t border-neutral-200 pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Cash on Delivery</p>
                <p className="text-sm text-amber-700 mt-1">
                  You can pay in cash when the items are delivered to you. Additional charges may apply.
                </p>
                <ul className="text-sm text-amber-700 mt-2 space-y-1">
                  <li>• COD fee: ₹50</li>
                  <li>• Payment must be made in exact amount</li>
                  <li>• Available only for orders below ₹50,000</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Security */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Shield className="w-4 h-4" />
          <span>256-bit SSL encrypted payment</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;