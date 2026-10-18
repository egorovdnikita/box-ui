import type { Meta } from '@storybook/react-vite';
import { tokenStory } from './_story';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'tokens-system', title: 'Токены/System' };
export default meta;

export const Color = tokenStory(
  'sys-color',
  'Color',
  'Базовая палитра семантических цветов — бренд, нейтральные и статусные оттенки, на которые ссылается слой Mode.',
);
export const Status = tokenStory(
  'sys-status',
  'Status',
  'Семантические статусные цвета для позитивных, предупреждающих, негативных и информационных состояний.',
);
export const Themes = tokenStory(
  'sys-theme',
  'Themes',
  'Семантический слой цвета с режимами Light и Dark: фоны, контент и состояния, привязанные к палитре через алиасы.',
);
export const Appearance = tokenStory(
  'sys-appearance',
  'Controls ・ Appearance',
  'Семантические цвета контролов для вариантов Solid, Soft и Outline — с учётом текущей темы и бренда.',
);
export const State = tokenStory(
  'sys-state',
  'Controls ・ State',
  'Семантические токены для элементов управления — заливка, контент и обводка в состояниях default, hover, active и disabled.',
);
export const Responsive = tokenStory(
  'sys-responsive',
  'Responsive',
  'Типографика, отступы, размеры и скругления, адаптирующиеся между Desktop и Mobile.',
);
