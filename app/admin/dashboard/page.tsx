/**
 * Admin Dashboard Page
 */

"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAppSelector } from "@/store/hooks";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  FileText,
  MessageSquare,
  Mail,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Categories",
    icon: FolderTree,
    href: "/admin/categories",
    color: "bg-blue-500",
  },
  {
    label: "Products",
    icon: Package,
    href: "/admin/products",
    color: "bg-green-500",
  },
  {
    label: "Blogs",
    icon: FileText,
    href: "/admin/blogs",
    color: "bg-purple-500",
  },
  {
    label: "Enquiries",
    icon: MessageSquare,
    href: "/admin/enquiries",
    color: "bg-orange-500",
  },
  {
    label: "Contacts",
    icon: Mail,
    href: "/admin/contacts",
    color: "bg-red-500",
  },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ProtectedRoute>
      <div>
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900 mb-1 sm:mb-2">
            Dashboard
          </h1>
          {mounted ? (
            <p className="text-sm sm:text-base text-gray-600">
              Welcome back, {user?.full_name || "Admin"}!
            </p>
          ) : (
            <p className="text-sm sm:text-base text-gray-600">
              Welcome back, Admin!
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`${stat.color} p-3 sm:p-4 rounded-lg text-white flex-shrink-0`}>
                    <Icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-navy-900 truncate">
                      {stat.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      Manage {stat.label.toLowerCase()}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 sm:mt-6 lg:mt-8 bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6 border border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-navy-900 mb-3 sm:mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              href="/admin/categories/create"
              className="p-3 sm:p-4 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">
              <h3 className="text-sm sm:text-base font-semibold text-navy-900 mb-1">
                Create New Category
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Add a new software category
              </p>
            </Link>
            <Link
              href="/admin/products/create"
              className="p-3 sm:p-4 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">
              <h3 className="text-sm sm:text-base font-semibold text-navy-900 mb-1">
                Create New Product
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Add a new product
              </p>
            </Link>
            <Link
              href="/admin/blogs/create"
              className="p-3 sm:p-4 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">
              <h3 className="text-sm sm:text-base font-semibold text-navy-900 mb-1">
                Create New Blog
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Write a new blog post
              </p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
