# Дампы переменных Figma

Один файл на коллекцию, дословно. Это **источник правды** для `@box-ui/tokens`: сборка
читает только их и больше ничего из Figma не запрашивает, поэтому `npm run build`
воспроизводим без доступа к файлу и без токена API.

| Файл                 | Коллекция Figma                     | Переменных | Моды                                       |
| -------------------- | ----------------------------------- | ---------: | ------------------------------------------ |
| `prim-color.txt`     | ◉ Primitives ・ Color               |        585 | Value                                      |
| `prim-type.txt`      | ◉ Primitives ・ Typography          |         75 | Value                                      |
| `prim-rounding.txt`  | ◉ Primitives ・ Rounding            |         31 | Value                                      |
| `prim-spacing.txt`   | ◉ Primitives ・ Spacing             |         29 | Value                                      |
| `prim-size.txt`      | ◉ Primitives ・ Size                |         29 | Value                                      |
| `sys-color.txt`      | ◑ System ・ Color                   |         76 | Value                                      |
| `sys-theme.txt`      | ◑ System ・ Theme                   |         96 | Light, Dark                                |
| `sys-responsive.txt` | ◑ System ・ Responsive              |         73 | Desktop, Mobile                            |
| `sys-status.txt`     | ◑ System ・ Status                  |         11 | Positive, Warning, Negative, Information   |
| `sys-appearance.txt` | ◑ System ・ Controls ・ Appearance  |         36 | Solid, Soft, Outline                       |
| `sys-state.txt`      | ◑ System ・ Controls ・ State       |         16 | Default, Hover, Active, Disabled           |
| `brand-color.txt`    | ☯︎ Brand ・ Color                    |         47 | Indigo, Lime, Yellow, Pink, Monochrome     |
| `brand-rounding.txt` | ☯︎ Brand ・ Rounding                 |         11 | Low, Medium, High                          |
| `brand-type.txt`     | ☯︎ Brand ・ Typography               |          2 | Inter, Inter Display, Inter Tight, Variable |
| `brand-icon.txt`     | ☯︎ Brand ・ Icon                     |          1 | Bold … Outline                             |

## Грамматика

```
# collection: <внутренний id>
# figma: <имя коллекции, как оно читается в Figma>
# modes: <Мода>, <Мода>, …

<путь>=<значение>                                  одномодовая коллекция
<путь> :: <Мода>=<значение> | <Мода>=<значение>     многомодовая
```

Значения:

| Запись                     | Что это                                                                  |
| -------------------------- | ------------------------------------------------------------------------ |
| `#rrggbb` / `#rrggbbaa`    | литеральный цвет                                                         |
| `42`, `-0.5`               | число (в CSS уходит в `px`, кроме `font-weight/*`)                       |
| `"Inter Display"`          | строка                                                                   |
| `@<коллекция>:<путь>`      | алиас на переменную в этой коллекции                                     |
| `alpha(48, <значение>)`    | то же значение на 48% прозрачности → `color-mix(in srgb, … 48%, transparent)` |

Алиас **обязан** нести свою коллекцию: `color/alpha/16` — реально существующая переменная
и в `brand-color`, и в `sys-status`, и только префикс их различает. `tests/tokens.test.ts`
проверяет, что такая неоднозначность в файле действительно есть, — иначе префикс перестал
бы что-либо значить, а тест на разрешимость алиасов проверял бы не то, что заявляет.

## Как перевыгрузить после правок в Figma

REST API переменных доступен только на Enterprise, поэтому выгрузка идёт через Figma MCP
(`use_figma`), то есть через Plugin API. Скрипт ниже печатает готовый дамп — его остаётся
положить в соответствующий файл.

Сначала получите список коллекций и их `id`:

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
return collections.map((c) => ({ id: c.id, name: c.name, vars: c.variableIds.length }));
```

Затем, подставив `IDS` и выверив `MAP` под текущие id, выгрузите коллекции:

```js
const MAP = {
  'VariableCollectionId:7101:11364': 'prim-color',
  'VariableCollectionId:7101:11367': 'prim-spacing',
  'VariableCollectionId:7101:11366': 'prim-rounding',
  'VariableCollectionId:7101:11368': 'prim-size',
  'VariableCollectionId:7101:11365': 'prim-type',
  'VariableCollectionId:7149:11357': 'brand-color',
  'VariableCollectionId:6564:2': 'brand-rounding',
  'VariableCollectionId:6564:14': 'brand-type',
  'VariableCollectionId:6567:2': 'brand-icon',
  'VariableCollectionId:6561:2': 'sys-color',
  'VariableCollectionId:6562:2': 'sys-theme',
  'VariableCollectionId:6566:2': 'sys-responsive',
  'VariableCollectionId:8809:371': 'sys-status',
  'VariableCollectionId:8986:485': 'sys-appearance',
  'VariableCollectionId:7990:245': 'sys-state',
};
const IDS = ['VariableCollectionId:6562:2']; // что выгружаем

const to = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
const hex = (c) => '#' + to(c.r) + to(c.g) + to(c.b) + (c.a !== undefined && c.a < 0.999 ? to(c.a) : '');
const ref = async (al) => {
  const t = await figma.variables.getVariableByIdAsync(al.id);
  return '@' + (MAP[t.variableCollectionId] || 'UNMAPPED') + ':' + t.name;
};
const out = [];
for (const id of IDS) {
  const col = await figma.variables.getVariableCollectionByIdAsync(id);
  out.push('# collection: ' + MAP[id], '# figma: ' + col.name, '# modes: ' + col.modes.map((m) => m.name).join(', '));
  for (const vid of col.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(vid);
    const parts = [];
    for (const m of col.modes) {
      const raw = v.valuesByMode[m.modeId];
      let s;
      if (raw && raw.type === 'VARIABLE_ALIAS') s = await ref(raw);
      // Figma хранит «алиас + своя прозрачность» отдельной формой значения.
      else if (raw && typeof raw === 'object' && 'color' in raw && 'opacity' in raw)
        s = 'alpha(' + raw.opacity + ', ' + (raw.color.type === 'VARIABLE_ALIAS' ? await ref(raw.color) : hex(raw.color)) + ')';
      else if (v.resolvedType === 'COLOR') s = hex(raw);
      else if (v.resolvedType === 'STRING') s = JSON.stringify(raw);
      else s = String(raw);
      parts.push([m.name, s]);
    }
    out.push(
      col.modes.length === 1
        ? v.name + '=' + parts[0][1]
        : v.name + ' :: ' + parts.map((p) => p[0] + '=' + p[1]).join(' | '),
    );
  }
  out.push('');
}
return out.join('\n');
```

Ответ MCP обрезается примерно на 20 КБ, поэтому крупные коллекции выгружайте частями —
например, `prim-color` в два прохода, отфильтровав по `v.name.includes('/solid/')`.

### Проверка, что перенесли без потерь

Не сверяйте глазами. Посчитайте контрольную сумму по тому же каноническому тексту с двух
сторон — в Figma тем же скриптом (вместо `out.join` вернув `fnv`) и локально:

```bash
node -e '
const fs = require("fs");
const fnv = (t) => { let h = 0x811c9dc5; for (let i=0;i<t.length;i++){ h ^= t.charCodeAt(i); h = Math.imul(h,0x01000193)>>>0; } return h.toString(16); };
for (const f of fs.readdirSync("tokens/figma").filter(f=>f.endsWith(".txt")).sort()) {
  const t = fs.readFileSync("tokens/figma/"+f,"utf8").split("\n").filter(l=>l.trim() && !l.startsWith("#")).join("\n");
  console.log(f.padEnd(20), String(t.split("\n").length).padStart(4), String(t.length).padStart(6), fnv(t));
}'
```

Совпадать должны и число строк, и длина, и сумма. Последняя синхронизация сверена так по
всем 15 коллекциям.

Дальше — `npm run build -w @box-ui/tokens`. Сборка сама упадёт, если появилась коллекция
без записи в `LAYERS`, если два пути претендуют на одно имя CSS-переменной или если алиас
указывает в пустоту.

## Компоненты и иконки

Переменных в файле Figma касается только эта папка. Состав иконок и семейств лежит в
`packages/icons/src/catalog.json` и `figma-families.json`, структура файла — такая:

```
⌘ Overview
◉ PRIMITIVES   Color · Typography · Rounding · Spacing · Size
☯︎ BRAND        Typography · Rounding · Color
◑ SYSTEM       Color · Status · Themes · Controls ・ Appearance · Controls ・ State · Responsive
★ ICONS        Master · System · Flags · Payments · Brands · Tech
❖ COMPONENTS   Button
```

Страница `Button` — четыре набора компонентов (`Button/Priority`, `Button/Status`,
`Button/Static`, `Button/Neutral`), в каждом 20 вариантов: `Size` = XL (48) · L (44) ·
M (40) · S (36) · XS (32) × `Property` = Label · ❖ Label · Label ❖ · ❖. Вид и состояние
в варианты не вынесены — их задают моды `Controls ・ Appearance` и `Controls ・ State`,
поэтому в React это пропсы `appearance`/`family`, а не отдельные классы.
