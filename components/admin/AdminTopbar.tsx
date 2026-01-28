/**
 * Admin Topbar Component
 * Top navigation bar for admin dashboard
 */

'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export function AdminTopbar() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-navy-900 truncate">Admin Dashboard</h2>
          {mounted ? (
            <p className="text-xs sm:text-sm text-gray-600 truncate">Welcome back, {user?.full_name || 'Admin'}</p>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600">Welcome back, Admin</p>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 hidden lg:flex">
          <div className="text-right">
            {mounted ? (
              <>
                <p className="text-xs sm:text-sm font-medium text-navy-900 truncate max-w-[120px]">{user?.full_name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'admin'}</p>
              </>
            ) : (
              <>
                <p className="text-xs sm:text-sm font-medium text-navy-900">Admin</p>
                <p className="text-xs text-gray-500">admin</p>
              </>
            )}
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
            {mounted ? (user?.full_name?.charAt(0).toUpperCase() || 'A') : 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}

