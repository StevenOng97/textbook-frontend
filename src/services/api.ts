import { BookingFormData } from '../types/booking';

const magicLinkBaseUrl = 'https://tbook-v1.vercel.app';
const apiBaseUrl = 'https://tbook-v1.vercel.app';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BookingResponse {
  bookingId: string;
  uuid: string;
  magicLink: string;
  status: string;
  message: string;
}

export interface BookingDetails {
  id: string;
  bookingId: string;
  magicLinkId: string;
  userName: string;
  userPhone: string;
  appointmentType: string;
  appointmentDate: string;
  bookingDetails: any;
  status: string;
  paymentStatus: string;
  paymentId?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  createdAt: string;
  confirmedAt?: string;
  paymentUpdatedAt?: string;
  lastAccessedAt?: string;
  accessCount: number;
}

export interface PaymentUpdateRequest {
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  amount?: number;
  currency?: string;
}

export interface MagicLinkPreview {
  bookingId: string;
  redirectUrl: string;
  status: string;
  bookingDetails: BookingDetails;
}

export interface AnalyticsEvent {
  event: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: any;
}

// API Service Class
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${apiBaseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Booking Management APIs
  async createBooking(bookingData: BookingFormData): Promise<ApiResponse<BookingResponse>> {
    return this.request<BookingResponse>('/api/booking/create', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async confirmBooking(uuid: string): Promise<ApiResponse> {
    return this.request(`/api/booking/confirm/${uuid}`, {
      method: 'POST',
    });
  }

  async updatePaymentStatus(
    uuid: string,
    paymentData: PaymentUpdateRequest
  ): Promise<ApiResponse> {
    return this.request(`/api/booking/payment/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async getBookingDetails(uuid: string): Promise<ApiResponse<BookingDetails>> {
    return this.request<BookingDetails>(`/api/booking/${uuid}`);
  }

  // Magic Link APIs
  async previewMagicLink(magicLinkId: string): Promise<ApiResponse<MagicLinkPreview>> {
    return this.request<MagicLinkPreview>(`/appt/${magicLinkId}/preview`);
  }

  async trackMagicLinkEvent(
    magicLinkId: string,
    eventData: AnalyticsEvent
  ): Promise<ApiResponse> {
    return this.request(`/appt/${magicLinkId}/track`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getMagicLinkAnalytics(magicLinkId: string): Promise<ApiResponse> {
    return this.request(`/appt/${magicLinkId}/analytics`);
  }

  // Utility Methods
  getMagicLinkUrl(magicLinkId: string): string {
    return `${magicLinkBaseUrl}/appt/${magicLinkId}`;
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 