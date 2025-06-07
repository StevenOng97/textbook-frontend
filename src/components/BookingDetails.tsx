import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  CreditCard,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { BookingDetails as BookingDetailsType } from '../services/api';

interface BookingDetailsProps {
  bookingId?: string;
  uuid?: string;
  onPaymentUpdate?: (uuid: string, status: 'completed' | 'failed') => void;
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({ 
  bookingId, 
  uuid, 
  onPaymentUpdate 
}) => {
  const { 
    loading, 
    error, 
    success, 
    bookingDetails, 
    getBookingDetails,
    updatePayment,
    confirmBooking,
    clearState 
  } = useBooking();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (uuid) {
      getBookingDetails(uuid);
    }
  }, [uuid, getBookingDetails]);

  const handleConfirmBooking = async () => {
    if (uuid && bookingDetails?.status === 'pending_confirmation') {
      await confirmBooking(uuid);
      // Refresh booking details after confirmation
      setTimeout(() => getBookingDetails(uuid), 1000);
    }
  };

  const handlePaymentUpdate = async (status: 'completed' | 'failed') => {
    if (!uuid) return;
    
    setPaymentLoading(true);
    try {
      await updatePayment(uuid, {
        paymentStatus: status,
        paymentId: `payment_${Date.now()}`,
        amount: status === 'completed' ? 100 : undefined,
        currency: status === 'completed' ? 'USD' : undefined,
      });
      
      // Call parent callback if provided
      if (onPaymentUpdate) {
        onPaymentUpdate(uuid, status);
      }
      
      // Refresh booking details
      setTimeout(() => getBookingDetails(uuid), 1000);
    } catch (error) {
      console.error('Payment update failed:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending_confirmation':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Loading booking details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-center text-red-600">
          <AlertCircle className="h-8 w-8 mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Error Loading Booking</h3>
            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Booking Found</h3>
          <p className="text-sm mt-1">Please check your booking ID and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
        <h2 className="text-xl font-semibold">Booking Details</h2>
        <p className="text-blue-100 text-sm mt-1">
          Booking ID: {bookingDetails.bookingId}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${getStatusColor(bookingDetails.status)}`}>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Booking Status</p>
                <p className="text-sm capitalize">{bookingDetails.status.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${getPaymentStatusColor(bookingDetails.paymentStatus)}`}>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Payment Status</p>
                <p className="text-sm capitalize">{bookingDetails.paymentStatus}</p>
                {bookingDetails.paymentAmount && (
                  <p className="text-xs">
                    ${bookingDetails.paymentAmount} {bookingDetails.paymentCurrency}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <p className="text-gray-900">{bookingDetails.userName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex items-center space-x-2">
                <p className="text-gray-900">{bookingDetails.userPhone}</p>
                <button
                  onClick={() => copyToClipboard(bookingDetails.userPhone)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <Calendar className="h-5 w-5 mr-2" />
            Appointment Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Type
              </label>
                             <p className="text-gray-900 capitalize">
                 {bookingDetails.appointmentType.toLowerCase().replace('_', ' ')}
               </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time
              </label>
              <p className="text-gray-900">{formatDate(bookingDetails.appointmentDate)}</p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        {bookingDetails.bookingDetails && Object.keys(bookingDetails.bookingDetails).length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <BookOpen className="h-5 w-5 mr-2" />
              Additional Details
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(bookingDetails.bookingDetails, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t pt-6 space-y-4">
          {bookingDetails.status === 'pending_confirmation' && (
            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Confirm Booking</span>
            </button>
          )}

          {bookingDetails.status === 'confirmed' && bookingDetails.paymentStatus === 'pending' && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handlePaymentUpdate('completed')}
                disabled={paymentLoading}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
              >
                {paymentLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                <span>Mark Paid</span>
              </button>
              
              <button
                onClick={() => handlePaymentUpdate('failed')}
                disabled={paymentLoading}
                className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
              >
                <AlertCircle className="h-5 w-5" />
                <span>Mark Failed</span>
              </button>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
            <div>
              <p className="font-medium">Created</p>
              <p>{formatDate(bookingDetails.createdAt)}</p>
            </div>
            
            {bookingDetails.confirmedAt && (
              <div>
                <p className="font-medium">Confirmed</p>
                <p>{formatDate(bookingDetails.confirmedAt)}</p>
              </div>
            )}
            
            {bookingDetails.lastAccessedAt && (
              <div>
                <p className="font-medium">Last Accessed</p>
                <p>{formatDate(bookingDetails.lastAccessedAt)} ({bookingDetails.accessCount} times)</p>
              </div>
            )}
          </div>
        </div>

        {/* Copy Success Message */}
        {copied && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}; 