import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

/** Spacing scale from the Grid collection — `spacing/base/*`. */
export type SpaceToken = 'min' | '4xs' | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | '4xl' | 'max';
const space = (token: SpaceToken) => `var(--box-spacing-base-${token})`;

// --- Text --------------------------------------------------------------------

export type TextVariant =
  | 'display-l'
  | 'display-m'
  | 'display-s'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'body-l'
  | 'body-m'
  | 'caption-l'
  | 'caption-m';

export type TextTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'primary-sentiment'
  | 'positive'
  | 'warning'
  | 'negative'
  | 'informative';

const DEFAULT_TAG: Record<TextVariant, ElementType> = {
  'display-l': 'h1',
  'display-m': 'h1',
  'display-s': 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  'body-l': 'p',
  'body-m': 'p',
  'caption-l': 'span',
  'caption-m': 'span',
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  tone?: TextTone;
  as?: ElementType;
  children?: ReactNode;
}

/** Type ramp from the Grid collection — the same token pair resizes on Mobile. */
export function Text({ variant = 'body-m', tone, as, className, children, ...rest }: TextProps) {
  const Tag = as ?? DEFAULT_TAG[variant];
  return (
    <Tag
      className={cx('box-text', `box-text--${variant}`, tone && tone !== 'primary' && `box-text--${tone}`, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// --- Stack -------------------------------------------------------------------

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: SpaceToken;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  children?: ReactNode;
}

export function Stack({
  direction = 'column',
  gap = 'xs',
  align,
  justify,
  wrap,
  className,
  style,
  children,
  ...rest
}: StackProps) {
  return (
    <div
      className={cx('box-stack', `box-stack--${direction}`, className)}
      style={{
        gap: space(gap),
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// --- Card --------------------------------------------------------------------

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'raised' | 'flat' | 'outline';
  padding?: SpaceToken;
  children?: ReactNode;
}

export function Card({ variant = 'raised', padding, className, style, children, ...rest }: CardProps) {
  return (
    <div
      className={cx('box-card', variant !== 'raised' && `box-card--${variant}`, className)}
      style={{ padding: padding && space(padding), ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

// --- Button ------------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'subtle' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 's' | 'm' | 'l';
  iconOnly?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'm', iconOnly, startIcon, endIcon, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'box-button',
        `box-button--${variant}`,
        `box-button--${size}`,
        iconOnly && 'box-button--icon-only',
        className,
      )}
      {...rest}
    >
      {startIcon}
      {!iconOnly && children}
      {endIcon}
    </button>
  );
});

// --- Badge -------------------------------------------------------------------

export type Sentiment = 'primary' | 'informative' | 'positive' | 'warning' | 'negative' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  sentiment?: Sentiment;
  variant?: 'solid' | 'subtle';
  children?: ReactNode;
}

export function Badge({ sentiment = 'neutral', variant = 'subtle', className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx('box-badge', `box-badge--${variant}`, `box-badge--${sentiment}`, className)} {...rest}>
      {children}
    </span>
  );
}

// --- Input -------------------------------------------------------------------

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, className, ...rest },
  ref,
) {
  const inputId = id ?? (label ? `box-input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const message = error ?? hint;

  return (
    <div className="box-field">
      {label && (
        <label className="box-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cx('box-input', className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {message && <span className={cx('box-field__hint', error && 'box-field__hint--error')}>{message}</span>}
    </div>
  );
});
