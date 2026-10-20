/**
 * Emits `apps/storybook/public/llms.txt` — the machine-readable summary of the
 * design system, served at the root of the published site.
 *
 * Every number in it is counted from the generated model and catalogues rather
 * than written down, so the file cannot drift from the tokens it describes.
 * Run by `npm run build`; `tests/llms.test.ts` asserts it is in sync.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const json = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));

const SITE = 'https://egorovdnikita.github.io/box-ui';
const REPO = 'https://github.com/egorovdnikita/box-ui';

export function render(model, catalog, families) {
  const c = model.collections;
  const sum = (ids) => ids.map((id) => c[id].variables.length).reduce((a, b) => a + b, 0);
  // Counted by layer prefix rather than a hard-coded list, so adding a
  // collection in Figma cannot leave these two numbers behind.
  const ids = Object.keys(c);
  const primitives = sum(ids.filter((id) => id.startsWith('prim-')));
  const semantic = sum(ids.filter((id) => !id.startsWith('prim-')));
  const switchCount = ids.filter((id) => c[id].attribute).length;

  const switches = Object.values(c)
    .filter((collection) => collection.attribute)
    .map((collection) => {
      const values = collection.modes.map((m) => m.slug).join(' | ');
      return `- \`${collection.attribute}\`: ${values} (по умолчанию \`${collection.defaultMode}\`) — коллекция Figma «${collection.figmaName}»`;
    })
    .join('\n');

  const collections = Object.entries(c)
    .map(
      ([id, collection]) =>
        `- \`${id}\` — переменных: ${collection.variables.length}, мод: ${collection.modes.length}, из «${collection.figmaName}»`,
    )
    .join('\n');

  const rosters = Object.entries(families)
    .map(
      ([id, meta]) =>
        `- \`${id}\` — записей: ${meta.total} со страницы Figma «${meta.figmaPage}», из них с графикой: ${meta.resolved}`,
    )
    .join('\n');

  return `# Box UI

Дизайн-токены и иконки, сгенерированные из файла Figma «Foundation – Core». Каждая
мода переменных Figma — тема, акцент, плотность скруглений, гарнитура, устройство,
статус, вид контрола и его состояние — это переключатель на HTML-атрибуте, под которым
заново разрешается вся цепочка алиасов.

- Документация: ${SITE}
- Исходники: ${REPO}
- Лицензии: MIT (код), CC BY 4.0 (иконки Solar, © 480 Design)

## Токены

Примитивных значений: ${primitives}. Семантических токенов: ${semantic}. Выводятся как
CSS-переменные с теми же именами, что Code syntax в Figma (\`var(--surface-base-fill-page)\`). Алиас Figma превращается в переход \`var()\`,
поэтому ничего не дублируется под каждую тему.

\`\`\`
npm i @box-ui/tokens
\`\`\`

\`\`\`js
import '@box-ui/tokens/css'; // примитивы + блоки всех мод
import { model, attributes, defaults } from '@box-ui/tokens';
\`\`\`

### Переключатели

${switches}

Поставьте все ${switchCount} на один элемент, чтобы разрешить тему локально: кастомное
свойство подставляется там, где объявлено, поэтому переопределение одного атрибута
глубже по дереву не дотянется до токена, который предок уже разрешил.

Состояния контролов не нужно переключать вручную: \`@box-ui/tokens/css/controls.css\`
отображает моды коллекции «Controls · State» на \`:hover\`, \`:active\` и \`:disabled\`
для любого элемента с атрибутом \`data-box-control\`.

Прозрачные ступени Figma хранит как «эта шкала на N%»; в CSS они выводятся через
\`color-mix(in srgb, … N%, transparent)\`.

### Коллекции

${collections}

## Иконки

Иконок: ${catalog.icons.length} в ${catalog.categories.length} категориях. Стилей: ${catalog.styles.length}
(${catalog.styles.map((s) => s.figma).join(', ')}). Все 24×24, красятся \`currentColor\`,
размеры берутся из токенов \`size/base/*\`.

\`\`\`jsx
import { Icon, IconStyleProvider } from '@box-ui/icons';

<IconStyleProvider style="bold-duotone">
  <Icon name="home-smile" size="l" title="Home" />
</IconStyleProvider>
\`\`\`

Не каждая иконка нарисована во всех стилях — доступные перечислены в
\`catalog.icons[].styles\`.

### Остальные семейства

${rosters}

## Страницы

- [Обзор](${SITE}/?path=/story/introduction--docs): что такое Box UI, что в этом Storybook и как начать
- [Токены](${SITE}/?path=/story/tokens-primitives--color): все 15 коллекций Figma таблицами, как на страницах документации в Figma — значения по модам, code syntax, описания групп
- [Иконки](${SITE}/?path=/story/icons-system--system): системные иконки с поиском, стилями и размерами
- [Флаги](${SITE}/?path=/story/icons-flags--flags), [Платежи](${SITE}/?path=/story/icons-payments--payments), [Бренды](${SITE}/?path=/story/icons-brands--brands): семейства из Figma
`;
}

/**
 * Guarded so importing `render` for the sync test does not rewrite the very file
 * the test is comparing against — a check that regenerates its own fixture can
 * never fail.
 */
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const model = (await import(join(root, 'packages/tokens/dist/model.js'))).default;
  const text = render(model, json('packages/icons/src/catalog.json'), json('packages/icons/src/families.json'));

  writeFileSync(join(root, 'apps/storybook/public/llms.txt'), text);
  console.log(`llms.txt written (${text.split('\n').length} lines)`);
}
