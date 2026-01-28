"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  id?: string;
  height?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  error = false,
  className,
  id,
  height,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Scroll selected option into view
      if (listRef.current && selectedOption) {
        const selectedIndex = options.findIndex(
          (opt) => opt.value === selectedOption.value
        );
        if (selectedIndex >= 0) {
          const optionElement = listRef.current.children[
            selectedIndex + 1
          ] as HTMLElement;
          if (optionElement) {
            optionElement.scrollIntoView({ block: "nearest" });
          }
        }
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, options, selectedOption]);

  const handleSelect = (optionValue: string) => {
    if (options.find((opt) => opt.value === optionValue)?.disabled) return;
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          const option = options[focusedIndex];
          if (option && !option.disabled) {
            handleSelect(option.value);
          }
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => {
            const next = prev + 1;
            return next >= options.length ? prev : next;
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => (prev <= 0 ? 0 : prev - 1));
        }
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-3 text-sm sm:text-base rounded-xl border-2 transition-all duration-200 flex items-center justify-between gap-3 text-left",
          !height && "min-h-[44px]",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-slate-200 focus:border-primary-500 focus:ring-primary-500",
          disabled
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-white text-navy-900 hover:border-primary-300 cursor-pointer",
          isOpen && !disabled && "border-primary-500 ring-2 ring-primary-500 ring-offset-2"
        )}
        style={height ? { height, minHeight: height } : undefined}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        <span
          className={cn(
            "flex-1 truncate",
            !selectedOption && "text-slate-400"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 flex-shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
            disabled ? "text-slate-400" : "text-slate-600"
          )}
        />
      </button>

      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown List */}
          <ul
            ref={listRef}
            role="listbox"
            className={cn(
              "absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl",
              "max-h-60 overflow-auto",
              "animate-fadeIn"
            )}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 #f1f5f9",
            }}
          >
            {options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-500 text-center">
                No options available
              </li>
            ) : (
              options.map((option, index) => {
                const isSelected = value === option.value;
                const isFocused = focusedIndex === index;
                const isDisabled = option.disabled;

                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => !isDisabled && handleSelect(option.value)}
                    className={cn(
                      "px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center justify-between gap-3",
                      isFocused && "bg-primary-50",
                      isSelected && "bg-primary-50",
                      isDisabled
                        ? "opacity-50 cursor-not-allowed text-slate-400"
                        : "hover:bg-primary-50 text-navy-900",
                      index === 0 && "rounded-t-xl",
                      index === options.length - 1 && "rounded-b-xl"
                    )}
                    onMouseEnter={() => !isDisabled && setFocusedIndex(index)}
                  >
                    <span className="flex-1 truncate text-sm sm:text-base">
                      {option.label}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </>
      )}
    </div>
  );
}

