import type { Meta, StoryObj } from '@storybook/react';
import { ZemenDayView } from '../components/ZemenDayView';
import type { ViewTask } from '../../types';

const sampleTasks: ViewTask[] = [
  { id: '1', title: 'Morning standup', dateType: 'gregorian', primaryYear: 2024, primaryMonth: 6, primaryDay: 10, time: '09:00', priority: 'medium', status: 'pending' },
  { id: '2', title: 'Code review', dateType: 'gregorian', primaryYear: 2024, primaryMonth: 6, primaryDay: 10, time: '11:00', priority: 'high', status: 'pending' },
  { id: '3', title: 'Lunch break', dateType: 'gregorian', primaryYear: 2024, primaryMonth: 6, primaryDay: 10, time: '12:30', priority: 'low', status: 'pending' },
];

const meta: Meta<typeof ZemenDayView> = {
  title: 'Views/ZemenDayView',
  component: ZemenDayView,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenDayView>;

export const Empty: Story = {
  args: { date: new Date(2024, 5, 10), tasks: [] },
};

export const WithTasks: Story = {
  args: { date: new Date(2024, 5, 10), tasks: sampleTasks },
};

export const DragDisabled: Story = {
  args: { date: new Date(2024, 5, 10), tasks: sampleTasks, disableDragDrop: true },
};
