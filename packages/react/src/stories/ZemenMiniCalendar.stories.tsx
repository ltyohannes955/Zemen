import type { Meta, StoryObj } from '@storybook/react';
import { ZemenMiniCalendar } from '../components/ZemenMiniCalendar';

const meta: Meta<typeof ZemenMiniCalendar> = {
  title: 'Views/ZemenMiniCalendar',
  component: ZemenMiniCalendar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenMiniCalendar>;

export const Ethiopian: Story = {
  args: { calendar: 'ethiopian', showHolidays: true },
};

export const Gregorian: Story = {
  args: { calendar: 'gregorian' },
};
