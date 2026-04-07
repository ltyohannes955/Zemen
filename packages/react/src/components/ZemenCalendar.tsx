import * as React from 'react';
import { toEthiopianLocal } from '@zemen/core';

export function ZemenCalendar(): React.JSX.Element {
  const today = React.useMemo(() => toEthiopianLocal(new Date()), []);

  return (
    <div className="rounded-lg border p-4">
      <div className="text-lg font-semibold">Zemen Calendar</div>
      <div className="text-sm text-gray-600">
        Linked core placeholder: {today.year}-{today.month}-{today.day}
      </div>
    </div>
  );
}
