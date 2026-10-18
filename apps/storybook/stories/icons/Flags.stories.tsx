import type { Meta } from '@storybook/react-vite';
import { familyStory } from './_families';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'icons-flags', title: 'Иконки/Флаги' };
export default meta;

export const Flags = { ...familyStory('flags', ['natural', 'rounded', 'circle']), name: 'Флаги' };
