import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import { themes, type ThemeVars } from 'storybook/theming';
import { IconStyleProvider, ICON_STYLES, ICON_STYLE_LABELS, type IconStyle } from '@box-ui/icons';
import '@box-ui/react/styles.css';
import './preview.css';

/**
 * The docs chrome is Storybook's, not Box UI's — same background as the toolbar
 * above the canvas, same type, same borders. These are Storybook's own theme
 * values, read from `storybook/theming` rather than copied, so the canvas can
 * never drift from the manager around it.
 *
 * Box UI tokens still drive everything *inside* a demo: swatches, type samples,
 * the rounding cards. Those carry their own background and foreground, so they
 * keep reading correctly whichever chrome they sit on.
 */
function chromeVars(theme: ThemeVars): Record<string, string> {
  const dark = theme.base === 'dark';
  return {
    '--sb-content-bg': theme.appContentBg,
    '--sb-raised-bg': theme.appBg,
    '--sb-bar-bg': theme.barBg,
    '--sb-border': theme.appBorderColor,
    '--sb-radius': `${theme.appBorderRadius ?? 4}px`,
    '--sb-text': theme.textColor ?? '',
    '--sb-text-muted': theme.textMutedColor ?? '',
    '--sb-accent': theme.colorSecondary,
    '--sb-input-bg': theme.inputBg,
    '--sb-input-border': theme.inputBorder,
    '--sb-font': theme.fontBase,
    '--sb-font-code': theme.fontCode,
    '--sb-hover': dark ? 'hsl(0 0% 100% / 0.05)' : 'hsl(212 50% 30% / 0.05)',
    '--sb-shadow': dark ? 'hsl(0 0% 0% / 0.4)' : 'hsl(212 50% 30% / 0.12)',
  };
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

/** The Storybook theme the manager is currently on. */
const storybookTheme = () => (prefersDark.matches ? themes.dark : themes.light);

/**
 * Applied at preview boot rather than from a decorator: MDX pages with no
 * stories never run decorators, and they were the one surface still rendering
 * in Storybook's default light while the chrome around it was dark.
 */
function applyChrome() {
  for (const [name, value] of Object.entries(chromeVars(storybookTheme()))) {
    document.documentElement.style.setProperty(name, value);
  }
}

applyChrome();
prefersDark.addEventListener('change', applyChrome);

/**
 * One toolbar control per switchable Figma variable collection.
 *
 *   Theme       -> ◑ System · Theme                  [data-theme]
 *   Accent      -> ☯︎ Brand · Color                   [data-accent]
 *   Radius      -> ☯︎ Brand · Rounding                [data-radius]
 *   Type        -> ☯︎ Brand · Typography              [data-font]
 *   Device      -> ◑ System · Responsive             [data-device]
 *   Status      -> ◑ System · Status                 [data-status]
 *   Appearance  -> ◑ System · Controls · Appearance  [data-appearance]
 *   State       -> ◑ System · Controls · State       [data-state]
 *   Icons       -> ☯︎ Brand · Icon                    (icon-style)
 */
const globalTypes: Preview['globalTypes'] = {
  theme: {
    description: 'Коллекция Figma «System · Theme»',
    toolbar: {
      title: 'Тема',
      icon: 'contrast',
      dynamicTitle: true,
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
    },
  },
  accent: {
    description: 'Коллекция Figma «Brand · Color»',
    toolbar: {
      title: 'Акцент',
      icon: 'paintbrush',
      dynamicTitle: true,
      items: ['indigo', 'lime', 'yellow', 'pink', 'monochrome'].map((value) => ({
        value,
        title: value[0].toUpperCase() + value.slice(1),
      })),
    },
  },
  radius: {
    description: 'Коллекция Figma «Brand · Rounding»',
    toolbar: {
      title: 'Скругление',
      icon: 'component',
      dynamicTitle: true,
      items: [
        { value: 'low', title: 'Low' },
        { value: 'medium', title: 'Medium' },
        { value: 'high', title: 'High' },
      ],
    },
  },
  font: {
    description: 'Коллекция Figma «Brand · Typography»',
    toolbar: {
      title: 'Гарнитура',
      icon: 'type',
      dynamicTitle: true,
      items: [
        { value: 'inter', title: 'Inter' },
        { value: 'inter-display', title: 'Inter Display' },
        { value: 'inter-tight', title: 'Inter Tight' },
        { value: 'inter-variable', title: 'Inter Variable' },
      ],
    },
  },
  device: {
    description: 'Коллекция Figma «System · Responsive»',
    toolbar: {
      title: 'Устройство',
      icon: 'mobile',
      dynamicTitle: true,
      items: [
        { value: 'desktop', title: 'Desktop' },
        { value: 'mobile', title: 'Mobile' },
      ],
    },
  },
  status: {
    description: 'Коллекция Figma «System · Status»',
    toolbar: {
      title: 'Статус',
      icon: 'bell',
      dynamicTitle: true,
      items: [
        { value: 'positive', title: 'Positive' },
        { value: 'warning', title: 'Warning' },
        { value: 'negative', title: 'Negative' },
        { value: 'information', title: 'Information' },
      ],
    },
  },
  appearance: {
    description: 'Коллекция Figma «Controls · Appearance»',
    toolbar: {
      title: 'Вид контрола',
      icon: 'box',
      dynamicTitle: true,
      items: [
        { value: 'solid', title: 'Solid' },
        { value: 'soft', title: 'Soft' },
        { value: 'outline', title: 'Outline' },
      ],
    },
  },
  state: {
    description: 'Коллекция Figma «Controls · State» — обычно её ведут :hover/:active/:disabled',
    toolbar: {
      title: 'Состояние',
      icon: 'pointerhand',
      dynamicTitle: true,
      items: [
        { value: 'default', title: 'Default' },
        { value: 'hover', title: 'Hover' },
        { value: 'active', title: 'Active' },
        { value: 'disabled', title: 'Disabled' },
      ],
    },
  },
  iconStyle: {
    description: 'Коллекция Figma «Brand · Icon»',
    toolbar: {
      title: 'Стиль иконок',
      icon: 'star',
      dynamicTitle: true,
      items: ICON_STYLES.map((value) => ({ value, title: ICON_STYLE_LABELS[value] })),
    },
  },
};

const withBoxUiModes: Decorator = (Story, context) => {
  const { theme, accent, radius, font, device, status, appearance, state, iconStyle } = context.globals as Record<
    string,
    string
  >;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
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
  initialGlobals: {
    theme: 'light',
    accent: 'indigo',
    radius: 'low',
    font: 'inter',
    device: 'desktop',
    status: 'positive',
    appearance: 'solid',
    state: 'default',
    iconStyle: 'linear',
  },
  decorators: [withBoxUiModes],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    // MDX pages render Storybook's docs chrome — hand it the same theme.
    docs: { theme: storybookTheme() },
    // Every story here is a documentation page, not a component with args —
    // the addon panel only ever said "this story has no controls".
    options: {
      showPanel: false,
      storySort: {
        order: ['Обзор', 'Начало работы', 'Основы', 'Контролы', 'Иконки'],
      },
    },
    controls: { disable: true },
    actions: { disable: true },
    interactions: { disable: true },
  },
};

export default preview;
