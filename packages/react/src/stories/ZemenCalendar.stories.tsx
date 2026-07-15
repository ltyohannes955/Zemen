import type { Meta, StoryObj } from '@storybook/react';
import { ZemenCalendar } from '../components/ZemenCalendar';

const meta: Meta<typeof ZemenCalendar> = {
  title: 'Views/ZemenCalendar',
  component: ZemenCalendar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ZemenCalendar>;

export const EthiopianLight: Story = {
  args: { calendar: 'ethiopian', locale: 'en' },
};

export const GregorianLight: Story = {
  args: { calendar: 'gregorian', locale: 'en' },
};

export const WithSelection: Story = {
  args: {
    calendar: 'ethiopian',
    selectedDate: { ethYear: 2015, ethMonth: 1, ethDay: 1 },
  },
};
