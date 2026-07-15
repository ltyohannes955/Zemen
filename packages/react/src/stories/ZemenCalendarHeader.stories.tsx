import type { Meta, StoryObj } from '@storybook/react';
import { ZemenCalendarHeader } from '../components/ZemenCalendarHeader';

const meta: Meta<typeof ZemenCalendarHeader> = {
  title: 'Views/ZemenCalendarHeader',
  component: ZemenCalendarHeader,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenCalendarHeader>;

export const Ethiopian: Story = {
  args: { year: 2015, month: 1, calendar: 'ethiopian' },
};

export const Gregorian: Story = {
  args: { year: 2024, month: 6, calendar: 'gregorian' },
};
