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

/** Spacing scale from the Responsive collection — `spacing/base/*`. */
export type SpaceToken = 'min' | '4xs' | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | '4xl' | 'max';
const space = (token: SpaceToken) => `var(--box-spacing-base-${token})`;

/**
 * The control families of the Figma `Controls · Appearance` collection, plus
 * `ghost`, which lives in `Controls · State` on its own.
 */
export type ControlFamily = 'accent' | 'status' | 'static' | 'neutral' | 'ghost';

/** Modes of `Controls · Appearance`. */
export type ControlAppearance = 'solid' | 'soft' | 'outline';

/** Modes of `System · Status`. */
export type StatusTone = 'positive' | 'warning' | 'negative' | 'information';

/** Modes of `Controls · State`. */
export type ControlState = 'default' | 'hover' | 'active' | 'disabled';

/**
 * The attributes a control needs for its tokens to resolve on the element.
 *
 * `data-state` is not decoration: a custom property is substituted where it is
 * declared, so a control that set only `data-appearance` would read a
 * `--box-state-*` value its ancestor had already resolved under the ancestor's
 * appearance. Re-declaring the State layer here puts the substitution back on
 * this element, and the :hover / :active / :disabled rules in `controls.css`
 * out-specify it when the control is actually interacted with.
 *
 * `data-box-control` is what opts into those rules.
 */
function controlAttributes(
  family: ControlFamily,
  appearance: ControlAppearance,
  state: ControlState,
  status?: StatusTone,
) {
  return {
    'data-box-control': '',
    'data-appearance': appearance,
    'data-state': state,
    'data-status': family === 'status' ? (status ?? 'negative') : undefined,
  };
}

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

export type TextTone = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'accent' | StatusTone;

const STATUS_TONES: StatusTone[] = ['positive', 'warning', 'negative', 'information'];
const isStatusTone = (tone: TextTone): tone is StatusTone => (STATUS_TONES as TextTone[]).includes(tone);

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

/** Type ramp from the Responsive collection — the same token pair resizes on Mobile. */
export function Text({ variant = 'body-m', tone = 'primary', as, className, children, ...rest }: TextProps) {
  const Tag = as ?? DEFAULT_TAG[variant];
  const status = isStatusTone(tone);
  return (
    <Tag
      className={cx(
        'box-text',
        `box-text--${variant}`,
        status ? 'box-text--status' : tone !== 'primary' && `box-text--${tone}`,
        className,
      )}
      data-status={status ? tone : undefined}
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

/** Figma variant sizes: XS (32), S (36), M (40), L (44), XL (48). */
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Which Figma button set this is: Priority (`accent`), Status, Static or Neutral. */
  family?: ControlFamily;
  appearance?: ControlAppearance;
  /** Which sentiment, when `family` is `status`. */
  status?: StatusTone;
  /**
   * Pins the control to one State mode. Normally left alone — `controls.css`
   * drives it from :hover / :active / :disabled. Set it to document every
   * state side by side.
   */
  state?: ControlState;
  size?: ButtonSize;
  iconOnly?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    family = 'accent',
    appearance = 'solid',
    status,
    state = 'default',
    size = 'm',
    iconOnly,
    startIcon,
    endIcon,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'box-button',
        `box-control--${family}`,
        `box-button--${size}`,
        iconOnly && 'box-button--icon-only',
        className,
      )}
      {...controlAttributes(family, appearance, state, status)}
      {...rest}
    >
      {startIcon}
      {!iconOnly && children}
      {endIcon}
    </button>
  );
});

// --- Badge -------------------------------------------------------------------

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  family?: ControlFamily;
  appearance?: ControlAppearance;
  status?: StatusTone;
  state?: ControlState;
  children?: ReactNode;
}

export function Badge({
  family = 'neutral',
  appearance = 'soft',
  status,
  state = 'default',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cx('box-badge', `box-control--${family}`, className)}
      {...controlAttributes(family, appearance, state, status)}
      {...rest}
    >
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
    <div className="box-field" data-status={error ? 'negative' : undefined}>
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
