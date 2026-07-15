'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZemenCalendar, type SelectedDateInfo } from './ZemenCalendar';
import { formatNumber } from '@zemen/core';

export type ZemenDatePickerProps = {
  value?: SelectedDateInfo | null;
  onChange?: (date: SelectedDateInfo) => void;
  placeholder?: string;
  themeColor?: string;
  locale?: 'en' | 'am';
  className?: string;
};

export function ZemenDatePicker({
  value,
  onChange,
  placeholder = "Select Date...",
  themeColor = "#059669",
  locale = 'en',
  className = ""
}: ZemenDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const firstCell = containerRef.current?.querySelector('[role="gridcell"][tabindex="0"]') as HTMLElement | null;
        firstCell?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formatDisplay = () => {
    if (!value) return '';
    const gregMonthStr = String(value.gregMonth).padStart(2, '0');
    const gregDayStr = String(value.gregDay).padStart(2, '0');
    return `${formatNumber(value.ethMonth, locale)}/${formatNumber(value.ethDay, locale)}/${formatNumber(value.ethYear, locale)}  •  ${value.gregYear}-${gregMonthStr}-${gregDayStr}`;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={value ? `Selected date: ${formatDisplay()}` : placeholder}
        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent outline-none transition-all text-sm bg-white dark:bg-[#111827] text-left flex items-center justify-between ${
          isOpen ? 'border-emerald-500 dark:border-emerald-500 shadow-[0_0_0_3px_#059669]/20 dark:shadow-[0_0_0_3px_rgba(52,211,153,0.15)]' : 'border-gray-200 dark:border-gray-700 shadow-sm'
        }`}
      >
        <span className={value ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-400 dark:text-gray-500"}>
          {value ? formatDisplay() : placeholder}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 transition-transform duration-150 ${isOpen ? 'rotate-180 text-emerald-500 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`} aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Date picker calendar"
          className="absolute z-[100] mt-2 top-full right-0 lg:left-0 bg-white dark:bg-[#111827] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_0_30px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-700 p-0 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <ZemenCalendar
            themeColor={themeColor}
            locale={locale}
            selectedDate={value ? { ethYear: value.ethYear, ethMonth: value.ethMonth, ethDay: value.ethDay } : null}
            onSelectDate={(date) => {
              onChange?.(date);
              setIsOpen(false);
              triggerRef.current?.focus();
            }}
            className="border-none shadow-none"
          />
        </div>
      )}
    </div>
  );
}
