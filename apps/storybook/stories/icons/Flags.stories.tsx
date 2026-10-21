import type { Meta } from '@storybook/react-vite';
import { familyStory } from './_families';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'icons-flags', title: 'Иконки/Flags' };
export default meta;

export const Flags = { ...familyStory('flags', ['circle', 'rounded', 'natural']), name: 'Flags' };
