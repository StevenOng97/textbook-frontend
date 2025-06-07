import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  BookOpen,
  Send,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { BookingFormData, AppointmentType } from "../types/booking";
import { useBooking } from "../hooks/useBooking";

interface BookingFormProps {
  onSubmit?: (data: BookingFormData) => void;
  loading?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  loading: externalLoading = false,
}) => {
  const {
    loading: apiLoading,
    error,
    success,
    bookingResponse,
    createBooking,
    clearState,
  } = useBooking();

  const isLoading = externalLoading || apiLoading;
  const [formData, setFormData] = useState<BookingFormData>({
    userName: "",
    userPhone: "",
    appointmentType: "CONSULTATION",
    appointmentDate: new Date().toISOString().slice(0, 16),
    bookingDetails: {
      subject: "",
      level: "",
      duration: 60,
      notes: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous state
    clearState();

    // Basic validation
    if (!formData.userName.trim()) {
      console.error("User name is required");
      return;
    }

    if (!formData.userPhone.trim()) {
      console.error("Phone number is required");
      return;
    }

    if (!formData.appointmentDate) {
      console.error("Appointment date is required");
      return;
    }

    try {
      // Ensure appointmentDate is properly formatted as ISO string
      const formattedData = {
        ...formData,
        appointmentDate: new Date(formData.appointmentDate).toISOString(),
      };

      // Use the API hook to create booking
      await createBooking(formattedData);

      // Also call the external onSubmit if provided
      if (onSubmit) {
        onSubmit(formattedData);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBookingDetailsChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      bookingDetails: {
        ...prev.bookingDetails,
        [field]: value,
      },
    }));
  };

  // Generate default date/time (tomorrow at 2 PM)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);
  const defaultDateTime = tomorrow.toISOString().slice(0, 16);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
        <h2 className="text-xl font-semibold">Create New Booking</h2>
        <p className="text-blue-100 text-sm mt-1">
          Fill out the form to schedule your appointment
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.userPhone}
                onChange={(e) => handleInputChange("userPhone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Appointment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <select
                value={formData.appointmentType}
                onChange={(e) =>
                  handleInputChange(
                    "appointmentType",
                    e.target.value as AppointmentType
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="CONSULTATION">Consultation</option>
                <option value="TUTORIAL">Tutorial Session</option>
                <option value="ASSESSMENT">Assessment</option>
                <option value="GROUP_SESSION">Group Session</option>
                <option value="WORKSHOP">Workshop</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.appointmentDate || defaultDateTime}
                onChange={(e) =>
                  handleInputChange("appointmentDate", e.target.value)
                }
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Additional Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.bookingDetails.subject || ""}
                onChange={(e) =>
                  handleBookingDetailsChange("subject", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Mathematics, Science, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={formData.bookingDetails.level || ""}
                onChange={(e) =>
                  handleBookingDetailsChange("level", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.bookingDetails.notes || ""}
              onChange={(e) =>
                handleBookingDetailsChange("notes", e.target.value)
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Any special requirements or notes..."
            />
          </div>
        </div>

        {/* Submit Button */}
        {/* Success/Error Messages */}
        {(success || error) && (
          <div className="border-t pt-6">
            {success && bookingResponse && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-green-800 mb-2">
                    Booking Created Successfully!
                  </h4>
                  <p className="text-green-700 mb-4">
                    {bookingResponse.message}
                  </p>

                  <div className="bg-white rounded-lg p-4 mb-6 border border-green-300">
                    <p className="text-green-700 font-medium mb-2">
                      <strong>Booking Magic Link:</strong> {bookingResponse.magicLink}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-red-800 font-semibold">
                      Booking Failed
                    </h4>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Booking...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Create Booking</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
