'use client';

import * as React from 'react';
import { ZemenCalendarHeader } from '@zemen/react';
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
];

const generateCode: CodeGenerator = (state: ControlState): string => {
  const lines: string[] = ['<ZemenCalendarHeader'];
  lines.push('  year={2024}');
  lines.push('  month={1}');
  if (state.calendar !== 'ethiopian') {
    lines.push(`  calendar="${state.calendar}"`);
  }
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  lines.push('  onPrev={() => {}}');
  lines.push('  onNext={() => {}}');
  lines.push('  onToday={() => {}}');
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenCalendarHeaderPlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={ZemenCalendarHeader}
      defaultProps={{
        year: 2017,
        month: 1,
        onPrev: () => {},
        onNext: () => {},
        onToday: () => {},
      }}
      controls={CONTROLS}
      generateCode={generateCode}
    />
  );
}
