import { forwardRef, type SVGProps } from 'react';
import { useIconStyle } from './IconStyleProvider';
import { useIconSet } from './store';
import type { IconSize, IconStyle } from './types';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /** Solar icon name, e.g. `arrow-up`, `home-smile`, `card-transfer`. */
  name: string;
  /** Figma `Style` variant. Defaults to the nearest `<IconStyleProvider>`. */
  iconStyle?: IconStyle;
  /** `size/base/*` token, or a raw pixel number. */
  size?: IconSize;
  /** Accessible name. Without it the icon is hidden from assistive tech. */
  title?: string;
}

function dimension(size: IconSize): string {
  return typeof size === 'number' ? `${size}px` : `var(--size-${size})`;
}

/**
 * Renders one Solar icon. The geometry paints with `currentColor`, so colour
 * comes from whatever `--surface-base-content-*` token the surrounding text uses.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, iconStyle, size = 'xs', title, style, ...rest },
  ref,
) {
  const contextStyle = useIconStyle();
  const variant = iconStyle ?? contextStyle;
  const { set, pending } = useIconSet(variant);
  const body = set?.[name];
  const box = dimension(size);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      // A size token is a CSS variable, which SVG attributes do not accept: the
      // size lives in `style`; a pixel size is mirrored into the attributes.
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? size : undefined}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      data-icon={name}
      data-icon-style={variant}
      // Marks geometry still standing in for a style that is loading.
      data-icon-pending={pending || undefined}
      style={{ display: 'block', flex: 'none', width: box, height: box, color: 'inherit', ...style }}
      // The bodies come from the generated data files, not from user input.
      dangerouslySetInnerHTML={{ __html: body ?? '' }}
      {...rest}
    />
  );
});
