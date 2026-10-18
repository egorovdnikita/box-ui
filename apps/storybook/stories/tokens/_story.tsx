import type { ReactNode } from 'react';
import type { StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { TokenPage, collections, type TokenFilters } from '../_doctable';
import type { ModeGlobals } from '../_ui';

type Story = StoryObj<TokenFilters>;

/**
 * One Figma documentation page as one story. The lead is the text from the
 * page's side panel in Figma, so the two read the same. Filters are args, so
 * they land in the URL and "Ссылка" shares the exact view.
 */
export function tokenStory(collectionId: string, name: string, lead: string, extra?: ReactNode): Story {
  const collection = collections[collectionId];
  return {
    name,
    args: { query: '', section: '', kind: '' },
    argTypes: {
      query: { control: 'text', description: 'Поиск по имени, var(--…) и описанию' },
      section: { control: 'text', description: 'Раздел — первый сегмент пути, где коллекция ветвится' },
      kind: { control: 'inline-radio', options: ['', 'color', 'number', 'string'], description: 'Тип значения' },
    },
    render: function Render(args, { globals }) {
      const [, updateArgs] = useArgs<TokenFilters>();
      return (
        <TokenPage
          collectionId={collectionId}
          title={collection.figmaName}
          lead={lead}
          globals={globals as unknown as ModeGlobals}
          filters={args}
          onFilters={(next) => updateArgs(next)}
        >
          {extra}
        </TokenPage>
      );
    },
  };
}
