import type { Meta, StoryObj } from '@storybook/react';
import { ZemenAgendaView } from '../components/ZemenAgendaView';
import type { ViewTask } from '../types';

const sampleTasks: ViewTask[] = [
  { id: '1', title: 'Team standup', dateType: 'gregorian', primaryYear: 2024, primaryMonth: 6, primaryDay: 10, time: null, priority: 'medium', status: 'pending' },
  { id: '2', title: 'Project deadline', dateType: 'gregorian', primaryYear: 2024, primaryMonth: 6, primaryDay: 12, time: null, priority: 'high', status: 'pending' },
];

const meta: Meta<typeof ZemenAgendaView> = {
  title: 'Views/ZemenAgendaView',
  component: ZemenAgendaView,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenAgendaView>;

export const Empty: Story = {
  args: { tasks: [], daysAhead: 7 },
};

export const WithTasks: Story = {
  args: { tasks: sampleTasks, daysAhead: 14 },
};
