'use client';

import * as React from 'react';
import { ZemenTaskForm } from '@zemen/react';
import { MOCK_TASKS } from '../mock-tasks';
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
  const lines: string[] = ['<ZemenTaskForm'];
  lines.push('  onClose={() => {}}');
  if (state.calendar !== 'ethiopian') {
    lines.push(`  calendar="${state.calendar}"`);
  }
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenTaskFormPlayground(): React.JSX.Element {
  const task = MOCK_TASKS[0];
  return (
    <ComponentPlayground
      component={ZemenTaskForm}
      defaultProps={{
        task,
        onClose: () => {},
        onSubmit: () => {},
        onUpdate: () => {},
      }}
      controls={CONTROLS}
      generateCode={generateCode}
    />
  );
}
