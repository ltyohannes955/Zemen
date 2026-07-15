import type { Meta, StoryObj } from '@storybook/react';
import { ZemenTaskPill } from '../components/ZemenTaskPill';
import type { ViewTask } from '../../types';

const task: ViewTask = { id: '1', title: 'Team standup', dateType: 'gregorian', primaryYear: 2024, primaryMonth: 6, primaryDay: 10, time: '09:00', priority: 'medium', status: 'pending' };
const highTask: ViewTask = { ...task, id: '2', title: 'Urgent review', priority: 'high' };
const lowTask: ViewTask = { ...task, id: '3', title: 'Read emails', priority: 'low' };

const meta: Meta<typeof ZemenTaskPill> = {
  title: 'Components/ZemenTaskPill',
  component: ZemenTaskPill,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenTaskPill>;

export const Default: Story = { args: { task } };
export const HighPriority: Story = { args: { task: highTask } };
export const LowPriority: Story = { args: { task: lowTask } };
export const WithTime: Story = { args: { task, showTime: true } };
export const MoveMode: Story = { args: { task, isMoveMode: true } };
