import type { Meta } from '@storybook/react-vite';
import { Callout, Code } from '../_ui';
import { tokenStory } from './_story';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'tokens-brand', title: 'Токены/Brand' };
export default meta;

export const Typography = tokenStory(
  'brand-type',
  'Typography',
  'Гарнитуры бренда: по колонке на каждую моду. Переключатель «Гарнитура» на панели выбирает ту, которой пользуется весь Storybook.',
  <Callout title="Запасные шрифты">
    Из Figma приходит только имя семейства. Сгенерированный CSS дописывает <Code>var(--font-fallback)</Code>, чтобы
    недоступная гарнитура падала в системный стек, а не в засечный шрифт по умолчанию:{' '}
    <Code>--brand-font-family-heading: "Inter Display", var(--font-fallback);</Code>
  </Callout>,
);
export const Rounding = tokenStory(
  'brand-rounding',
  'Rounding',
  'Характер скругления бренда в трёх плотностях — Low, Medium и High. Каждая ступень указывает на примитивный радиус; System · Responsive переназначает ступени ещё раз для Mobile.',
);
export const Color = tokenStory(
  'brand-color',
  'Color',
  'Фирменные цвета в модах Deep, Bright и Monochrome. Образец в каждой колонке разрешается в своей моде, а не в той, что выбрана на панели.',
);
export const Icon = tokenStory(
  'brand-icon',
  'Icon',
  'Стиль иконок бренда. Одна переменная, шесть мод: мода коллекции выбирает начертание всего набора иконок.',
);
