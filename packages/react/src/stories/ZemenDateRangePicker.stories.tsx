import type { Meta, StoryObj } from '@storybook/react';
import { ZemenDateRangePicker } from '../components/ZemenDateRangePicker';

const meta: Meta<typeof ZemenDateRangePicker> = {
  title: 'Pickers/ZemenDateRangePicker',
  component: ZemenDateRangePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenDateRangePicker>;

export const Ethiopian: Story = {
  args: { calendar: 'ethiopian' },
};

export const Gregorian: Story = {
  args: { calendar: 'gregorian' },
};
