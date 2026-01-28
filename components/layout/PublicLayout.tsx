/**
 * Public Layout Wrapper
 * Conditionally renders Header/Footer only for public routes
 */

'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Don't render Header/Footer for admin routes
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Render Header/Footer for public routes
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

