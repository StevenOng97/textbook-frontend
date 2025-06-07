import { useState, useCallback } from 'react';
import { BookingFormData } from '../types/booking';
import { apiService, BookingResponse, BookingDetails, PaymentUpdateRequest } from '../services/api';

interface UseBookingState {
  loading: boolean;
  error: string | null;
  success: boolean;
  bookingResponse: BookingResponse | null;
  bookingDetails: BookingDetails | null;
}

interface UseBookingActions {
  createBooking: (data: BookingFormData) => Promise<void>;
  confirmBooking: (uuid: string) => Promise<void>;
  updatePayment: (uuid: string, paymentData: PaymentUpdateRequest) => Promise<void>;
  getBookingDetails: (uuid: string) => Promise<void>;
  clearState: () => void;
}

export const useBooking = (): UseBookingState & UseBookingActions => {
  const [state, setState] = useState<UseBookingState>({
    loading: false,
    error: null,
    success: false,
    bookingResponse: null,
    bookingDetails: null,
  });

  const clearState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
      bookingResponse: null,
      bookingDetails: null,
    });
  }, []);

  const createBooking = useCallback(async (data: BookingFormData) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));
    
    try {
      const response = await apiService.createBooking(data);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          loading: false,
          success: true,
          bookingResponse: response.data!,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to create booking',
          success: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false,
      }));
    }
  }, []);

  const confirmBooking = useCallback(async (uuid: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.confirmBooking(uuid);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          success: true,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to confirm booking',
          success: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false,
      }));
    }
  }, []);

  const updatePayment = useCallback(async (uuid: string, paymentData: PaymentUpdateRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.updatePaymentStatus(uuid, paymentData);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          success: true,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to update payment',
          success: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false,
      }));
    }
  }, []);

  const getBookingDetails = useCallback(async (uuid: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.getBookingDetails(uuid);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          loading: false,
          success: true,
          bookingDetails: response.data!,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to fetch booking details',
          success: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false,
      }));
    }
  }, []);

  return {
    ...state,
    createBooking,
    confirmBooking,
    updatePayment,
    getBookingDetails,
    clearState,
  };
}; 