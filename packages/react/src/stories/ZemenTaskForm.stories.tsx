import type { Meta, StoryObj } from '@storybook/react';
import { ZemenTaskForm } from '../components/ZemenTaskForm';
import type { ViewTask } from '../../types';

const sampleTask: ViewTask = { id: '1', title: 'Edit me', dateType: 'ethiopian', primaryYear: 2015, primaryMonth: 1, primaryDay: 1, priority: 'medium', status: 'pending', tags: ['work'] };

const meta: Meta<typeof ZemenTaskForm> = {
  title: 'Forms/ZemenTaskForm',
  component: ZemenTaskForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenTaskForm>;

export const CreateMode: Story = {
  args: { onClose: () => {}, onSubmit: () => {} },
};

export const EditMode: Story = {
  args: { task: sampleTask, onClose: () => {}, onUpdate: () => {} },
};
