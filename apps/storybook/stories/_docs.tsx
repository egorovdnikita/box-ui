import type { ReactNode } from 'react';
import { addons } from 'storybook/preview-api';
import { SELECT_STORY } from 'storybook/internal/core-events';
import { catalog } from '@box-ui/icons';
import { attributes, defaults } from '@box-ui/tokens';
import { COLLECTION_ORDER, STORY_OF, collections } from './_doctable';
import { counted } from './_lib';
import { useCopy } from './_ui';

/*
 * Blocks for the Overview and Getting Started pages. Every number and every list here is read from
 * the token model and the icon catalogue, so the overview cannot drift from
 * what the packages actually ship.
 */

const go = (storyId: string) => addons.getChannel().emit(SELECT_STORY, { storyId });

const total = COLLECTION_ORDER.reduce((n, id) => n + collections[id].variables.length, 0);
const switchable = COLLECTION_ORDER.filter((id) => collections[id].modes.length > 1);

/** The headline numbers, as a sentence for a lead. */
export const SUMMARY = `${total} переменных в ${COLLECTION_ORDER.length} коллекциях, ${switchable.length} переключаемых мод и ${catalog.icons.length} системных иконок.`;

/**
 * Rows that open another page — collections of a layer, or next steps. One
 * column of full-width rows, styled like the mode table, so the overview reads
 * top to bottom like every other page.
 */
function LinkRows({ rows }: { rows: { story: string; title: string; text: string }[] }) {
  return (
    <div className="sb-modes">
      {rows.map((row) => (
        <button
          key={row.story + row.title}
          type="button"
          className="sb-modes__row sb-modes__link"
          onClick={() => go(row.story)}
        >
          <span className="sb-modes__name">{row.title}</span>
          <span className="sb-caption">{row.text}</span>
          <span className="sb-modes__arrow" aria-hidden="true">
            →
          </span>
        </button>
      ))}
    </div>
  );
}

/** The collections of one layer — `prim`, `brand` or `sys` — each opening its table. */
export function LayerCollections({ prefix }: { prefix: 'prim' | 'brand' | 'sys' }) {
  return (
    <LinkRows
      rows={COLLECTION_ORDER.filter((id) => id.startsWith(`${prefix}-`)).map((id) => {
        const c = collections[id];
        return {
          story: STORY_OF[id],
          title: c.figmaName.replace(/^\S+\s+/, ''),
          text:
            counted(c.variables.length, ['переменная', 'переменные', 'переменных']) +
            (c.attribute ? ` · ${c.modes.map((m) => m.name).join(', ')} · [${c.attribute}]` : ''),
        };
      })}
    />
  );
}

/** Where to go next. */
export function NextSteps({ items }: { items: { story: string; title: string; text: string }[] }) {
  return <LinkRows rows={items} />;
}

/** Every switchable collection with its attribute, modes and default — from the model. */
export function ModeTable() {
  return (
    <div className="sb-modes">
      <div className="sb-modes__row sb-modes__row--head">
        <span>Атрибут</span>
        <span>Коллекция Figma</span>
        <span>Значения</span>
      </div>
      {switchable.map((id) => {
        const c = collections[id];
        return (
          <div key={id} className="sb-modes__row">
            <code className="sb-code">{attributes[id]}</code>
            <span>{c.figmaName.replace(/^\S+\s+/, '')}</span>
            <span className="sb-modes__values">
              {c.modes.map((m) => (
                <code
                  key={m.slug}
                  className={m.slug === defaults[id] ? 'sb-modes__value is-default' : 'sb-modes__value'}
                >
                  {m.slug}
                </code>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// --- prose -------------------------------------------------------------------

/** A paragraph of running text, in the page's own type. */
export function P({ children }: { children: ReactNode }) {
  return <p className="sb-prose">{children}</p>;
}

/** Inline code inside prose. */
export function C({ children }: { children: ReactNode }) {
  return <code className="sb-inline">{children}</code>;
}

/** A block of code with a copy button, drawn in the chrome like the token tables. */
export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const copy = useCopy();
  return (
    <div className="sb-codeblock">
      {label && <span className="sb-codeblock__label">{label}</span>}
      <pre>{code}</pre>
      <button type="button" className="sb-codeblock__copy" onClick={() => copy(code, 'код скопирован')}>
        Копировать
      </button>
    </div>
  );
}
