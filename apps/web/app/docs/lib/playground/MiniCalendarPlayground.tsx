'use client';

import * as React from 'react';
import { ZemenMiniCalendar } from '@zemen/react';
import { ComponentPlayground } from './ComponentPlayground';
import type { ControlDef, ControlState, CodeGenerator } from './types';

const CONTROLS: ControlDef[] = [
  { type: 'select', prop: 'calendar', label: 'Calendar', options: [
    { label: 'Ethiopian', value: 'ethiopian' },
    { label: 'Gregorian', value: 'gregorian' },
  ], defaultValue: 'ethiopian' },
  { type: 'select', prop: 'locale', label: 'Locale', options: [
    { label: 'English', value: 'en' },
    { label: 'Amharic', value: 'am' },
  ], defaultValue: 'en' },
  { type: 'boolean', prop: 'showHolidays', label: 'Show Holidays', defaultValue: false },
];

const generateCode: CodeGenerator = (state: ControlState): string => {
  const lines: string[] = ['<ZemenMiniCalendar'];
  if (state.calendar !== 'ethiopian') {
    lines.push(`  calendar="${state.calendar}"`);
  }
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  if (state.showHolidays) {
    lines.push('  showHolidays');
  }
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenMiniCalendarPlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={ZemenMiniCalendar}
      controls={CONTROLS}
      generateCode={generateCode}
    />
  );
}
