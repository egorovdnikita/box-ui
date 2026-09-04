import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import pkg from '../../../package.json' with { type: 'json' };

/**
 * The sidebar said "Storybook" and linked to storybook.js.org. It is the header
 * of a design system, so it says which design system, at which version, and
 * links to the source — the way vkui.io carries its version badge and repository
 * link in the top bar.
 *
 * The manager follows `prefers-color-scheme` on its own; passing a theme would
 * pin it, so only the branding fields are set, spread onto whichever theme the
 * reader is on.
 */
const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

addons.setConfig({
  theme: {
    ...(dark ? themes.dark : themes.light),
    brandTitle: `Box UI ${pkg.version}`,
    brandUrl: 'https://github.com/egorovdnikita/box-ui',
    brandTarget: '_blank',
  },
  sidebar: {
    showRoots: true,
  },
});
