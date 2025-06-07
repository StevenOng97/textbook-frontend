import React, { useEffect } from "react";
import { BookingDetails } from "../components/BookingDetails";
import { ArrowLeft } from "lucide-react";

interface BookingDetailsPageProps {
  bookingId?: string;
  onBack?: () => void;
}

export const BookingDetailsPage: React.FC<BookingDetailsPageProps> = ({
  bookingId,
  onBack,
}) => {
  // Extract UUID from bookingId if needed
  // The bookingId from URL might be the human-readable ID or the UUID
  // For now, we'll assume it's the UUID that we need for API calls
  const uuid = bookingId;

  const handlePaymentUpdate = (
    uuid: string,
    status: "completed" | "failed"
  ) => {
    console.log(`Payment updated for booking ${uuid}: ${status}`);
    // You could add additional logic here like showing notifications
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {uuid ? (
            <BookingDetails uuid={uuid} onPaymentUpdate={handlePaymentUpdate} />
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center text-gray-500">
                <h3 className="text-lg font-semibold">
                  No Booking ID Provided
                </h3>
                <p className="text-sm mt-1">
                  Please provide a valid booking ID in the URL.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
