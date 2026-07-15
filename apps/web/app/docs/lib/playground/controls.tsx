'use client';

import * as React from 'react';
import type { ControlDef, ControlState, BooleanControl, SelectControl, TextControl } from './types';

export function PlaygroundControls({
  controls,
  state,
  onChange,
}: {
  controls: ControlDef[];
  state: ControlState;
  onChange: (prop: string, value: unknown) => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">Controls</div>
      {controls.map((control) => {
        switch (control.type) {
          case 'boolean':
            return <BooleanToggle key={control.prop} control={control} value={!!state[control.prop]} onChange={onChange} />;
          case 'select':
            return <SelectDropdown key={control.prop} control={control} value={String(state[control.prop] ?? control.defaultValue)} onChange={onChange} />;
          case 'text':
            return <TextInput key={control.prop} control={control} value={String(state[control.prop] ?? control.defaultValue)} onChange={onChange} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function BooleanToggle({
  control,
  value,
  onChange,
}: {
  control: BooleanControl;
  value: boolean;
  onChange: (prop: string, value: unknown) => void;
}): React.JSX.Element {
  const id = `ctrl-${control.prop}`;
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{control.label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(control.prop, !value)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          value ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            value ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

function SelectDropdown({
  control,
  value,
  onChange,
}: {
  control: SelectControl;
  value: string;
  onChange: (prop: string, value: unknown) => void;
}): React.JSX.Element {
  const id = `ctrl-${control.prop}`;
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">{control.label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(control.prop, e.target.value)}
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
      >
        {control.options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function TextInput({
  control,
  value,
  onChange,
}: {
  control: TextControl;
  value: string;
  onChange: (prop: string, value: unknown) => void;
}): React.JSX.Element {
  const id = `ctrl-${control.prop}`;
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">{control.label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(control.prop, e.target.value)}
        className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
      />
    </div>
  );
}
