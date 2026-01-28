/**
 * Admin Layout
 * Main layout for all admin pages
 */

'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Toaster } from 'sonner';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  // Auto-refresh token before expiry
  useTokenRefresh();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminTopbar />
        <main className="p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <Toaster position="top-right" richColors />
    </ReduxProvider>
  );
}

