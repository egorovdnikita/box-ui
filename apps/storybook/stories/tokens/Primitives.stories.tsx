import type { Meta } from '@storybook/react-vite';
import { tokenStory } from './_story';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'tokens-primitives', title: 'Токены/Primitives' };
export default meta;

// Each lead is the text of the page's card in Figma, verbatim.
const RAW = 'не применять напрямую в компонентах — только через семантические токены.';

export const Color = tokenStory('prim-color', 'Color', `Токены цветовой палитры, ${RAW}`);
export const Typography = tokenStory('prim-type', 'Typography', `Токены типографии, ${RAW}`);
export const Rounding = tokenStory('prim-rounding', 'Rounding', `Токены закруглений, ${RAW}`);
export const Spacing = tokenStory('prim-spacing', 'Spacing', `Токены отступов, ${RAW}`);
export const Size = tokenStory('prim-size', 'Size', `Токены размеров, ${RAW}`);
