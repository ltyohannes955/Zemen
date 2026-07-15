'use client';

import * as React from 'react';
import { ZemenTaskCard } from '@zemen/react';
import { ComponentPlayground } from './ComponentPlayground';
import { MOCK_TASKS } from '../mock-tasks';
import type { ControlDef, ControlState, CodeGenerator } from './types';

const CONTROLS: ControlDef[] = [
  { type: 'select', prop: 'selectedTask', label: 'Task', options: [
    { label: MOCK_TASKS[0].title, value: MOCK_TASKS[0].id },
    { label: MOCK_TASKS[1].title, value: MOCK_TASKS[1].id },
    { label: MOCK_TASKS[2].title, value: MOCK_TASKS[2].id },
    { label: MOCK_TASKS[3].title, value: MOCK_TASKS[3].id },
    { label: MOCK_TASKS[4].title, value: MOCK_TASKS[4].id },
    { label: MOCK_TASKS[5].title, value: MOCK_TASKS[5].id },
  ], defaultValue: MOCK_TASKS[0].id },
  { type: 'boolean', prop: 'draggable', label: 'Draggable', defaultValue: false },
  { type: 'boolean', prop: 'isMoveMode', label: 'Move Mode', defaultValue: false },
];

const generateCode: CodeGenerator = (state: ControlState): string => {
  const task = MOCK_TASKS.find((t) => t.id === state.selectedTask);
  if (!task) return '<!-- task not found -->';
  const lines: string[] = ['<ZemenTaskCard'];
  lines.push(`  task={{ id: '${task.id}', title: '${task.title}', ... }}`);
  if (state.draggable) {
    lines.push('  draggable');
  }
  if (state.isMoveMode) {
    lines.push('  isMoveMode');
  }
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenTaskCardPlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={(props: Record<string, unknown>) => {
        const task = MOCK_TASKS.find((t) => t.id === String(props.selectedTask)) ?? MOCK_TASKS[0];
        return (
          <ZemenTaskCard
            task={task}
            draggable={!!props.draggable}
            isMoveMode={!!props.isMoveMode}
          />
        );
      }}
      controls={CONTROLS}
      generateCode={generateCode}
    />
  );
}
