'use client';

import * as React from 'react';
import { ZemenTaskTimeline } from '@zemen/react';
import { ComponentPlayground } from './ComponentPlayground';
import { MOCK_TASKS } from '../mock-tasks';
import type { ControlDef, ControlState, CodeGenerator } from './types';

const CONTROLS: ControlDef[] = [
  { type: 'select', prop: 'locale', label: 'Locale', options: [
    { label: 'English', value: 'en' },
    { label: 'Amharic', value: 'am' },
  ], defaultValue: 'en' },
  { type: 'boolean', prop: 'disableDragDrop', label: 'Disable Drag & Drop', defaultValue: false },
  { type: 'boolean', prop: 'compact', label: 'Compact Mode', defaultValue: false },
];

const generateCode: CodeGenerator = (state: ControlState): string => {
  const lines: string[] = ['<ZemenTaskTimeline'];
  lines.push('  date={new Date()}');
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  if (state.disableDragDrop) {
    lines.push('  disableDragDrop');
  }
  if (state.compact) {
    lines.push('  compact');
  }
  lines.push('  startHour={6}');
  lines.push('  endHour={22}');
  lines.push('  tasks={tasks}');
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenTaskTimelinePlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={ZemenTaskTimeline}
      defaultProps={{ date: new Date(), startHour: 6, endHour: 22 }}
      controls={CONTROLS}
      generateCode={generateCode}
      mockTasks={MOCK_TASKS}
      tasksProp="tasks"
    />
  );
}
