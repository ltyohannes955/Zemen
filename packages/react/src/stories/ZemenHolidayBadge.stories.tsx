import type { Meta, StoryObj } from '@storybook/react';
import { ZemenHolidayBadge } from '../components/ZemenHolidayBadge';

const meta: Meta<typeof ZemenHolidayBadge> = {
  title: 'Components/ZemenHolidayBadge',
  component: ZemenHolidayBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenHolidayBadge>;

export const Enkutatash: Story = {
  args: { ethiopianMonth: 1, ethiopianDay: 1 },
};

export const Genna: Story = {
  args: { ethiopianMonth: 4, ethiopianDay: 29 },
};

export const NotFound: Story = {
  args: { ethiopianMonth: 13, ethiopianDay: 1 },
};
