'use client';

import { useEffect, useState } from 'react';
import { toEthiopianLocal, getMonthName } from '@zemen/core';

export function DatePill({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`h-[28px] w-[180px] bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-full animate-pulse shadow-sm ${className}`} />;
  }

  const now = new Date();
  
  // Ethiopian Date
  const ethDate = toEthiopianLocal(now);
  const ethMonthName = getMonthName(ethDate.month, 'en'); // 'Sēnē' style
  
  // Gregorian Date
  const gregMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const gregMonthName = gregMonths[now.getMonth()];

  return (
    <div className={`px-3 py-1.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-full text-[11px] font-bold text-gray-700 dark:text-gray-200 flex items-center shadow-sm ${className}`}>
      <span>🇪🇹 {ethMonthName} {ethDate.day}, {ethDate.year}</span>
      <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
      <span>🇬🇷 {gregMonthName} {now.getDate()}, {now.getFullYear()}</span>
    </div>
  );
}
