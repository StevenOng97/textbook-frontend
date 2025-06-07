import { useState, useCallback } from 'react';
import { apiService, MagicLinkPreview, AnalyticsEvent } from '../services/api';

interface UseMagicLinkState {
  loading: boolean;
  error: string | null;
  preview: MagicLinkPreview | null;
  analytics: any | null;
}

interface UseMagicLinkActions {
  previewMagicLink: (magicLinkId: string) => Promise<void>;
  trackEvent: (magicLinkId: string, event: AnalyticsEvent) => Promise<void>;
  getAnalytics: (magicLinkId: string) => Promise<void>;
  clearState: () => void;
}

export const useMagicLink = (): UseMagicLinkState & UseMagicLinkActions => {
  const [state, setState] = useState<UseMagicLinkState>({
    loading: false,
    error: null,
    preview: null,
    analytics: null,
  });

  const clearState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      preview: null,
      analytics: null,
    });
  }, []);

  const previewMagicLink = useCallback(async (magicLinkId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.previewMagicLink(magicLinkId);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          loading: false,
          preview: response.data!,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to preview magic link',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    }
  }, []);

  const trackEvent = useCallback(async (magicLinkId: string, eventData: AnalyticsEvent) => {
    try {
      // Track event in background - don't update loading state for this
      await apiService.trackMagicLinkEvent(magicLinkId, eventData);
    } catch (error) {
      console.error('Failed to track event:', error);
      // Don't show error to user for tracking failures
    }
  }, []);

  const getAnalytics = useCallback(async (magicLinkId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.getMagicLinkAnalytics(magicLinkId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          analytics: response.data,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to fetch analytics',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    }
  }, []);

  return {
    ...state,
    previewMagicLink,
    trackEvent,
    getAnalytics,
    clearState,
  };
}; 