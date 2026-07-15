'use client';

import * as React from 'react';
import { ZemenMonthView } from '@zemen/react';
import { ComponentPlayground } from './ComponentPlayground';
import { MOCK_TASKS } from '../mock-tasks';
import type { ControlDef, CodeGenerator, ControlState } from './types';

const CONTROLS: ControlDef[] = [
  { type: 'select', prop: 'calendar', label: 'Calendar', options: [
    { label: 'Ethiopian', value: 'ethiopian' },
    { label: 'Gregorian', value: 'gregorian' },
  ], defaultValue: 'ethiopian' },
  { type: 'select', prop: 'locale', label: 'Locale', options: [
    { label: 'English', value: 'en' },
    { label: 'Amharic', value: 'am' },
  ], defaultValue: 'en' },
  { type: 'boolean', prop: 'disableDragDrop', label: 'Disable Drag & Drop', defaultValue: false },
  { type: 'boolean', prop: 'showTasks', label: 'Show Tasks', defaultValue: true },
];

const generateCode: CodeGenerator = (state: ControlState): string => {
  const lines: string[] = ['<ZemenMonthView'];
  if (state.calendar !== 'ethiopian') {
    lines.push(`  calendar="${state.calendar}"`);
  }
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  if (state.disableDragDrop) {
    lines.push('  disableDragDrop');
  }
  if (state.showTasks) {
    lines.push('  tasks={mockTasks}');
  }
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenMonthViewPlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={ZemenMonthView}
      controls={CONTROLS}
      generateCode={generateCode}
      mockTasks={MOCK_TASKS}
      tasksProp="tasks"
    />
  );
}
