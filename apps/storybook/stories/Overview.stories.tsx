import type { Meta, StoryObj } from '@storybook/react-vite';
import { C, CodeBlock, LayerCollections, NextSteps, P, SUMMARY } from './_docs';
import { Page, Section } from './_ui';

/*
 * Written with the same Page and Section as every other page, not as MDX:
 * Storybook's docs renderer brought its own headings, measure and code blocks,
 * and the two pages read as a different site.
 */

// `id` and the export name keep the old MDX address, introduction--docs.
const meta: Meta = { id: 'introduction', title: 'Обзор' };
export default meta;

export const Docs: StoryObj = {
  name: 'Обзор',
  render: () => (
    <Page
      title="Box UI"
      lead={`Дизайн-токены и иконки из файла Figma «Foundation – Core»: ${SUMMARY} Каждая переменная становится CSS-переменной с именем из её Code syntax, а каждая мода — атрибутом на <html>.`}
    >
      <Section
        title="1. Primitives"
        description="Сырые значения без смысла: палитра и шкалы. В компонентах напрямую не используются — только через Brand и System."
      >
        <LayerCollections prefix="prim" />
      </Section>

      <Section
        title="2. Brand"
        description="Характер бренда: акцентный цвет, плотность скругления, гарнитура и стиль иконок. Ссылается на Primitives."
      >
        <LayerCollections prefix="brand" />
      </Section>

      <Section
        title="3. System"
        description="Семантика, которой пользуются компоненты: темы, адаптив, статусы и состояния контролов. Ссылается на Brand и Primitives."
      >
        <LayerCollections prefix="sys" />
      </Section>

      <Section
        title="Как разрешается токен"
        description="Ничего не дублируется под каждую тему. Каждый алиас Figma становится переходом var(), поэтому смена моды на <html> заново разрешает всю цепочку — ровно как в самой Figma."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CodeBlock
            label="Цвет"
            code={`--accent-fill-solid                [data-theme]   System · Theme
  └─ var(--brand-color-solid-500)  [data-accent]  Brand · Color
       └─ var(--color-indigo-500)                 Primitives · Color
            └─ #6366f1`}
          />
          <CodeBlock
            label="Скругление — на слой больше: устройство переназначает ступень"
            code={`--rounding-xl                      [data-device]  System · Responsive   Desktop → xl, Mobile → l
  └─ var(--brand-rounding-xl)      [data-radius]  Brand · Rounding      Low 20 · Medium 24 · High 32
       └─ var(--rounding-20)                      Primitives · Rounding
            └─ 20px`}
          />
          <CodeBlock
            label="Контролы — сверху ещё вид и состояние"
            code={`--control-accent-fill                                  [data-state]       Controls · State
  └─ var(--control-appearance-accent-fill-default)     [data-appearance]  Controls · Appearance
       └─ var(--interaction-accent-solid-fill-default) [data-theme]       System · Theme
            └─ … → var(--color-indigo-500)`}
          />
        </div>
      </Section>

      <Section title="Моды в этом Storybook">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <P>
            Кнопка <strong>Моды</strong> на панели сверху переключает их все. Первая группа — тема, акцент, скругление,
            гарнитура, устройство и стиль иконок — меняет всё, что нарисовано Box UI. Вторая — статус, вид и состояние —
            доходит только до токенов контролов. В таблицах токенов каждая колонка показывает свою моду независимо от
            выбранной.
          </P>
          <P>Сами страницы окрашены в цвета Storybook: моды меняют содержимое, а не документацию вокруг него.</P>
        </div>
      </Section>

      <Section
        title="Моды для части страницы"
        description="Кастомное свойство подставляется там, где объявлено, а не там, где прочитано. Поэтому для поддерева нужны все атрибуты сразу — тогда каждый слой переобъявится здесь же."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CodeBlock
            code={`<div data-theme="dark" data-accent="bright" data-radius="high" data-font="inter"
     data-device="desktop" data-status="positive" data-appearance="solid" data-state="default">
  …
</div>`}
          />
          <P>
            Один лишь <C>data-accent</C> глубже по дереву не дотянется до токена темы, который предок уже разрешил.{' '}
            <C>BoxUIProvider</C> из <C>@box-ui/react</C> ставит все атрибуты сам.
          </P>
        </div>
      </Section>

      <Section title="Куда дальше">
        <NextSteps
          items={[
            {
              story: 'getting-started--docs',
              title: 'Начало работы',
              text: 'Установка, подключение мод, токены в CSS и JS, иконки.',
            },
            {
              story: 'tokens-search--search',
              title: 'Поиск токенов',
              text: 'Все коллекции в одном поиске — по имени, CSS-переменной и описанию.',
            },
            {
              story: 'tokens-system--themes',
              title: 'System · Theme',
              text: 'Семантические цвета в Light и Dark бок о бок.',
            },
            {
              story: 'icons-system--system',
              title: 'Иконки',
              text: 'Системные иконки Solar, флаги, платежи и бренды.',
            },
          ]}
        />
      </Section>
    </Page>
  ),
};
