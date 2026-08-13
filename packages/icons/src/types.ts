/** The six `Style` variants of the `Icon` collection in `Box UI | Icons`. */
export type IconStyle = 'bold' | 'bold-duotone' | 'broken' | 'line-duotone' | 'linear' | 'outline';

export const ICON_STYLES: IconStyle[] = ['bold', 'bold-duotone', 'broken', 'line-duotone', 'linear', 'outline'];

/** Human labels, exactly as the modes are named in Figma. */
export const ICON_STYLE_LABELS: Record<IconStyle, string> = {
  bold: 'Bold',
  'bold-duotone': 'Bold Duotone',
  broken: 'Broken',
  'line-duotone': 'Line Duotone',
  linear: 'Linear',
  outline: 'Outline',
};

/**
 * Icon sizes are `size/base/*` from the Grid collection, so they follow
 * `[data-device]` just like every other size token. A plain number is
 * accepted as an escape hatch and rendered as px.
 */
export type IconSizeToken = 'min' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | 'max';
export type IconSize = IconSizeToken | number;

export const ICON_SIZES: IconSizeToken[] = ['min', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', 'max'];

/** Desktop px value of each size token — for documentation only; the CSS variable is authoritative. */
export const ICON_SIZE_PX: Record<IconSizeToken, number> = {
  min: 16,
  '2xs': 20,
  xs: 24,
  s: 28,
  m: 32,
  l: 36,
  xl: 40,
  '2xl': 44,
  max: 48,
};

export type IconSet = Record<string, string>;
