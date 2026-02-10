/**
 * Admin Sidebar Component
 * Navigation sidebar for admin dashboard
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  FileText,
  MessageSquare,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: FolderTree, label: "Categories", href: "/admin/categories" },
  { icon: Package, label: "Software", href: "/admin/products" },
  { icon: FileText, label: "Blogs", href: "/admin/blogs" },
  { icon: MessageSquare, label: "Enquiries", href: "/admin/enquiries" },
  { icon: Mail, label: "Contacts", href: "/admin/contacts" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-colors"
        aria-label="Toggle menu">
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 h-full w-64 bg-navy-900 text-white z-40 transform transition-transform duration-300 ease-in-out",
          // Desktop: Left side, always visible
          "lg:left-0 lg:translate-x-0",
          // Mobile/Tablet: Right side, slides in from right
          "right-0",
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 lg:p-6 border-b border-navy-700">
            <h1 className="text-lg lg:text-2xl font-bold text-primary-400">
              AMC Admin
            </h1>
            <p className="text-xs lg:text-sm text-navy-300 mt-1">Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base",
                    isActive
                      ? "bg-primary-600 text-white"
                      : "text-navy-200 hover:bg-navy-800 hover:text-white",
                  )}>
                  <Icon size={18} className="lg:w-5 lg:h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-3 lg:p-4 border-t border-navy-700">
            <div className="mb-2 lg:mb-3 px-3 lg:px-4 py-2 rounded-lg bg-navy-800">
              <p className="text-xs lg:text-sm text-navy-300">Logged in as</p>
              {mounted ? (
                <>
                  <p className="font-semibold text-white truncate text-sm lg:text-base">
                    {user?.full_name || "Admin"}
                  </p>
                  <p className="text-xs text-navy-400 truncate">
                    {user?.email || ""}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-white truncate text-sm lg:text-base">
                    Admin
                  </p>
                  <p className="text-xs text-navy-400 truncate">&nbsp;</p>
                </>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm lg:text-base">
              <LogOut size={18} className="lg:w-5 lg:h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
