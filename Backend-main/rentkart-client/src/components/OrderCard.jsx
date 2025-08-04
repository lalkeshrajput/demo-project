import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Package, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  MessageCircle,
  Star,
  AlertTriangle,
  Eye,
  Download
} from 'lucide-react';

const statusConfig = {
  Pending: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    description: "Waiting for owner approval"
  },
  Approved: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle,
    description: "Order confirmed, preparing for delivery"
  },
  Delivered: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: Package,
    description: "Item delivered successfully"
  },
  "Return Requested": {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: RotateCcw,
    description: "Return request submitted"
  },
  Returned: {
    color: "bg-neutral-50 text-neutral-700 border-neutral-200",
    icon: CheckCircle,
    description: "Item returned successfully"
  },
  Cancelled: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
    description: "Order cancelled"
  }
};

const OrderCard = ({ order, onReturn, onApprove, onReject, onContact, userRole, onRate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const status = statusConfig[order.status] || statusConfig.Pending;
  const StatusIcon = status.icon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleRatingSubmit = () => {
    if (rating > 0) {
      onRate(order._id, rating, review);
      setShowRating(false);
      setRating(0);
      setReview('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-start gap-4">
          {/* Item Image */}
          <div className="flex-shrink-0">
            <img
              src={order.item?.images?.[0] || order.item?.image || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt={order.item?.name || order.item?.title}
              className="w-20 h-20 rounded-xl object-cover border border-neutral-100"
            />
          </div>

          {/* Order Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-neutral-900 truncate">
                {order.item?.name || order.item?.title}
              </h3>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
                <StatusIcon className="w-4 h-4" />
                {order.status}
              </div>
            </div>

            <p className="text-sm text-neutral-600 mb-3">{status.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-neutral-600">
                <Calendar className="w-4 h-4" />
                <span>{order.duration || 1} days</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Package className="w-4 h-4" />
                <span>₹{order.totalAmount?.toLocaleString()}</span>
              </div>
              {order.startDate && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(order.startDate)}</span>
                </div>
              )}
              {order.location && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{order.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 bg-neutral-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-white rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showDetails ? 'Hide Details' : 'View Details'}
            </button>

            <button
              onClick={() => onContact(order)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Contact
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Renter Actions */}
            {userRole === 'renter' && (
              <>
                {order.status === 'Delivered' && !order.rated && (
                  <button
                    onClick={() => setShowRating(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Rate Item
                  </button>
                )}
                
                {order.status === 'Delivered' && (
                  <button
                    onClick={() => onReturn(order._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Request Return
                  </button>
                )}
              </>
            )}

            {/* Owner Actions */}
            {userRole === 'owner' && order.status === 'Pending' && (
              <>
                <button
                  onClick={() => onReject(order._id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => onApprove(order._id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              </>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Details */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-3">Order Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Order ID:</span>
                    <span className="font-mono text-neutral-900">#{order._id?.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Order Date:</span>
                    <span className="text-neutral-900">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Rental Period:</span>
                    <span className="text-neutral-900">{order.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Amount:</span>
                    <span className="font-semibold text-neutral-900">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-3">
                  {userRole === 'renter' ? 'Owner Details' : 'Renter Details'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-900">
                      {userRole === 'renter' ? order.owner?.name : order.renter?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-900">
                      {userRole === 'renter' ? order.owner?.email : order.renter?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-900">
                      {userRole === 'renter' ? order.owner?.phone : order.renter?.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Notes */}
            {order.notes && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Special Instructions</p>
                    <p className="text-sm text-amber-700 mt-1">{order.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Rate Your Experience</h3>
            
            <div className="mb-4">
              <p className="text-sm text-neutral-600 mb-3">How was your experience with this item?</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 transition-colors ${
                      star <= rating ? 'text-yellow-400' : 'text-neutral-300'
                    }`}
                  >
                    <Star className={`w-8 h-8 ${star <= rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Review (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRating(false)}
                className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                disabled={rating === 0}
                className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
