import { useEffect, useMemo, type ReactNode } from 'react';
import { IconStyleProvider, type IconStyle } from '@box-ui/icons';

export type ThemeMode = 'light' | 'dark';
export type AccentMode = 'indigo' | 'lime' | 'yellow' | 'pink' | 'monochrome';
export type RadiusMode = 'low' | 'medium' | 'high';
export type FontMode = 'inter' | 'inter-display' | 'inter-tight' | 'inter-variable';
export type DeviceMode = 'desktop' | 'mobile';
export type StatusMode = 'positive' | 'warning' | 'negative' | 'information';
export type AppearanceMode = 'solid' | 'soft' | 'outline';
export type StateMode = 'default' | 'hover' | 'active' | 'disabled';

export interface BoxUISettings {
  theme?: ThemeMode;
  accent?: AccentMode;
  radius?: RadiusMode;
  font?: FontMode;
  device?: DeviceMode;
  /** Sentiment for the Status collection — what `status/*` tokens resolve to. */
  status?: StatusMode;
  /** Fill style for controls — what `control/*` and `state/*` tokens resolve to. */
  appearance?: AppearanceMode;
  /**
   * Forces a control state. Normally left unset: `controls.css` drives this
   * from :hover / :active / :disabled. Pin it to document every state at once.
   */
  state?: StateMode;
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
  status: 'data-status',
  appearance: 'data-appearance',
  state: 'data-state',
  iconStyle: 'data-icon-style',
} as const;

type ModeKey = keyof typeof MODE_ATTRIBUTES;

function attributesFor(settings: BoxUISettings): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const [key, attribute] of Object.entries(MODE_ATTRIBUTES)) {
    const value = settings[key as ModeKey];
    if (value) attrs[attribute] = value;
  }
  return attrs;
}

/**
 * Applies Box UI modes. Every mode maps to one Figma variable collection:
 * theme -> System · Theme, accent -> Brand · Color, radius -> Brand · Rounding,
 * font -> Brand · Typography, device -> System · Responsive,
 * status -> System · Status, appearance -> Controls · Appearance,
 * state -> Controls · State, iconStyle -> Brand · Icon.
 */
export function BoxUIProvider({ target = 'local', className, children, ...settings }: BoxUIProviderProps) {
  const { theme, accent, radius, font, device, status, appearance, state, iconStyle } = settings;

  // Memoised on the mode primitives so the effect below can depend on `attrs`
  // itself. It used to depend on `JSON.stringify(attrs)`, which worked but was
  // opaque to both the reader and the exhaustive-deps check.
  const attrs = useMemo(
    () => attributesFor({ theme, accent, radius, font, device, status, appearance, state, iconStyle }),
    [theme, accent, radius, font, device, status, appearance, state, iconStyle],
  );

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
  }, [target, attrs]);

  const content = <IconStyleProvider style={iconStyle ?? 'linear'}>{children}</IconStyleProvider>;

  if (target === 'root') return content;
  return (
    <div className={className} {...attrs}>
      {content}
    </div>
  );
}
