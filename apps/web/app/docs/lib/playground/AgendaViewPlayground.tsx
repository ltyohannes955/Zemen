'use client';

import * as React from 'react';
import { ZemenAgendaView } from '@zemen/react';
import { ComponentPlayground } from './ComponentPlayground';
import { MOCK_TASKS } from '../mock-tasks';
import type { ControlDef, ControlState, CodeGenerator } from './types';

const CONTROLS: ControlDef[] = [
  { type: 'select', prop: 'locale', label: 'Locale', options: [
    { label: 'English', value: 'en' },
    { label: 'Amharic', value: 'am' },
  ], defaultValue: 'en' },
  { type: 'boolean', prop: 'showTasks', label: 'Show Tasks', defaultValue: true },
];

const generateCode: CodeGenerator = (state: ControlState): string => {
  const lines: string[] = ['<ZemenAgendaView'];
  if (state.locale !== 'en') {
    lines.push(`  locale="${state.locale}"`);
  }
  if (state.showTasks) {
    lines.push('  tasks={tasks}');
  }
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenAgendaViewPlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={ZemenAgendaView}
      controls={CONTROLS}
      generateCode={generateCode}
      mockTasks={MOCK_TASKS}
      tasksProp="tasks"
    />
  );
}
