import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  // llms.txt is served from the site root, the way vkui.io publishes theirs.
  staticDirs: ['../public'],
  addons: ['@storybook/addon-docs'],
  // Tools for building stories, not for reading docs: they cluttered the toolbar.
  features: {
    backgrounds: false,
    measure: false,
    outline: false,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
