import type { Meta } from '@storybook/react-vite';
import { Notes } from '../_docs';
import { tokenStory } from './_story';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'tokens-system', title: 'Токены/System' };
export default meta;

/*
 * Each lead opens with the text of the page's card in Figma, verbatim, and
 * goes on with a sentence about what this page in Storybook shows.
 */

export const Color = tokenStory(
  'sys-color',
  'Color',
  'Базовая палитра семантических цветов — бренд, нейтральные и статусные оттенки, на которые ссылается слой Mode. У коллекции одна мода, а на её цвета ссылаются Theme и Status.',
);
export const Status = tokenStory(
  'sys-status',
  'Status',
  'Семантические статусные цвета для позитивных, предупреждающих, негативных и информационных состояний. Каждая колонка — мода коллекции, а на элементе её выбирает атрибут data-status.',
);
export const Themes = tokenStory(
  'sys-theme',
  'Themes',
  'Семантический слой цвета с режимами Light и Dark: фоны, контент и состояния, привязанные к палитре через алиасы. Колонки Light и Dark стоят рядом, а клик по алиасу ведёт к переменной, на которую он ссылается.',
);
export const Appearance = tokenStory(
  'sys-appearance',
  'Controls ・ Appearance',
  'Семантические цвета контролов для вариантов Solid, Soft и Outline — с учётом текущей темы и бренда. Контрол выбирает вариант атрибутом data-appearance на самом себе.',
);
export const State = tokenStory(
  'sys-state',
  'Controls ・ State',
  'Семантические токены для элементов управления — заливка, контент и обводка в состояниях default, hover, active и disabled. Обычно состояние задают :hover, :active и :disabled, а data-state фиксирует его для демонстраций.',
);
export const Responsive = tokenStory(
  'sys-responsive',
  'Responsive',
  'Метрики шрифта, отступы, размеры и радиусы скругления, адаптирующиеся между Desktop и Mobile. Колонки Desktop и Mobile стоят рядом, а «Устройство» в «Модах» выбирает, какие значения видит весь Storybook.',
  // The four section cards of the Figma page, verbatim.
  <Notes
    rows={[
      [
        'typography',
        'Метрики шрифта (размер, высота строки, межбуквенный интервал) для всех уровней текста, адаптирующиеся между Desktop и Mobile.',
      ],
      [
        'spacing',
        'Отступы и интервалы для построения сеток и компоновки элементов, масштабируемые под Desktop и Mobile.',
      ],
      ['size', 'Размеры элементов интерфейса (иконки, контролы, контейнеры), адаптирующиеся между Desktop и Mobile.'],
      ['rounding', 'Радиусы скругления углов для всех компонентов, адаптирующиеся между Desktop и Mobile.'],
    ]}
  />,
);
