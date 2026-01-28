/**
 * Pagination Component
 * Reusable pagination component for admin pages
 */

'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  // Calculate range
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs sm:text-sm text-gray-600">
          Showing {startItem}-{endItem} of {totalItems} items
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 border-t border-gray-200">
      {/* Items info */}
      <div className="text-xs sm:text-sm text-gray-600">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="h-8 w-8 sm:h-9 sm:w-9 p-0"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} className="sm:w-4 sm:h-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <Button
                key={pageNum}
                variant={isActive ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                className={`h-8 w-8 sm:h-9 sm:w-9 p-0 text-xs sm:text-sm ${
                  isActive
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'hover:bg-gray-50'
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="h-8 w-8 sm:h-9 sm:w-9 p-0"
          aria-label="Next page"
        >
          <ChevronRight size={16} className="sm:w-4 sm:h-4" />
        </Button>
      </div>
    </div>
  );
}

