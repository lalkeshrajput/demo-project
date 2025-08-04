import React from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutNavbar = () => {
  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </Link>
            <div className="h-6 w-px bg-neutral-200"></div>
            <h1 className="text-xl font-semibold text-neutral-900">Checkout</h1>
          </div>
          
          <div className="flex items-center gap-2 text-neutral-600">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm">Secure Checkout</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CheckoutNavbar;