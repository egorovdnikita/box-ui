import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  // llms.txt is served from the site root, the way vkui.io publishes theirs.
  staticDirs: ['../public'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // MDX ships without GFM, so tables in Introduction.mdx rendered as raw pipes.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
