import type { Meta, StoryObj } from '@storybook/react-vite';
import { C, CodeBlock, ModeTable, NextSteps, P } from './_docs';
import { Page, Section } from './_ui';

// `id` and the export name keep the old MDX address, getting-started--docs.
const meta: Meta = { id: 'getting-started', title: 'Начало работы' };
export default meta;

const stack = { display: 'flex', flexDirection: 'column', gap: 10 } as const;

export const Docs: StoryObj = {
  name: 'Начало работы',
  render: () => (
    <Page
      title="Начало работы"
      lead="Три пакета, и ни в одном нет литерального цвета, радиуса или размера: всё приходит из переменных Figma через @box-ui/tokens."
    >
      <Section title="1. Установите">
        <CodeBlock code="npm i @box-ui/tokens @box-ui/icons @box-ui/react" />
      </Section>

      <Section title="2. Подключите CSS">
        <div style={stack}>
          <CodeBlock code="import '@box-ui/tokens/css';" />
          <P>
            Это <C>primitives.css</C> — фиксированные значения на <C>:root</C> — и <C>theme.css</C>, по блоку на каждую
            моду Figma, которые выбираются атрибутами <C>data-*</C>. Их можно подключить и по отдельности.
          </P>
          <CodeBlock
            label="Необязательно — моды из настроек системы"
            code="import '@box-ui/tokens/css/adaptive.css';"
          />
          <P>
            Тёмная тема берётся из <C>prefers-color-scheme</C>, Mobile — ниже 768px, но только если документ сам не
            выставил эти атрибуты.
          </P>
        </div>
      </Section>

      <Section
        title="3. Выберите моды"
        description="Каждая переключаемая коллекция Figma — один атрибут. Выделено значение по умолчанию."
      >
        <div style={stack}>
          <ModeTable />
          <CodeBlock
            label="Атрибуты на <html> — и за ними пойдёт весь документ"
            code={`<html data-theme="dark" data-accent="bright" data-radius="high" data-device="mobile"></html>`}
          />
          <CodeBlock
            label="Или через провайдер"
            code={`import { BoxUIProvider } from '@box-ui/react';

<BoxUIProvider target="root" theme="dark" accent="bright" radius="high">
  <App />
</BoxUIProvider>;`}
          />
          <P>
            По умолчанию <C>target="local"</C>: провайдер оборачивает детей в <C>{'<div>'}</C> со всеми атрибутами — так
            две темы уживаются на одной странице.
          </P>
        </div>
      </Section>

      <Section title="4. Пользуйтесь токенами">
        <div style={stack}>
          <CodeBlock
            label="CSS — по имени из Code syntax в Figma"
            code={`.card {
  background: var(--surface-base-fill-raised);
  color: var(--surface-base-content-strong);
  border-radius: var(--rounding-m);
  padding: var(--spacing-m);
}`}
          />
          <CodeBlock
            label="JS — с автодополнением"
            code={`import { theme, layout } from '@box-ui/tokens';

theme.surface.base.fill.raised; // 'var(--surface-base-fill-raised)'
layout.spacing.base.m; // 'var(--spacing-m)'`}
          />
          <P>
            В <C>model</C> лежит весь граф — коллекции, моды и то, на что ссылается каждая переменная. Из него собраны
            таблицы этого Storybook.
          </P>
        </div>
      </Section>

      <Section title="5. Иконки">
        <div style={stack}>
          <CodeBlock
            code={`import { Icon, IconStyleProvider } from '@box-ui/icons';

<Icon name="home-smile" size="l" title="Home" />

<IconStyleProvider style="bold-duotone">
  <Icon name="shield-check" size="m" />
</IconStyleProvider>;`}
          />
          <P>
            Размеры — токены <C>size/base/*</C>, поэтому иконка слушается <C>data-device</C>, а красится она{' '}
            <C>currentColor</C>. Каждый стиль — отдельный <C>import()</C>: приложение везёт только то, что рисует. Без{' '}
            <C>title</C> иконка скрыта от вспомогательных технологий — так и нужно для декоративных.
          </P>
        </div>
      </Section>

      <Section title="Куда дальше">
        <div style={stack}>
          <NextSteps
            items={[
              {
                story: 'introduction--docs',
                title: 'Обзор',
                text: 'Слои токенов, цепочки алиасов и моды для части страницы.',
              },
              {
                story: 'tokens-search--search',
                title: 'Поиск токенов',
                text: 'Найти переменную по имени, CSS или описанию.',
              },
              { story: 'icons-system--system', title: 'Иконки', text: 'Галерея с поиском, стилями и размерами.' },
            ]}
          />
          <P>
            Машиночитаемая сводка всего перечисленного:{' '}
            <a className="sb-link" href="llms.txt" target="_blank" rel="noreferrer">
              llms.txt
            </a>
            .
          </P>
        </div>
      </Section>
    </Page>
  ),
};
