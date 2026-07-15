'use client';

import * as React from 'react';
import { ZemenYearView } from '@zemen/react';
import { ComponentPlayground } from './ComponentPlayground';
import { MOCK_TASKS } from '../mock-tasks';
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
  { type: 'boolean', prop: 'showTasks', label: 'Show Tasks', defaultValue: true },
];

const generateCode: CodeGenerator = (state: ControlState): string => {
  const lines: string[] = ['<ZemenYearView'];
  if (state.calendar !== 'ethiopian') {
    lines.push(`  calendar="${state.calendar}"`);
  }
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  if (state.showTasks) {
    lines.push('  tasks={tasks}');
  }
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenYearViewPlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={ZemenYearView}
      controls={CONTROLS}
      generateCode={generateCode}
      mockTasks={MOCK_TASKS}
      tasksProp="tasks"
    />
  );
}
