import type { Meta, StoryObj } from '@storybook/react';
import { ZemenQuickAdd } from '../components/ZemenQuickAdd';

const meta: Meta<typeof ZemenQuickAdd> = {
  title: 'Forms/ZemenQuickAdd',
  component: ZemenQuickAdd,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenQuickAdd>;

export const Closed: Story = {
  args: { open: false, onClose: () => {}, onSubmit: () => {} },
};

export const Open: Story = {
  args: { open: true, onClose: () => {}, onSubmit: () => {} },
};
