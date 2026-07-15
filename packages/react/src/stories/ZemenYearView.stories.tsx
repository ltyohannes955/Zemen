import type { Meta, StoryObj } from '@storybook/react';
import { ZemenYearView } from '../components/ZemenYearView';

const meta: Meta<typeof ZemenYearView> = {
  title: 'Views/ZemenYearView',
  component: ZemenYearView,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenYearView>;

export const Ethiopian: Story = {
  args: { calendar: 'ethiopian', year: 2015 },
};

export const Gregorian: Story = {
  args: { calendar: 'gregorian', year: 2024 },
};
