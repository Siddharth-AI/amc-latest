/**
 * Admin Root Page
 * Redirects to /admin/login if not authenticated, otherwise to /admin/dashboard
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ReduxProvider } from '@/components/providers/ReduxProvider';

function AdminRedirect() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;

    // Check localStorage for quick redirect
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_access_token');
      if (token) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    } else {
      router.replace('/admin/login');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ReduxProvider>
      <AdminRedirect />
    </ReduxProvider>
  );
}

