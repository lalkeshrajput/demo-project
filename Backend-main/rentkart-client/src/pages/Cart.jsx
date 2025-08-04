import React, { useEffect, useState } from 'react';
import { ShoppingCart, ArrowLeft, CreditCard,Trash2, Calendar } from 'lucide-react';
import CartItem from '../components/CartItem';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch cart items', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      }
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const updateQuantity = async (cartItemId, newQty) => {
    try {
      const res = await fetch(`/api/cart/update/${cartItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      if (res.ok) {
        setCartItems((current) =>
          current.map((i) =>
            i._id === cartItemId ? { ...i, quantity: newQty } : i
          )
        );
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
  const hasRentalDates = cartItems.every(item => item.rental_start_date && item.rental_end_date);
  if (!hasRentalDates) {
    alert('Please select rental start and end dates for all items.');
    return;
  }

  const selectedItemIds = cartItems.map(item => item._id);
  navigate('/checkout', { state: { selectedItemIds } });
};

  const updateRentalDates = (cartItemId, field, value) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === cartItemId ? { ...item, [field]: value } : item
      )
    );
  };




  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <header className="bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-neutral-900">RentKart</h1>
              <nav>
                <a href="/home" className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors">
                  Home
                </a>
              </nav>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-neutral-900">RentKart</h1>
            <nav>
              <a
                href="/home"
                className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-neutral-700" />
            <h2 className="text-3xl font-bold text-neutral-900">Your Cart</h2>
          </div>
          {cartItems.length > 0 && (
            <p className="text-neutral-600">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Your cart is empty</h3>
            <p className="text-neutral-600 mb-6">Start browsing our products to add items to your cart</p>
            <a
              href="/home"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onDelete={removeFromCart}
                  onQuantityChange={updateQuantity}
                  onDateChange={updateRentalDates} // ✅ Add this
                />
              ))}

            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 sticky top-24">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery</span>
                    <span className="text-green-600">20</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-neutral-900">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-neutral-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                {/* <p className="text-xs text-neutral-500 text-center mt-4">
                 
                </p> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;