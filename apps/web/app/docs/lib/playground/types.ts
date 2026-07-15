export type BooleanControl = {
  type: 'boolean';
  prop: string;
  label: string;
  defaultValue: boolean;
};

export type SelectControl = {
  type: 'select';
  prop: string;
  label: string;
  options: { label: string; value: string }[];
  defaultValue: string;
};

export type TextControl = {
  type: 'text';
  prop: string;
  label: string;
  defaultValue: string;
};

export type ControlDef = BooleanControl | SelectControl | TextControl;

export type ControlState = Record<string, unknown>;
export type CodeGenerator = (state: ControlState) => string;
