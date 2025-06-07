export interface Booking {
  id: string;
  bookingId: string;
  magicLinkId: string;
  userName: string;
  userPhone: string;
  appointmentType: AppointmentType;
  appointmentDate: string;
  bookingDetails: {
    subject?: string;
    level?: string;
    duration?: number;
    notes?: string;
  };
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  createdAt: string;
  confirmedAt?: string;
}

export type AppointmentType = 'CONSULTATION' | 'TUTORIAL' | 'ASSESSMENT' | 'GROUP_SESSION' | 'WORKSHOP';
export type BookingStatus = 'pending_confirmation' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface BookingFormData {
  userName: string;
  userPhone: string;
  appointmentType: AppointmentType;
  appointmentDate: string;
  bookingDetails: {
    subject?: string;
    level?: string;
    duration?: number;
    notes?: string;
  };
}