import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import { IconStyleProvider, ICON_STYLES, ICON_STYLE_LABELS, type IconStyle } from '@box-ui/icons';
import '@box-ui/react/styles.css';
import './preview.css';

/**
 * One toolbar control per switchable Figma variable collection.
 *
 *   Theme   -> Tokens / Mode        [data-theme]
 *   Accent  -> Tokens / Color       [data-accent]
 *   Radius  -> Tokens / Rounding    [data-radius]
 *   Type    -> Tokens / Typography  [data-font]
 *   Device  -> Tokens / Grid        [data-device]
 *   Icons   -> Icons / Icon         (icon-style)
 */
const globalTypes: Preview['globalTypes'] = {
  theme: {
    description: 'Figma collection “Mode”',
    toolbar: {
      title: 'Theme',
      icon: 'contrast',
      dynamicTitle: true,
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
    },
  },
  accent: {
    description: 'Figma collection “Color”',
    toolbar: {
      title: 'Accent',
      icon: 'paintbrush',
      dynamicTitle: true,
      items: ['blue', 'sky', 'teal', 'emerald', 'orange', 'amber', 'violet', 'purple', 'cyan', 'yellow'].map((value) => ({
        value,
        title: value[0].toUpperCase() + value.slice(1),
      })),
    },
  },
  radius: {
    description: 'Figma collection “Rounding”',
    toolbar: {
      title: 'Radius',
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
    description: 'Figma collection “Typography”',
    toolbar: {
      title: 'Typeface',
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
    description: 'Figma collection “Grid”',
    toolbar: {
      title: 'Device',
      icon: 'mobile',
      dynamicTitle: true,
      items: [
        { value: 'desktop', title: 'Desktop' },
        { value: 'mobile', title: 'Mobile' },
      ],
    },
  },
  iconStyle: {
    description: 'Figma collection “Icon”',
    toolbar: {
      title: 'Icon style',
      icon: 'star',
      dynamicTitle: true,
      items: ICON_STYLES.map((value) => ({ value, title: ICON_STYLE_LABELS[value] })),
    },
  },
};

const withBoxUiModes: Decorator = (Story, context) => {
  const { theme, accent, radius, font, device, iconStyle } = context.globals as Record<string, string>;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-accent', accent);
    root.setAttribute('data-radius', radius);
    root.setAttribute('data-font', font);
    root.setAttribute('data-device', device);
  }, [theme, accent, radius, font, device]);

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
    accent: 'blue',
    radius: 'medium',
    font: 'inter',
    device: 'desktop',
    iconStyle: 'linear',
  },
  decorators: [withBoxUiModes],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i } },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Icons'],
      },
    },
  },
};

export default preview;
