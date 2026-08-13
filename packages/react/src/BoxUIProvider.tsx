import { useEffect, type ReactNode } from 'react';
import { IconStyleProvider, type IconStyle } from '@box-ui/icons';

export type ThemeMode = 'light' | 'dark';
export type AccentMode = 'blue' | 'sky' | 'teal' | 'emerald' | 'orange' | 'amber' | 'violet' | 'purple' | 'cyan' | 'yellow';
export type RadiusMode = 'low' | 'medium' | 'high';
export type FontMode = 'inter' | 'inter-display' | 'inter-tight' | 'inter-variable';
export type DeviceMode = 'desktop' | 'mobile';

export interface BoxUISettings {
  theme?: ThemeMode;
  accent?: AccentMode;
  radius?: RadiusMode;
  font?: FontMode;
  device?: DeviceMode;
  iconStyle?: IconStyle;
}

export interface BoxUIProviderProps extends BoxUISettings {
  /**
   * Where the `data-*` attributes go. `root` writes them on `<html>` so the
   * whole document switches; `local` wraps the children in a `<div>` instead,
   * which lets two themes sit side by side on one page.
   */
  target?: 'root' | 'local';
  className?: string;
  children: ReactNode;
}

/** Figma collection -> the HTML attribute that selects its mode. */
export const MODE_ATTRIBUTES = {
  theme: 'data-theme',
  accent: 'data-accent',
  radius: 'data-radius',
  font: 'data-font',
  device: 'data-device',
} as const;

function attributesFor(settings: BoxUISettings): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const [key, attribute] of Object.entries(MODE_ATTRIBUTES)) {
    const value = settings[key as keyof typeof MODE_ATTRIBUTES];
    if (value) attrs[attribute] = value;
  }
  return attrs;
}

/**
 * Applies Box UI modes. Every mode maps to one Figma variable collection:
 * theme -> Mode, accent -> Color, radius -> Rounding, font -> Typography,
 * device -> Grid, iconStyle -> the `Icon` collection.
 */
export function BoxUIProvider({ target = 'local', className, children, ...settings }: BoxUIProviderProps) {
  const attrs = attributesFor(settings);

  useEffect(() => {
    if (target !== 'root' || typeof document === 'undefined') return;
    const root = document.documentElement;
    const previous = Object.fromEntries(Object.keys(attrs).map((a) => [a, root.getAttribute(a)]));
    for (const [attribute, value] of Object.entries(attrs)) root.setAttribute(attribute, value);
    return () => {
      for (const [attribute, value] of Object.entries(previous)) {
        if (value === null) root.removeAttribute(attribute);
        else root.setAttribute(attribute, value);
      }
    };
  }, [target, JSON.stringify(attrs)]);

  const content = <IconStyleProvider style={settings.iconStyle ?? 'linear'}>{children}</IconStyleProvider>;

  if (target === 'root') return content;
  return (
    <div className={className} {...attrs}>
      {content}
    </div>
  );
}
