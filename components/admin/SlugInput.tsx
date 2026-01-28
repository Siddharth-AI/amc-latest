"use client";

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X, Loader2 } from 'lucide-react';

interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  autoGenerateFrom: string;
  urlPrefix: string;
  table: 'category' | 'product' | 'blog';
  excludeId?: string;
  label?: string;
}

export function SlugInput({
  value,
  onChange,
  autoGenerateFrom,
  urlPrefix,
  table,
  excludeId,
  label = 'Slug (URL-friendly name)',
}: SlugInputProps) {
  const [slugPreview, setSlugPreview] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    isUnique: boolean;
    message: string;
  } | null>(null);

  // Generate slug preview from name/title
  const generateSlugPreview = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Update preview when autoGenerateFrom changes
  useEffect(() => {
    if (autoGenerateFrom) {
      setSlugPreview(generateSlugPreview(autoGenerateFrom));
    }
  }, [autoGenerateFrom]);

  // Validate slug with debounce
  const validateSlug = useCallback(
    async (slug: string) => {
      if (!slug || slug.length < 2) {
        setValidationResult(null);
        return;
      }

      setIsValidating(true);
      try {
        const response = await fetch('/api/admin/validate-slug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, table, excludeId }),
        });

        const result = await response.json();
        if (result.success) {
          setValidationResult(result.data);
        }
      } catch (error) {
        console.error('Slug validation error:', error);
      } finally {
        setIsValidating(false);
      }
    },
    [table, excludeId]
  );

  // Debounced validation
  useEffect(() => {
    if (!value) {
      setValidationResult(null);
      return;
    }

    const timer = setTimeout(() => {
      validateSlug(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, validateSlug]);

  const displaySlug = value || slugPreview;
  const showValidation = value && validationResult;

  return (
    <div className="space-y-2">
      <Label htmlFor="slug">{label}</Label>
      <div className="relative">
        <Input
          id="slug"
          name="slug"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={slugPreview || 'auto-generated-slug'}
          className={`pr-10 ${
            showValidation
              ? validationResult.isValid && validationResult.isUnique
                ? 'border-green-500 focus:border-green-500'
                : 'border-red-500 focus:border-red-500'
              : ''
          }`}
        />
        {isValidating && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
        )}
        {showValidation && !isValidating && (
          <>
            {validationResult.isValid && validationResult.isUnique ? (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            ) : (
              <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
            )}
          </>
        )}
      </div>

      {/* URL Preview */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">Preview:</span>{' '}
        <span className="text-blue-600">{urlPrefix}{displaySlug || 'your-slug'}</span>
      </div>

      {/* Validation Message */}
      {showValidation && (
        <p
          className={`text-sm ${
            validationResult.isValid && validationResult.isUnique
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {validationResult.message}
        </p>
      )}

      {/* Help Text */}
      {!value && (
        <p className="text-xs text-gray-500">
          Leave empty to auto-generate from {table === 'blog' ? 'title' : 'name'}
        </p>
      )}
    </div>
  );
}
