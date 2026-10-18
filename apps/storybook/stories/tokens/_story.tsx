import type { ReactNode } from 'react';
import type { StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { model, type TokenCollection } from '@box-ui/tokens';
import { TokenPage } from '../_doctable';
import type { ModeGlobals } from '../_ui';

type Story = StoryObj;

/**
 * One Figma documentation page as one story. The lead is the text from the
 * page's side panel in Figma, so the two read the same.
 */
export function tokenStory(collectionId: string, name: string, lead: string, extra?: ReactNode): Story {
  const collection = (model.collections as Record<string, TokenCollection>)[collectionId];
  return {
    name,
    args: { query: '' },
    render: function Render(args, { globals }) {
      const [, updateArgs] = useArgs();
      const query = (args as { query: string }).query;
      return (
        <TokenPage
          collectionId={collectionId}
          title={collection.figmaName}
          lead={lead}
          globals={globals as unknown as ModeGlobals}
          query={query}
          onQuery={(value) => updateArgs({ query: value })}
        >
          {extra}
        </TokenPage>
      );
    },
  };
}
