'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ZemenCalendar, type SelectedDateInfo } from './ZemenCalendar';

export type ZemenDatePickerProps = {
  value?: SelectedDateInfo | null;
  onChange?: (date: SelectedDateInfo) => void;
  placeholder?: string;
  themeColor?: string;
  className?: string;
};

export function ZemenDatePicker({
  value,
  onChange,
  placeholder = "Select Date...",
  themeColor = "#0B3D16",
  className = ""
}: ZemenDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplay = () => {
    if (!value) return '';
    const gregMonthStr = String(value.gregMonth).padStart(2, '0');
    const gregDayStr = String(value.gregDay).padStart(2, '0');
    return `🇪🇹 ${value.ethMonth}/${value.ethDay}/${value.ethYear}  •  🇬🇷 ${value.gregYear}-${gregMonthStr}-${gregDayStr}`;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#0B3D16] focus:border-transparent outline-none transition-all text-[14px] bg-white text-left flex items-center justify-between ${
          isOpen ? 'border-[#0B3D16] shadow-[0_0_0_3px_rgba(11,61,22,0.1)]' : 'border-gray-200 shadow-sm'
        }`}
      >
        <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
          {value ? formatDisplay() : placeholder}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0B3D16]' : 'text-gray-400'}`}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-2 top-full right-0 lg:left-0 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-1 w-[280px] animate-in fade-in slide-in-from-top-2 duration-200">
          <ZemenCalendar
            themeColor={themeColor}
            selectedDate={value ? { ethYear: value.ethYear, ethMonth: value.ethMonth, ethDay: value.ethDay } : null}
            onSelectDate={(date) => {
              onChange?.(date);
              setIsOpen(false);
            }}
            className="border-none shadow-none p-1"
          />
        </div>
      )}
    </div>
  );
}
