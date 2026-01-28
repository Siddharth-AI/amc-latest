/**
 * useTokenRefresh Hook
 * Automatically refreshes token before expiry
 */

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { refreshToken } from '@/store/slices/authSlice';
import { isTokenExpired } from '@/utils/token';

/**
 * Hook to automatically refresh token before expiry
 * Checks every 5 minutes and refreshes if needed
 */
export function useTokenRefresh() {
  const dispatch = useAppDispatch();
  const { accessToken, refreshToken: refreshTokenValue, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !refreshTokenValue) {
      // Clear interval if not authenticated
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Function to check and refresh token
    const checkAndRefreshToken = async () => {
      if (isTokenExpired(accessToken)) {
        try {
          await dispatch(refreshToken()).unwrap();
          console.log('Token refreshed automatically');
        } catch (error) {
          console.error('Failed to refresh token:', error);
          // If refresh fails, logout will be handled by auth slice
        }
      }
    };

    // Check immediately
    checkAndRefreshToken();

    // Set up interval to check every 5 minutes
    intervalRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [accessToken, refreshTokenValue, isAuthenticated, dispatch]);
}

