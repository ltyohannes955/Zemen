'use client';

import * as React from 'react';
import { ZemenDatePicker } from '@zemen/react';
import { ComponentPlayground } from './ComponentPlayground';
import type { ControlDef, ControlState, CodeGenerator } from './types';

const CONTROLS: ControlDef[] = [
  { type: 'select', prop: 'locale', label: 'Locale', options: [
    { label: 'English', value: 'en' },
    { label: 'Amharic', value: 'am' },
  ], defaultValue: 'en' },
];

const generateCode: CodeGenerator = (state: ControlState): string => {
  const lines: string[] = ['<ZemenDatePicker'];
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  lines.push('  onChange={(date) => console.log(date)}');
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenDatePickerPlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={ZemenDatePicker}
      controls={CONTROLS}
      generateCode={generateCode}
    />
  );
}
