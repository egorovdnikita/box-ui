import type { Meta, StoryObj } from '@storybook/react-vite';
import { C, CodeBlock, ModeTable, NextSteps, P } from './_docs';
import { Page, Section } from './_ui';

/*
 * The one page that is about Storybook rather than about a Figma page: what Box
 * UI is, what is in here, and how to start. Kept short on purpose — everything
 * else lives on the page it is about.
 */

// `id` and the export name keep the old address, introduction--docs.
const meta: Meta = { id: 'introduction', title: 'Обзор' };
export default meta;

export const Docs: StoryObj = {
  name: 'Обзор',
  render: () => (
    <Page
      title="Box UI"
      lead="Дизайн-система из файла Figma «Foundation – Core»: токены и иконки, собранные прямо из переменных и компонентов Figma. Каждая переменная — CSS-переменная с именем из её Code syntax, каждая мода — атрибут на <html>."
    >
      <Section
        title="Что здесь"
        description="Страницы повторяют страницы документации в Figma: те же группы, значения в каждой моде, Code syntax и описания."
      >
        <NextSteps
          items={[
            {
              story: 'tokens-primitives--color',
              title: 'Токены · Primitives',
              text: 'Сырые значения: палитра и шкалы. Напрямую в компонентах не применяются.',
            },
            {
              story: 'tokens-brand--color',
              title: 'Токены · Brand',
              text: 'Характер бренда: акцентный цвет, скругление, гарнитура, стиль иконок.',
            },
            {
              story: 'tokens-system--themes',
              title: 'Токены · System',
              text: 'Семантика для компонентов: темы, адаптив, статусы, состояния контролов.',
            },
            {
              story: 'icons-system--system',
              title: 'Иконки',
              text: 'Полная библиотека иконок системы: интерфейсные, брендовые, платёжные и флаги в едином стиле.',
            },
          ]}
        />
      </Section>

      <Section title="Начало работы">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CodeBlock
            code={`npm i @box-ui/tokens @box-ui/icons @box-ui/react

import '@box-ui/tokens/css';`}
          />
          <P>
            Моды выбираются атрибутами на <C>{'<html>'}</C> или любом элементе — тогда на нём нужны все атрибуты сразу.
            Выделено значение по умолчанию.
          </P>
          <ModeTable />
          <CodeBlock
            code={`<html data-theme="dark" data-accent="bright" data-radius="high" data-device="mobile">

.card {
  background: var(--surface-base-fill-raised);
  border-radius: var(--rounding-m);
}`}
          />
        </div>
      </Section>

      <Section title="Моды в Storybook">
        <P>
          Кнопка «Моды» на панели сверху переключает их для всех страниц, тема перекрашивает и саму документацию. В
          таблицах токенов каждая колонка показывает свою моду независимо от выбранной. Машиночитаемая сводка —{' '}
          <a className="sb-link" href="llms.txt" target="_blank" rel="noreferrer">
            llms.txt
          </a>
          .
        </P>
      </Section>
    </Page>
  ),
};
