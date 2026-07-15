import type { Meta, StoryObj } from '@storybook/react';
import { ZemenWeekView } from '../components/ZemenWeekView';
import type { ViewTask } from '../../types';

const sampleTasks: ViewTask[] = [
  { id: '1', title: 'Standup', dateType: 'gregorian', primaryYear: 2024, primaryMonth: 6, primaryDay: 10, time: '09:00', priority: 'medium', status: 'pending' },
  { id: '2', title: 'Lunch', dateType: 'gregorian', primaryYear: 2024, primaryMonth: 6, primaryDay: 10, time: '12:00', priority: 'low', status: 'pending' },
  { id: '3', title: 'Review PR', dateType: 'gregorian', primaryYear: 2024, primaryMonth: 6, primaryDay: 11, time: '15:00', priority: 'high', status: 'pending' },
];

const meta: Meta<typeof ZemenWeekView> = {
  title: 'Views/ZemenWeekView',
  component: ZemenWeekView,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenWeekView>;

export const Empty: Story = {
  args: { date: new Date(2024, 5, 10), tasks: [] },
};

export const WithTasks: Story = {
  args: { date: new Date(2024, 5, 10), tasks: sampleTasks },
};

export const DragDisabled: Story = {
  args: { date: new Date(2024, 5, 10), tasks: sampleTasks, disableDragDrop: true },
};
