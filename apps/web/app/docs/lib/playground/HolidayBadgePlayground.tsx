'use client';

import * as React from 'react';
import { ZemenHolidayBadge } from '@zemen/react';
import { ComponentPlayground } from './ComponentPlayground';
import type { ControlDef, ControlState, CodeGenerator } from './types';

const monthOptions = Array.from({ length: 13 }, (_, i) => ({
  label: `Month ${i + 1}`,
  value: String(i + 1),
}));

const dayOptions = Array.from({ length: 30 }, (_, i) => ({
  label: `Day ${i + 1}`,
  value: String(i + 1),
}));

const CONTROLS: ControlDef[] = [
  { type: 'select', prop: 'ethiopianMonth', label: 'Month', options: monthOptions, defaultValue: '1' },
  { type: 'select', prop: 'ethiopianDay', label: 'Day', options: dayOptions, defaultValue: '1' },
  { type: 'select', prop: 'locale', label: 'Locale', options: [
    { label: 'English', value: 'en' },
    { label: 'Amharic', value: 'am' },
  ], defaultValue: 'en' },
];

function HolidayBadgePreview(props: Record<string, unknown>): React.JSX.Element {
  return (
    <div className="flex items-center justify-center p-8">
      <ZemenHolidayBadge
        ethiopianMonth={Number(props.ethiopianMonth) || 1}
        ethiopianDay={Number(props.ethiopianDay) || 1}
        locale={(props.locale as 'en' | 'am') || 'en'}
      />
    </div>
  );
}

const generateCode: CodeGenerator = (state: ControlState): string => {
  const lines: string[] = ['<ZemenHolidayBadge'];
  lines.push(`  ethiopianMonth={${state.ethiopianMonth}}`);
  lines.push(`  ethiopianDay={${state.ethiopianDay}}`);
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenHolidayBadgePlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={HolidayBadgePreview}
      controls={CONTROLS}
      generateCode={generateCode}
    />
  );
}
