'use client';

import { ZemenCalendar } from '@zemen/react';

export default function MonthPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Month View</h1>
      <ZemenCalendar />
    </div>
  );
}
