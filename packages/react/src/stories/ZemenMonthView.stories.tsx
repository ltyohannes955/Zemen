import type { Meta, StoryObj } from '@storybook/react';
import { ZemenMonthView } from '../components/ZemenMonthView';
import type { ViewTask } from '../types';

const sampleTasks: ViewTask[] = [
  { id: '1', title: 'Team standup', dateType: 'ethiopian', primaryYear: 2015, primaryMonth: 1, primaryDay: 7, time: '09:00', priority: 'medium', status: 'pending' },
  { id: '2', title: 'Project review', dateType: 'ethiopian', primaryYear: 2015, primaryMonth: 1, primaryDay: 10, time: '14:00', priority: 'high', status: 'pending' },
  { id: '3', title: 'Gym', dateType: 'ethiopian', primaryYear: 2015, primaryMonth: 1, primaryDay: 15, time: null, priority: 'low', status: 'pending', tags: ['personal'] },
];

const meta: Meta<typeof ZemenMonthView> = {
  title: 'Views/ZemenMonthView',
  component: ZemenMonthView,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenMonthView>;

export const Empty: Story = {
  args: { calendar: 'ethiopian', year: 2015, month: 1, tasks: [] },
};

export const WithTasks: Story = {
  args: { calendar: 'ethiopian', year: 2015, month: 1, tasks: sampleTasks },
};

export const Gregorian: Story = {
  args: { calendar: 'gregorian', year: 2024, month: 6, tasks: sampleTasks },
};

export const Draggable: Story = {
  args: { calendar: 'ethiopian', year: 2015, month: 1, tasks: sampleTasks, disableDragDrop: false },
};

export const DragDisabled: Story = {
  args: { calendar: 'ethiopian', year: 2015, month: 1, tasks: sampleTasks, disableDragDrop: true },
};
