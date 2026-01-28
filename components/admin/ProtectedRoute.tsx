/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  // Show loading during initial mount or auth check
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // After mount, if not authenticated, return null (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

