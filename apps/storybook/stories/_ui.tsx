import type { CSSProperties, ReactNode } from 'react';
import { Text } from '@box-ui/react';

export function Page({ title, lead, children }: { title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-xl)', maxWidth: 1180 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-3xs)' }}>
        <Text variant="h2">{title}</Text>
        {lead && (
          <Text variant="body-l" tone="secondary">
            {lead}
          </Text>
        )}
      </header>
      {children}
    </div>
  );
}

export function Section({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-2xs)' }}>
      <Text variant="h5">{title}</Text>
      {description && (
        <Text variant="body-m" tone="secondary">
          {description}
        </Text>
      )}
      <div style={{ marginTop: 'var(--box-spacing-base-4xs)' }}>{children}</div>
    </section>
  );
}

export function Grid({ min = 200, gap = '2xs', children }: { min?: number; gap?: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
        gap: `var(--box-spacing-base-${gap})`,
      }}
    >
      {children}
    </div>
  );
}

export type ModeGlobals = { theme: string; accent: string; radius: string; font: string; device: string };

/**
 * Scopes Box UI modes to a subtree.
 *
 * A custom property is substituted where it is *declared*, not where it is
 * read: `--box-background-sentiment-primary: var(--box-colors-brand-primary)`
 * is resolved on the element that declares it. So overriding only
 * `data-accent` deeper in the tree cannot reach a Mode token that `<html>`
 * already resolved. Setting all five attributes together re-declares every
 * layer on this one element, and the whole chain resolves locally.
 */
export function Scope({
  globals,
  theme,
  accent,
  radius,
  font,
  device,
  style,
  children,
}: Partial<ModeGlobals> & { globals: ModeGlobals; style?: CSSProperties; children: ReactNode }) {
  return (
    <div
      data-theme={theme ?? globals.theme}
      data-accent={accent ?? globals.accent}
      data-radius={radius ?? globals.radius}
      data-font={font ?? globals.font}
      data-device={device ?? globals.device}
      style={style}
    >
      {children}
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 'var(--box-typography-caption-l-font-size)',
        color: 'var(--box-content-base-secondary)',
        wordBreak: 'break-all',
      }}
    >
      {children}
    </code>
  );
}

export function Swatch({ cssVar, name, meta }: { cssVar: string; name: string; meta?: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-min)' }}>
      <div
        style={{
          position: 'relative',
          height: 48,
          overflow: 'hidden',
          borderRadius: 'var(--box-rounding-base-xs)',
          border: '1px solid var(--box-border-base-neutral)',
        }}
      >
        {/* checkerboard, so alpha tokens read as translucent */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(45deg, var(--box-control-neutral-primary) 25%, transparent 25%, transparent 75%, var(--box-control-neutral-primary) 75%), linear-gradient(45deg, var(--box-control-neutral-primary) 25%, transparent 25%, transparent 75%, var(--box-control-neutral-primary) 75%)',
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 6px 6px',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: `var(${cssVar})` }} />
      </div>
      <Text variant="caption-l">{name}</Text>
      {meta && (
        <Text variant="caption-m" tone="tertiary">
          {meta}
        </Text>
      )}
    </div>
  );
}

export function Row({ label, value, children }: { label: string; value?: ReactNode; children?: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(180px, 260px) minmax(120px, 200px) 1fr',
        gap: 'var(--box-spacing-base-2xs)',
        alignItems: 'center',
        padding: 'var(--box-spacing-base-4xs) 0',
        borderBottom: '1px solid var(--box-border-base-neutral)',
      }}
    >
      <Code>{label}</Code>
      <Text variant="caption-l" tone="secondary">
        {value}
      </Text>
      <div>{children}</div>
    </div>
  );
}

export const bar = (width: string): CSSProperties => ({
  width,
  height: 12,
  borderRadius: 'var(--box-rounding-base-min)',
  background: 'var(--box-background-sentiment-primary)',
});
