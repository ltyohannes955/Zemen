import type { Meta, StoryObj } from '@storybook/react';
import { ZemenTaskCard } from '../components/ZemenTaskCard';
import type { ViewTask } from '../../types';

const task: ViewTask = { id: '1', title: 'Design review', dateType: 'gregorian', primaryYear: 2024, primaryMonth: 6, primaryDay: 10, priority: 'medium', status: 'pending', tags: ['design', 'frontend'] };

const meta: Meta<typeof ZemenTaskCard> = {
  title: 'Components/ZemenTaskCard',
  component: ZemenTaskCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenTaskCard>;

export const Default: Story = { args: { task } };
export const Draggable: Story = { args: { task, draggable: true } };
export const MoveMode: Story = { args: { task, isMoveMode: true } };
