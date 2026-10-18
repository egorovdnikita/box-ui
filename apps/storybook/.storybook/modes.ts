/**
 * The switchable Figma collections, as one list both halves of Storybook read:
 * preview.tsx declares a global per entry and puts its attribute on `<html>`,
 * manager.tsx draws the "Моды" panel from it.
 *
 * Kept free of package imports — the manager bundle should not pull in the
 * token model or the icon catalogue just to label a few buttons.
 */

export interface ModeControl {
  /** Global name in Storybook. */
  id: string;
  label: string;
  /** The Figma collection, as the file names it. */
  collection: string;
  /** The attribute it is set with, or how it is applied. */
  attribute: string;
  /**
   * `main` drives every page; `controls` only reaches a control's own tokens
   * and is otherwise invisible on these pages.
   */
  group: 'main' | 'controls';
  items: { value: string; title: string }[];
}

const items = (...pairs: [string, string][]) => pairs.map(([value, title]) => ({ value, title }));

export const MODE_CONTROLS: ModeControl[] = [
  {
    id: 'theme',
    label: 'Тема',
    collection: 'System · Theme',
    attribute: 'data-theme',
    group: 'main',
    items: items(['light', 'Light'], ['dark', 'Dark']),
  },
  {
    id: 'accent',
    label: 'Акцент',
    collection: 'Brand · Color',
    attribute: 'data-accent',
    group: 'main',
    items: items(['deep', 'Deep'], ['bright', 'Bright'], ['monochrome', 'Monochrome']),
  },
  {
    id: 'radius',
    label: 'Скругление',
    collection: 'Brand · Rounding',
    attribute: 'data-radius',
    group: 'main',
    items: items(['low', 'Low'], ['medium', 'Medium'], ['high', 'High']),
  },
  {
    id: 'font',
    label: 'Гарнитура',
    collection: 'Brand · Typography',
    attribute: 'data-font',
    group: 'main',
    items: items(
      ['inter', 'Inter'],
      ['inter-display', 'Inter Display'],
      ['inter-tight', 'Inter Tight'],
      ['inter-variable', 'Inter Variable'],
    ),
  },
  {
    id: 'device',
    label: 'Устройство',
    collection: 'System · Responsive',
    attribute: 'data-device',
    group: 'main',
    items: items(['desktop', 'Desktop'], ['mobile', 'Mobile']),
  },
  {
    id: 'iconStyle',
    label: 'Иконки',
    collection: 'Brand · Icon',
    attribute: 'IconStyleProvider',
    group: 'main',
    items: items(
      ['bold', 'Bold'],
      ['bold-duotone', 'Bold Duotone'],
      ['broken', 'Broken'],
      ['line-duotone', 'Line Duotone'],
      ['linear', 'Linear'],
      ['outline', 'Outline'],
    ),
  },
  {
    id: 'status',
    label: 'Статус',
    collection: 'System · Status',
    attribute: 'data-status',
    group: 'controls',
    items: items(
      ['positive', 'Positive'],
      ['warning', 'Warning'],
      ['negative', 'Negative'],
      ['information', 'Information'],
    ),
  },
  {
    id: 'appearance',
    label: 'Вид',
    collection: 'Controls · Appearance',
    attribute: 'data-appearance',
    group: 'controls',
    items: items(['solid', 'Solid'], ['soft', 'Soft'], ['outline', 'Outline']),
  },
  {
    id: 'state',
    label: 'Состояние',
    collection: 'Controls · State',
    attribute: 'data-state',
    group: 'controls',
    items: items(['default', 'Default'], ['hover', 'Hover'], ['active', 'Active'], ['disabled', 'Disabled']),
  },
];

export const INITIAL_MODES: Record<string, string> = {
  theme: 'light',
  accent: 'deep',
  radius: 'low',
  font: 'inter',
  device: 'desktop',
  iconStyle: 'linear',
  status: 'positive',
  appearance: 'solid',
  state: 'default',
};
