import type { Meta } from '@storybook/react-vite';
import { tokenStory } from './_story';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'tokens-primitives', title: 'Токены/Primitives' };
export default meta;

/*
 * Each lead opens with the text of the page's card in Figma, verbatim, and
 * goes on with a sentence about what this page in Storybook shows.
 */
const RAW = 'не применять напрямую в компонентах — только через семантические токены.';

export const Color = tokenStory(
  'prim-color',
  'Color',
  `Токены цветовой палитры, ${RAW} Здесь все цветовые шкалы и прозрачные оттенки alpha, на которые ссылаются Brand · Color и System · Color.`,
);
export const Typography = tokenStory(
  'prim-type',
  'Typography',
  `Токены типографии, ${RAW} Здесь шкалы начертаний, кеглей, высоты строки и межбуквенного интервала, из которых System · Responsive собирает текстовые стили.`,
);
export const Rounding = tokenStory(
  'prim-rounding',
  'Rounding',
  `Токены закруглений, ${RAW} Здесь шкала радиусов, из которой Brand · Rounding выбирает ступени для каждой плотности.`,
);
export const Spacing = tokenStory(
  'prim-spacing',
  'Spacing',
  `Токены отступов, ${RAW} Здесь шкала отступов, из которой System · Responsive выбирает ступени для Desktop и Mobile.`,
);
export const Size = tokenStory(
  'prim-size',
  'Size',
  `Токены размеров, ${RAW} Здесь шкала размеров иконок и контролов, из которой System · Responsive выбирает ступени для Desktop и Mobile.`,
);
