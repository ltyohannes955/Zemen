'use client';

import * as React from 'react';
import { ZemenQuickAdd } from '@zemen/react';
import { ComponentPlayground } from './ComponentPlayground';
import type { ControlDef, ControlState, CodeGenerator } from './types';

const CONTROLS: ControlDef[] = [
  { type: 'boolean', prop: 'open', label: 'Open', defaultValue: true },
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
  const lines: string[] = ['<ZemenQuickAdd'];
  lines.push('  open={open}');
  lines.push('  onClose={() => setOpen(false)}');
  lines.push('  onSubmit={(input) => console.log(input)}');
  if (state.calendar !== 'ethiopian') {
    lines.push(`  calendar="${state.calendar}"`);
  }
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenQuickAddPlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={ZemenQuickAdd}
      defaultProps={{
        onClose: () => {},
        onSubmit: () => {},
      }}
      controls={CONTROLS}
      generateCode={generateCode}
    />
  );
}
