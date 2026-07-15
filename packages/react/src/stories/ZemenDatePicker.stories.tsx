import type { Meta, StoryObj } from '@storybook/react';
import { ZemenDatePicker } from '../components/ZemenDatePicker';

const meta: Meta<typeof ZemenDatePicker> = {
  title: 'Pickers/ZemenDatePicker',
  component: ZemenDatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenDatePicker>;

export const Default: Story = {
  args: { placeholder: 'Select date...' },
};
