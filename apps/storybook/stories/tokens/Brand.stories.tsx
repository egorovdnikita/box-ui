import type { Meta } from '@storybook/react-vite';
import { tokenStory } from './_story';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'tokens-brand', title: 'Токены/Brand' };
export default meta;

// Each lead is the text of the page's card in Figma, verbatim.

export const Typography = tokenStory(
  'brand-type',
  'Typography',
  'Токены типографии, не применять напрямую в компонентах — только через семантические токены.',
);
export const Rounding = tokenStory(
  'brand-rounding',
  'Rounding',
  'Токены закруглений, не применять напрямую в компонентах — только через семантические токены.',
);
export const Color = tokenStory(
  'brand-color',
  'Color',
  'Базовая палитра семантических цветов — бренд, нейтральные и статусные оттенки, на которые ссылается слой Mode.',
);
export const Icon = tokenStory(
  'brand-icon',
  'Icon',
  'Стиль иконок бренда. Одна переменная, шесть мод: мода коллекции выбирает начертание всего набора иконок.',
);
