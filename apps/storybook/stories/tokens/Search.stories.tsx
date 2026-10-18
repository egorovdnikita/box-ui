import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { Icon } from '@box-ui/icons';
import type { TokenVariable } from '@box-ui/tokens';
import { KIND_ICON, collections, goToCollection, goToToken, kindOf } from '../_doctable';
import {
  Counts,
  Empty,
  Page,
  ResetFilters,
  Search as SearchField,
  Segmented,
  ShareLink,
  counted,
  matches,
} from '../_ui';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'tokens-search', title: 'Токены/Поиск' };
export default meta;

type Filters = { query: string; layer: string };

const LAYERS = [
  { value: 'prim', label: 'Primitives' },
  { value: 'brand', label: 'Brand' },
  { value: 'sys', label: 'System' },
] as const;

const ORDER = [
  'prim-color',
  'prim-type',
  'prim-rounding',
  'prim-spacing',
  'prim-size',
  'brand-type',
  'brand-rounding',
  'brand-color',
  'brand-icon',
  'sys-color',
  'sys-status',
  'sys-theme',
  'sys-appearance',
  'sys-state',
  'sys-responsive',
];

const all: { collection: string; variable: TokenVariable }[] = ORDER.flatMap((collection) =>
  collections[collection].variables.map((variable) => ({ collection, variable })),
);

const LIMIT = 100;

function Index({ layer }: { layer: string }) {
  return (
    <div className="sb-index">
      {LAYERS.filter((l) => !layer || l.value === layer).map((l) => (
        <section key={l.value} className="sb-index__layer">
          <h2 className="sb-label">{l.label}</h2>
          <div className="sb-index__cards">
            {ORDER.filter((id) => id.startsWith(`${l.value}-`)).map((id) => {
              const c = collections[id];
              return (
                <button key={id} type="button" className="sb-index__card" onClick={() => goToCollection(id)}>
                  <span className="sb-index__name">{c.figmaName}</span>
                  <span className="sb-caption">
                    {counted(c.variables.length, ['переменная', 'переменные', 'переменных'])}
                    {c.modes.length > 1 && ` · ${c.modes.map((m) => m.name).join(', ')}`}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export const Search: StoryObj<Filters> = {
  name: 'Поиск',
  args: { query: '', layer: '' },
  argTypes: {
    query: { control: 'text' },
    layer: { control: 'inline-radio', options: ['', 'prim', 'brand', 'sys'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<Filters>();
    const { query, layer } = args;
    const [limit, setLimit] = useState(LIMIT);

    const results = useMemo(() => {
      const q = query.trim();
      if (!q) return [];
      return all.filter(
        ({ collection, variable: v }) =>
          (!layer || collection.startsWith(`${layer}-`)) &&
          matches(q, `${v.path} ${v.cssVar} ${v.description} ${collections[collection].figmaName}`),
      );
    }, [query, layer]);

    return (
      <Page
        title="Поиск токенов"
        lead="Все 15 коллекций Figma в одном поиске: по пути переменной, имени в CSS и описанию. Клик по строке открывает страницу коллекции на этой переменной."
        toolbar={
          <>
            <SearchField
              value={query}
              onChange={(value) => {
                setLimit(LIMIT);
                updateArgs({ query: value });
              }}
              placeholder="Имя, var(--…) или описание"
            />
            <Segmented
              label="Слой"
              value={layer}
              onChange={(value) => updateArgs({ layer: value })}
              options={[{ value: '', label: 'все' }, ...LAYERS]}
            />
            <Counts>
              <span className="sb-caption">
                {query
                  ? counted(results.length, ['совпадение', 'совпадения', 'совпадений'])
                  : counted(all.length, ['переменная', 'переменные', 'переменных'])}
              </span>
              {(query || layer) && <ResetFilters onReset={() => updateArgs({ query: '', layer: '' })} />}
              <ShareLink />
            </Counts>
          </>
        }
      >
        {!query.trim() ? (
          <Index layer={layer} />
        ) : results.length === 0 ? (
          <Empty query={query} onClear={() => updateArgs({ query: '' })} />
        ) : (
          <div className="sb-results">
            {results.slice(0, limit).map(({ collection, variable: v }) => (
              <button
                key={`${collection}:${v.path}`}
                type="button"
                className="sb-results__row"
                onClick={() => goToToken(`${collection}:${v.path}`)}
                title="Открыть на странице коллекции"
              >
                <span className="sb-results__collection">{collections[collection].figmaName}</span>
                <span className="sb-results__path">
                  <Icon name={KIND_ICON[kindOf(v)]} size={14} iconStyle="linear" />
                  <span>{v.path}</span>
                </span>
                <span className="sb-doc__mono sb-results__code">{`var(${v.cssVar})`}</span>
                <span className="sb-caption sb-results__description">{v.description}</span>
              </button>
            ))}
            {results.length > limit && (
              <button type="button" className="sb-link sb-results__more" onClick={() => setLimit(limit + LIMIT)}>
                Показать ещё {Math.min(LIMIT, results.length - limit)} из {results.length - limit}
              </button>
            )}
          </div>
        )}
      </Page>
    );
  },
};
