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

/** The headline numbers. */
export function Stats() {
  const items = [
    [String(total), 'переменных Figma'],
    [String(COLLECTION_ORDER.length), 'коллекций'],
    [String(switchable.length), 'переключаемых мод'],
    [String(catalog.icons.length), 'системных иконок'],
  ];
  return (
    <div className="sb-stats">
      {items.map(([value, label]) => (
        <div key={label} className="sb-stats__item">
          <span className="sb-stats__value">{value}</span>
          <span className="sb-caption">{label}</span>
        </div>
      ))}
    </div>
  );
}

const LAYERS = [
  {
    prefix: 'prim',
    title: 'Primitives',
    note: 'Сырые значения без смысла: палитра, шкалы. В компонентах напрямую не используются.',
  },
  {
    prefix: 'brand',
    title: 'Brand',
    note: 'Характер бренда: акцентный цвет, плотность скругления, гарнитура, стиль иконок.',
  },
  {
    prefix: 'sys',
    title: 'System',
    note: 'Семантика, которой пользуются компоненты: темы, адаптив, статусы, состояния контролов.',
  },
];

/**
 * The three layers side by side, each collection a link to its page — the
 * same Primitives → Brand → System order the aliases run in.
 */
export function LayerMap() {
  return (
    <div className="sb-layers">
      {LAYERS.map((layer, i) => (
        <section key={layer.prefix} className="sb-layers__layer">
          <div className="sb-layers__head">
            <span className="sb-label">
              {i + 1} · {layer.title}
            </span>
            <span className="sb-caption">{layer.note}</span>
          </div>
          {COLLECTION_ORDER.filter((id) => id.startsWith(`${layer.prefix}-`)).map((id) => {
            const c = collections[id];
            return (
              <button key={id} type="button" className="sb-layers__item" onClick={() => go(STORY_OF[id])}>
                <span className="sb-layers__name">{c.figmaName.replace(/^\S+\s+/, '')}</span>
                <span className="sb-caption">
                  {counted(c.variables.length, ['переменная', 'переменные', 'переменных'])}
                  {c.attribute ? ` · [${c.attribute}]` : ''}
                </span>
              </button>
            );
          })}
        </section>
      ))}
    </div>
  );
}

/** Where to go next, as cards. */
export function NextSteps({ items }: { items: { story: string; title: string; text: string }[] }) {
  return (
    <div className="sb-next">
      {items.map((item) => (
        <button key={item.story} type="button" className="sb-next__card" onClick={() => go(item.story)}>
          <span className="sb-layers__name">{item.title} →</span>
          <span className="sb-caption">{item.text}</span>
        </button>
      ))}
    </div>
  );
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
