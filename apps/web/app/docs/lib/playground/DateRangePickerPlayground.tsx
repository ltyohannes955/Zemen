'use client';

import * as React from 'react';
import { ZemenDateRangePicker } from '@zemen/react';
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
  const lines: string[] = ['<ZemenDateRangePicker'];
  if (state.calendar !== 'ethiopian') {
    lines.push(`  calendar="${state.calendar}"`);
  }
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  lines.push('  onChange={(range) => console.log(range)}');
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenDateRangePickerPlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={ZemenDateRangePicker}
      controls={CONTROLS}
      generateCode={generateCode}
    />
  );
}
