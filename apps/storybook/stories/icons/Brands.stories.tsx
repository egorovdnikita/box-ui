import type { Meta } from '@storybook/react-vite';
import { familyStory } from './_families';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'icons-brands', title: 'Иконки/Brands' };
export default meta;

export const Brands = { ...familyStory('brands', ['natural', 'circle']), name: 'Brands' };
