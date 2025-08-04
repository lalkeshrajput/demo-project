import React from 'react';
import { CheckCircle, Package, Calendar, MapPin, CreditCard, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConfirmationStep = ({ orderId, orderDetails }) => {
  const navigate = useNavigate();

  const handleDownloadInvoice = () => {
    // Generate and download invoice
    const invoiceData = {
      orderId: orderId,
      date: new Date().toLocaleDateString(),
      items: orderDetails?.items || [],
      total: orderDetails?.total || 0
    };
    
    // Create a simple text invoice (in real app, you'd generate PDF)
    const invoiceText = `
RENTKART INVOICE
================
Order ID: ${invoiceData.orderId}
Date: ${invoiceData.date}
Total: ₹${invoiceData.total}

Thank you for your order!
    `;
    
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderId}.txt`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-neutral-100">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Order Confirmed!</h1>
        <p className="text-neutral-600 mb-6">
          Your rental order has been successfully placed. You'll receive a confirmation email shortly.
        </p>

        {/* Order ID */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-neutral-600">Order ID</p>
          <p className="font-mono text-lg font-semibold text-neutral-900">#{orderId?.slice(-8)}</p>
        </div>

        {/* Order Summary */}
        {orderDetails && (
          <div className="bg-neutral-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-neutral-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">
                  {orderDetails.itemCount} {orderDetails.itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">
                  {orderDetails.startDate} to {orderDetails.endDate}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">
                  {orderDetails.deliveryAddress}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">
                  {orderDetails.paymentMethod}
                </span>
              </div>
            </div>

            <div className="border-t border-neutral-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-neutral-900">Total Paid</span>
                <span className="font-bold text-lg text-neutral-900">₹{orderDetails.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
          <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You'll receive an email confirmation within 5 minutes</li>
            <li>• The owner will review and approve your request</li>
            <li>• Items will be delivered on your selected date</li>
            <li>• You can track your order in the Orders section</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 bg-neutral-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            View Orders
          </button>
          
          <button
            onClick={handleDownloadInvoice}
            className="flex-1 border border-neutral-200 text-neutral-700 py-3 px-6 rounded-xl font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/items')}
            className="flex-1 text-neutral-600 hover:text-neutral-900 transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Support */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@rentkart.com" className="text-neutral-700 hover:text-neutral-900">
              support@rentkart.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;