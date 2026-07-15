import type { Preview } from '@storybook/react';
import '../dist/styles.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: {
      element: '#storybook-root',
      config: {},
      options: {},
    },
  },
  globalTypes: {
    darkMode: {
      description: 'Toggle dark mode',
      defaultValue: false,
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: false, title: 'Light', icon: 'sun' },
          { value: true, title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
