import type { ReactNode } from 'react';
import { addons } from 'storybook/preview-api';
import { SELECT_STORY } from 'storybook/internal/core-events';
import { attributes, defaults } from '@box-ui/tokens';
import { COLLECTION_ORDER, collections } from './_doctable';
import { useCopy } from './_ui';

/*
 * Blocks for the Overview page and the token pages. Lists here are read from
 * the token model, so the overview cannot drift from what the packages ship.
 */

const go = (storyId: string) => addons.getChannel().emit(SELECT_STORY, { storyId });

const switchable = COLLECTION_ORDER.filter((id) => collections[id].modes.length > 1);

/**
 * Rows that open another page. One
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
      <button type="button" className="sb-codeblock__copy" onClick={() => copy(code, 'код')}>
        Копировать
      </button>
    </div>
  );
}

/** Name–text rows, e.g. the section cards of a Figma page. */
export function Notes({ rows }: { rows: [string, string][] }) {
  return (
    <div className="sb-modes">
      {rows.map(([name, text]) => (
        <div key={name} className="sb-modes__row sb-modes__note">
          <code className="sb-code">{name}</code>
          <span className="sb-caption">{text}</span>
        </div>
      ))}
    </div>
  );
}
