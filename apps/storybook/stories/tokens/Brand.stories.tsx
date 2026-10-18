import type { Meta } from '@storybook/react-vite';
import { Callout, Code } from '../_ui';
import { tokenStory } from './_story';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'tokens-brand', title: 'Токены/Brand' };
export default meta;

/*
 * Each lead opens with the text of the page's card in Figma, verbatim, and
 * goes on with a sentence about what this page in Storybook shows.
 */

export const Typography = tokenStory(
  'brand-type',
  'Typography',
  'Токены типографии, не применять напрямую в компонентах — только через семантические токены. Каждая колонка — мода коллекции, а «Гарнитура» в «Модах» выбирает ту, которой пользуется весь Storybook.',
  <Callout title="Запасные шрифты">
    Из Figma приходит только имя семейства. Сгенерированный CSS дописывает <Code>var(--font-fallback)</Code>, чтобы
    недоступная гарнитура падала в системный стек, а не в шрифт с засечками:{' '}
    <Code>--brand-font-family-heading: "Inter Display", var(--font-fallback);</Code>
  </Callout>,
);
export const Rounding = tokenStory(
  'brand-rounding',
  'Rounding',
  'Токены закруглений, не применять напрямую в компонентах — только через семантические токены. Каждая колонка — плотность Low, Medium или High, а System · Responsive ещё раз переназначает ступени для Mobile.',
);
export const Color = tokenStory(
  'brand-color',
  'Color',
  'Базовая палитра семантических цветов — бренд, нейтральные и статусные оттенки, на которые ссылается слой Mode. Каждая колонка — мода Deep, Bright или Monochrome, и образцы в ней показаны в своей моде, а не в выбранной.',
);
export const Icon = tokenStory(
  'brand-icon',
  'Icon',
  'Стиль иконок бренда. Одна переменная, шесть мод: мода коллекции выбирает начертание всего набора иконок. В Storybook её переключает «Иконки» в «Модах».',
);
