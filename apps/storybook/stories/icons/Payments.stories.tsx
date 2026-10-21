import type { Meta } from '@storybook/react-vite';
import { familyStory } from './_families';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'icons-payments', title: 'Иконки/Payments' };
export default meta;

export const Payments = { ...familyStory('payments', ['natural']), name: 'Payments' };
