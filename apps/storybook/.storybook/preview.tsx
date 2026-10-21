import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import { themes, type ThemeVars } from 'storybook/theming';
import { IconStyleProvider, type IconStyle } from '@box-ui/icons';
import { INITIAL_MODES, MODE_CONTROLS } from './modes';
import '@box-ui/react/styles.css';
import './preview.css';

/**
 * The page chrome uses Storybook's own palette — its light or dark theme, read
 * from `storybook/theming` rather than copied — and follows the Box UI "Тема"
 * mode: switch Light / Dark and the page background and text switch with it,
 * not only the swatches. Box UI tokens still drive everything inside a demo.
 */
function chromeVars(theme: ThemeVars): Record<string, string> {
  const dark = theme.base === 'dark';
  return {
    '--sb-content-bg': theme.appContentBg,
    '--sb-raised-bg': theme.appBg,
    '--sb-bar-bg': theme.barBg,
    '--sb-border': theme.appBorderColor,
    '--sb-radius': `${theme.appBorderRadius ?? 4}px`,
    // Swatches, keys and segments nested inside a rounded control.
    '--sb-radius-inner': `${Math.max(2, (theme.appBorderRadius ?? 4) / 2)}px`,
    '--sb-text': theme.textColor ?? '',
    '--sb-text-muted': theme.textMutedColor ?? '',
    '--sb-accent': theme.colorSecondary,
    '--sb-input-bg': theme.inputBg,
    '--sb-input-border': theme.inputBorder,
    '--sb-font': theme.fontBase,
    '--sb-font-code': theme.fontCode,
    '--sb-hover': dark ? 'hsl(0 0% 100% / 0.05)' : 'hsl(212 50% 30% / 0.05)',
    '--sb-shadow': dark ? 'hsl(0 0% 0% / 0.4)' : 'hsl(212 50% 30% / 0.12)',
    '--sb-scrollbar': dark ? 'hsl(0 0% 100% / 0.14)' : 'hsl(0 0% 0% / 0.14)',
    '--sb-scrollbar-hover': dark ? 'hsl(0 0% 100% / 0.26)' : 'hsl(0 0% 0% / 0.26)',
  };
}

/** Paints the chrome in Storybook's light or dark theme. */
function applyChrome(mode: string) {
  const theme = mode === 'dark' ? themes.dark : themes.light;
  for (const [name, value] of Object.entries(chromeVars(theme))) {
    document.documentElement.style.setProperty(name, value);
  }
  // Native parts — the scrollbar gutter, form controls — follow the chrome too;
  // left at the default they drew a white strip down the right of dark pages.
  document.documentElement.style.colorScheme = theme.base;
}

// Painted once at boot, before the first story decides the mode.
applyChrome(INITIAL_MODES.theme);

/**
 * One global per switchable Figma variable collection. They have no toolbar
 * entries of their own: manager.tsx draws them together as the "Моды" panel.
 */
const globalTypes: Preview['globalTypes'] = Object.fromEntries(
  MODE_CONTROLS.map((control) => [control.id, { description: `Коллекция Figma «${control.collection}»` }]),
);

const withBoxUiModes: Decorator = (Story, context) => {
  const { theme, accent, radius, font, device, status, appearance, state, iconStyle } = context.globals as Record<
    string,
    string
  >;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    applyChrome(theme);
    root.setAttribute('data-accent', accent);
    root.setAttribute('data-radius', radius);
    root.setAttribute('data-font', font);
    root.setAttribute('data-device', device);
    root.setAttribute('data-status', status);
    root.setAttribute('data-appearance', appearance);
    root.setAttribute('data-state', state);
  }, [theme, accent, radius, font, device, status, appearance, state]);

  return (
    <IconStyleProvider style={iconStyle as IconStyle}>
      <div className="sb-surface">
        <Story />
      </div>
    </IconStyleProvider>
  );
};

const preview: Preview = {
  globalTypes,
  initialGlobals: INITIAL_MODES,

  decorators: [withBoxUiModes],
  parameters: {
    layout: 'fullscreen',
    // Every story here is a documentation page, not a component with args —
    // the addon panel only ever said "this story has no controls".
    options: {
      showPanel: false,
      storySort: {
        order: [
          'Обзор',
          'Токены',
          ['Primitives', 'Brand', 'System'],
          'Иконки',
          ['System', 'Flags', 'Payments', 'Brands'],
        ],
      },
    },
    controls: { disable: true },
    actions: { disable: true },
    interactions: { disable: true },
  },
};

export default preview;
