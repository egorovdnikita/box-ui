# Box UI — правила для Claude

Дизайн-система Box UI. Один агент ведёт и Figma, и этот репозиторий: правит переменные и документацию в Figma через Figma MCP, затем в той же сессии синхронизирует код, проверяет и публикует. Пересылки между чатами и changelog-блоки не нужны.

## Источники

| Что                                       | Где                                                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Figma                                     | Foundation – Core, fileKey `gbgGmuUBQ7sIfL256KaDXX` — источник правды для токенов, иконок и документации |
| Код                                       | этот репозиторий                                                                                         |
| Storybook                                 | https://egorovdnikita.github.io/box-ui/                                                                  |
| Аудит и открытые пункты                   | `docs/audit.md`                                                                                          |
| Синхронизация таблиц документации в Figma | скилл `.claude/skills/sync-variable-documentation`                                                       |

Для работы с Figma нужен подключённый Figma MCP (`use_figma`). Перед первым вызовом `use_figma` загрузить скилл figma-use: через плагин Figma или ресурс `skill://figma/figma-use/SKILL.md`.

## Почему правка в Figma — это правка API

`tokens/figma/*.txt` и `tokens/figma/meta.json` — дословные дампы Figma и единственный источник сборки (`tokens/figma/README.md` описывает выгрузку и сверку FNV). Из Figma в код уходят:

- **ID коллекций** — в `MAP` выгрузочного скрипта; новая или пересозданная коллекция = правка `MAP` и `LAYERS` в `packages/tokens/scripts/build.mjs`;
- **Web code syntax** = имя CSS-переменной;
- **имена мод** = значения `data-*` (`Light` → `data-theme="light"`);
- **пути переменных** = ключи дампов и алиасов `@коллекция:путь`;
- **описания** — показываются в Storybook.

Переименование, удаление, смена code syntax, мод или коллекций — **breaking**, делается только после явного «да» владельца.

## Коллекции

| Коллекция                          | ID (`VariableCollectionId:…`) | Дамп           | Моды → атрибут                                                   |
| ---------------------------------- | ----------------------------- | -------------- | ---------------------------------------------------------------- |
| ◉ Primitives ・ Color              | 7101:11364                    | prim-color     | Value                                                            |
| ◉ Primitives ・ Typography         | 7101:11365                    | prim-type      | Value                                                            |
| ◉ Primitives ・ Rounding           | 7101:11366                    | prim-rounding  | Value                                                            |
| ◉ Primitives ・ Spacing            | 7101:11367                    | prim-spacing   | Value                                                            |
| ◉ Primitives ・ Size               | 7101:11368                    | prim-size      | Value                                                            |
| ◑ System ・ Color                  | 6561:2                        | sys-color      | Value                                                            |
| ☯︎ Brand ・ Color                   | 7149:11357                    | brand-color    | Deep · Bright · Monochrome → data-accent                         |
| ☯︎ Brand ・ Rounding                | 6564:2                        | brand-rounding | Low · Medium · High → data-radius                                |
| ☯︎ Brand ・ Typography              | 6564:14                       | brand-type     | Inter · Inter Display · Inter Tight · Inter Variable → data-font |
| ☯︎ Brand ・ Icon                    | 6567:2                        | brand-icon     | Bold … Outline → data-icon-style                                 |
| ◑ System ・ Theme                  | 6562:2                        | sys-theme      | Light · Dark → data-theme                                        |
| ◑ System ・ Responsive             | 6566:2                        | sys-responsive | Desktop · Mobile → data-device                                   |
| ◑ System ・ Status                 | 8809:371                      | sys-status     | Positive · Warning · Negative · Information → data-status        |
| ◑ System ・ Controls ・ Appearance | 8986:485                      | sys-appearance | Solid · Soft · Outline → data-appearance                         |
| ◑ System ・ Controls ・ State      | 7990:245                      | sys-state      | Default · Hover · Active · Disabled → data-state                 |

Перед записью сверять ID заново: несовпадение = коллекцию пересоздали, сообщить.

Граф алиасов: Primitives → System · Color → Brand · Color → Theme → Appearance → State; Status ← System · Color, Theme ← Status; Responsive ← Primitives, Brand · Rounding / Typography. System · Color по факту — фундамент _под_ Brand (именованные шкалы и ахроматика для Monochrome). Brand ссылается только на Primitives и System · Color.

Страницы Figma: `⌘ Overview` · `◉ PRIMITIVES` · `☯︎ BRAND` · `◑ SYSTEM` · `★ ICONS` (Master, System, Flags, Payments, Brands, Tech) · `❖ COMPONENTS` (Button) · `File` (masters DocTable) · `Cover`. Имена страниц разделов начинаются с пробелов — искать по `name.trim()` или id.

## Конвенции переменных

- **Пути:** через `/`, нижний регистр, kebab-case; `<область>/<роль>/<свойство>/<вариант|состояние>`. Состояния только `default · hover · active · disabled`.
- **Code syntax:** все три платформы.
  - WEB `var(--<префикс>-<путь-через-дефис>)`, последний сегмент пути = последний сегмент имени. Префиксы: Primitives — без префикса (`--color-…`, `--spacing-…`, `--rounding-…`, `--size-…`, `--font-…`, `--line-…`, `--letter-…`, `--paragraph-…`); System · Color `--system-color-…`; Brand `--brand-…`; Theme — без префикса (`--surface-…`, `--accent-…`, `--status-…`, `--interaction-…`); Status `--status-…`; Responsive `--type-…` / `--font-family-…` / `--spacing-…` / `--rounding-…` / `--size-…`; Appearance `--control-appearance-…`; State `--control-…`.
  - ANDROID = camelCase имени из WEB (`--color-red-500` → `colorRed500`); iOS = `<Категория>.<camelCase>`, где категория `Color` для цветов, иначе `Typography` / `Rounding` / `Spacing` / `Size` / `Icon` по корню пути.
  - WEB уникален во всём файле.
- **Скоупы:** никогда `ALL_SCOPES`. Проводка — пустые скоупы: Primitives, System · Color, Brand, Status, Appearance, `interaction/*` в Theme. Токен, который код использует напрямую, обязан иметь скоуп (сейчас это `interaction/disabled/*`).
- **Описания:** одна фраза по-русски, без значений; обязательны везде, повтор у шагов одной шкалы допустим.
- **Значения:** литералы только в Primitives, выше — алиасы (исключение — строки Brand · Typography и Brand · Icon: значение задаёт мода); полупрозрачность поверх алиаса — штатная форма Figma (`alpha(…)` в дампе).
- **Brand · Color:** `solid/*`, `alpha/*`, `on-solid`, `on-solid-muted`, `on-solid-alpha/*`, `contrast`, `static/{fill|content}/{default|hover|active}`; всё зеркально в `inverse/`. Слово `control` в бренде не использовать.
- **Публикация:** файл не публикуется как библиотека, `Hide from publishing` не используется.

## Протокол любой правки

1. **Прочитать.** Read-only `use_figma`: ID коллекций, моды, имена в зоне правки, все ссылки на них (алиасы во всех модах, привязки в компонентах и стилях), использование в коде (`grep` по `packages/`, `apps/`, `scripts/`, `tests/`).
2. **План** с перечнем путей и пометкой breaking / non-breaking. Breaking — только после «да».
3. **Figma:** одна запись на коллекцию или страницу; вернуть ID изменённого.
4. **Проверка Figma:** битых алиасов 0, `ALL_SCOPES` 0, WEB уникален, у новых переменных code syntax ×3 и описание.
5. **Документация в Figma** — по скиллу `sync-variable-documentation`: обновить затронутые таблицы и сверить **данные ячеек** с Variables (в ячейке моды — прямая цель алиаса полным именем, Code syntax = `codeSyntax.WEB`), найти старые имена в текстах на всех страницах; скриншот изменённой таблицы.
6. **Репо:** перевыгрузить затронутые дампы и `meta.json` через `use_figma` по `tokens/figma/README.md`, сверить FNV-суммы с Figma, поправить код при переименованиях, `npm run check`.
7. **Коммит и публикация:** понятное сообщение коммита с перечнем breaking-изменений; `npm run deploy:storybook`, если менялись токены, иконки или Storybook.
8. **Аудит:** обновить статус пункта в `docs/audit.md`.

## Иконки

Источник — Foundation – Core: страницы `Flags`, `Payments`, `Brands`, UI-иконки на `System`; `Master` и `Tech` в пакет не входят, служебный `Wrapper` не выгружается. Имена Payments — `<Имя> (<TICKER>)`, без повторов и коллизий slug.

- **Состав** — `packages/icons/src/figma-families.json`, сверять с Figma по FNV имён страницы.
- **Графика** — `npm run icons:figma` (нужен `FIGMA_TOKEN` со scope `file_content:read` в окружении, не в чате) пишет в `packages/icons/figma/<family>/` через SVGO с префиксами id. Иконку тяжелее 50 КБ экспорт не берёт и пишет в `overBudget` манифеста; сборка берёт для неё открытую поставку того же знака. UI-иконки: состав и имена — `packages/icons/src/figma-ui-icons.json` со страницы `System`; геометрия — из Solar (`@iconify-json/solar`) по имени или по полю `solar`, а иконки без пары в Solar — из `packages/icons/figma/ui-icons/`. Новая или переименованная UI-иконка = правка `figma-ui-icons.json` (имя уникально, пара в Solar сверена по геометрии), `npm run build:icons`.
- Переименование, удаление или перерисовка иконки в Figma = правка `figma-families.json`, перевыгрузка, `npm run build:icons`.

## Не делать

- Удалять переменные без проверки потребителей.
- Пересоздавать коллекцию ради переименования (только `collection.name = …`, ID сохраняется).
- Detach инстансов в компонентах и в DocTable; менять masters DocTable на странице `File` без согласования.
- Трогать `Cover` и `File`.
- Трогать без запроса то, что в разработке: Overview, Button (описания, иконки, фреймы спецификаций), будущий компонент Focus.

## Ограничения

Figma MCP работает через Plugin API: узлы, переменные, стили, компоненты. Не видит историю чатов Figma-агента, версии и комментарии, не публикует библиотеку. Ответ ограничен ~20 КБ — крупные коллекции выгружать частями.
