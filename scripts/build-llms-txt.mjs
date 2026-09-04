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
  const primitives = sum(['palette', 'spacing', 'rounding', 'size', 'opacity', 'type-scale']);
  const semantic = sum(['accent', 'mode', 'radius', 'font', 'grid']);

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

Дизайн-токены и иконки, сгенерированные из библиотек Figma «Box UI». Каждая мода
переменных Figma — цветовая тема, акцент, плотность скруглений, гарнитура и устройство —
это переключатель на HTML-атрибуте, под которым заново разрешается вся цепочка алиасов.

- Документация: ${SITE}
- Исходники: ${REPO}
- Лицензии: MIT (код), CC BY 4.0 (иконки Solar, © 480 Design)

## Токены

Примитивных значений: ${primitives}. Семантических токенов: ${semantic}. Выводятся как
CSS-переменные с префиксом \`--box-\`. Алиас Figma превращается в переход \`var()\`,
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

Поставьте все пять на один элемент, чтобы разрешить тему локально: кастомное свойство
подставляется там, где объявлено, поэтому переопределение одного атрибута глубже по
дереву не дотянется до токена, который предок уже разрешил.

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

- [Обзор](${SITE}/?path=/docs/introduction--docs): граф переменных и как разрешается токен
- [Начало работы](${SITE}/?path=/docs/getting-started--docs): установка, подключение мод, использование токенов
- [Цвета](${SITE}/?path=/story/foundations-colors--palette): палитра, акцентные моды, семантика в светлой и тёмной темах
- [Шкалы](${SITE}/?path=/story/foundations-scales--spacing): отступы, скругления, размеры, прозрачность
- [Типографика](${SITE}/?path=/story/foundations-typography--ramp): текстовая шкала и четыре гарнитуры
- [UI Icons](${SITE}/?path=/story/icons-ui-icons--gallery): галерея с поиском
- [Семейства Figma](${SITE}/?path=/story/icons-figma-families--flags): флаги, платежи, бренды
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
