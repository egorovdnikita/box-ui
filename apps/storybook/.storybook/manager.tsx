// The manager bundle compiles JSX in the classic runtime, so React must be in scope.
import React from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
import { Button, PopoverProvider } from 'storybook/internal/components';
import { styled, themes } from 'storybook/theming';
import pkg from '../../../package.json' with { type: 'json' };
import { INITIAL_MODES, MODE_CONTROLS, type ModeControl } from './modes';

/**
 * The sidebar said "Storybook" and linked to storybook.js.org. It is the header
 * of a design system, so it says which design system, at which version, and
 * links to the source — the way vkui.io carries its version badge and repository
 * link in the top bar.
 *
 * The manager follows `prefers-color-scheme` on its own; passing a theme would
 * pin it, so only the branding fields are set, spread onto whichever theme the
 * reader is on.
 */
const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

addons.setConfig({
  theme: {
    ...(dark ? themes.dark : themes.light),
    brandTitle: `Box UI ${pkg.version}`,
    brandUrl: 'https://github.com/egorovdnikita/box-ui',
    brandTarget: '_blank',
  },
  sidebar: {
    showRoots: true,
  },
  // Zoom and remount are for building stories; a reader has the browser's own.
  toolbar: {
    zoom: { hidden: true },
    remount: { hidden: true },
  },
});

/*
 * Modes. Nine toolbar dropdowns read as nine identical blue buttons — "Light",
 * "Deep", "Low" — with nothing saying what each one switches. One button
 * instead, summing up the modes that change these pages, and a panel where
 * every collection is a labelled row of its modes.
 */

const titleOf = (control: ModeControl, value: string) =>
  control.items.find((item) => item.value === value)?.title ?? value;

const Panel = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  width: 440,
  maxWidth: 'calc(100vw - 32px)',
  padding: 12,
  fontSize: theme.typography.size.s1,
}));

const Group = styled.div({ display: 'flex', flexDirection: 'column', gap: 8 });

const GroupTitle = styled.div(({ theme }) => ({
  color: theme.textMutedColor,
  fontSize: 10,
  fontWeight: theme.typography.weight.bold,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
}));

const Row = styled.div({
  display: 'grid',
  gridTemplateColumns: '108px 1fr',
  gap: 8,
  alignItems: 'start',
});

const Label = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 4,
  color: theme.color.defaultText,
  fontWeight: theme.typography.weight.bold,
  '& small': { color: theme.textMutedColor, fontSize: 10, fontWeight: 400 },
}));

const Options = styled.div({ display: 'flex', flexWrap: 'wrap', gap: 4 });

const Option = styled.button(({ theme }) => ({
  height: 24,
  padding: '0 8px',
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
  background: 'none',
  color: theme.color.defaultText,
  fontFamily: 'inherit',
  fontSize: 12,
  cursor: 'pointer',
  '&:hover': { borderColor: theme.color.secondary },
  '&[aria-checked="true"]': {
    borderColor: theme.color.secondary,
    background: theme.color.secondary,
    color: theme.color.lightest,
  },
}));

const Footer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 8,
  borderTop: `1px solid ${theme.appBorderColor}`,
  color: theme.textMutedColor,
}));

const Reset = styled.button(({ theme }) => ({
  padding: 0,
  border: 0,
  background: 'none',
  color: theme.color.secondary,
  fontFamily: 'inherit',
  fontSize: 12,
  cursor: 'pointer',
  '&:disabled': { color: theme.textMutedColor, cursor: 'default' },
}));

const Summary = styled.span({ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' });

function ModesPanel({
  globals,
  update,
}: {
  globals: Record<string, string>;
  update: (patch: Record<string, string>) => void;
}) {
  const changed = MODE_CONTROLS.some((c) => (globals[c.id] ?? INITIAL_MODES[c.id]) !== INITIAL_MODES[c.id]);
  const groups: [ModeControl['group'], string][] = [
    ['main', 'Страницы'],
    ['controls', 'Контролы'],
  ];
  return (
    <Panel>
      {groups.map(([group, title]) => (
        <Group key={group}>
          <GroupTitle>{title}</GroupTitle>
          {MODE_CONTROLS.filter((c) => c.group === group).map((control) => {
            const current = globals[control.id] ?? INITIAL_MODES[control.id];
            return (
              <Row key={control.id}>
                <Label title={control.attribute}>
                  {control.label}
                  <small>{control.collection}</small>
                </Label>
                <Options role="radiogroup" aria-label={control.label}>
                  {control.items.map((item) => (
                    <Option
                      key={item.value}
                      type="button"
                      role="radio"
                      aria-checked={item.value === current}
                      onClick={() => update({ [control.id]: item.value })}
                    >
                      {item.title}
                    </Option>
                  ))}
                </Options>
              </Row>
            );
          })}
        </Group>
      ))}
      <Footer>
        <span>Тема перекрашивает и страницы, остальные моды — только Box UI</span>
        <Reset type="button" disabled={!changed} onClick={() => update({ ...INITIAL_MODES })}>
          Сбросить
        </Reset>
      </Footer>
    </Panel>
  );
}

function ModesTool() {
  const [globals, updateGlobals] = useGlobals();
  const values = globals as Record<string, string>;
  const summary = MODE_CONTROLS.filter((c) => c.group === 'main')
    .map((c) => titleOf(c, values[c.id] ?? INITIAL_MODES[c.id]))
    .join(' · ');

  return (
    <PopoverProvider
      ariaLabel="Моды Box UI"
      placement="bottom-start"
      padding={0}
      popover={<ModesPanel globals={values} update={updateGlobals} />}
    >
      <Button variant="ghost" padding="small" ariaLabel={false} tooltip="Моды Box UI: тема, акцент, скругление…">
        <Summary>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 1.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" />
          </svg>
          Моды
          <span style={{ opacity: 0.65 }}>{summary}</span>
        </Summary>
      </Button>
    </PopoverProvider>
  );
}

addons.register('box-ui/modes', () => {
  addons.add('box-ui/modes/tool', {
    type: types.TOOL,
    title: 'Моды',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => <ModesTool />,
  });
});
