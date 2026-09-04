import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,r}from"./react-Bl2r1tuC.js";import{a as i,o as a}from"./blocks--ZfMwoIy.js";function o(e){let t={code:`code`,em:`em`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Обзор`,id:`introduction`}),`
`,(0,c.jsx)(t.h1,{id:`box-ui`,children:`Box UI`}),`
`,(0,c.jsxs)(t.p,{children:[`Дизайн-токены и иконки, сгенерированные прямо из трёх библиотек Figma. Каждая `,(0,c.jsx)(t.strong,{children:`мода
переменных`}),` выведена в переключатель на панели сверху.`]}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Файл Figma`}),(0,c.jsx)(t.th,{children:`Коллекция`}),(0,c.jsx)(t.th,{children:`Моды`}),(0,c.jsx)(t.th,{children:`Переключатель`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Box UI | Primitives`}),(0,c.jsx)(t.td,{children:`Color Palette, Spacing, Rounding, Size, Opacity, Typography`}),(0,c.jsxs)(t.td,{children:[`только `,(0,c.jsx)(t.em,{children:`Value`})]}),(0,c.jsx)(t.td,{children:`—`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Box UI | Tokens`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.strong,{children:`Color`})}),(0,c.jsx)(t.td,{children:`Blue, Sky, Teal, Emerald, Orange, Amber, Violet, Purple, Cyan, Yellow`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-accent`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Box UI | Tokens`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.strong,{children:`Mode`})}),(0,c.jsx)(t.td,{children:`Light, Dark`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-theme`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Box UI | Tokens`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.strong,{children:`Rounding`})}),(0,c.jsx)(t.td,{children:`Low, Medium, High`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-radius`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Box UI | Tokens`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.strong,{children:`Typography`})}),(0,c.jsx)(t.td,{children:`Inter, Inter Display, Inter Tight, Inter Variable`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-font`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Box UI | Tokens`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.strong,{children:`Grid`})}),(0,c.jsx)(t.td,{children:`Desktop, Mobile`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-device`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Box UI | Icons`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.strong,{children:`Icon`})}),(0,c.jsx)(t.td,{children:`Bold, Bold Duotone, Broken, Line Duotone, Linear, Outline`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`<IconStyleProvider>`})})]})]})]}),`
`,(0,c.jsx)(t.h2,{id:`как-разрешается-токен`,children:`Как разрешается токен`}),`
`,(0,c.jsxs)(t.p,{children:[`Ничего не дублируется под каждую тему. Каждый алиас Figma становится переходом `,(0,c.jsx)(t.code,{children:`var()`}),`,
поэтому переключение моды на `,(0,c.jsx)(t.code,{children:`<html>`}),` заново разрешает всю цепочку — ровно как смена моды
в самой Figma.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`--box-background-sentiment-primary   [data-theme]    Mode
  └─ var(--box-colors-brand-primary) [data-accent]   Color
       └─ var(--box-color-blue-solid-500)            Color Palette (фиксировано)
            └─ #3b82f6
`})}),`
`,(0,c.jsx)(t.p,{children:`С размерами то же самое, только со стороны скруглений на уровень глубже:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`--box-rounding-base-xl   [data-device]  Grid     Desktop → base/xl, Mobile → base/l
  └─ var(--box-radius-base-xl)  [data-radius]  Rounding  Low 20 · Medium 24 · High 32
       └─ var(--box-rounding-24)                          Rounding (примитив)
            └─ 24px
`})}),`
`,(0,c.jsx)(t.h2,{id:`как-это-применять`,children:`Как это применять`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import '@box-ui/tokens/css';
import { Button, Card, Text } from '@box-ui/react';
import { Icon } from '@box-ui/icons';

<html data-theme="dark" data-accent="violet" data-radius="high" data-device="mobile">
  <Card>
    <Text variant="h4">Готово</Text>
    <Button startIcon={<Icon name="check-circle" size="2xs" />}>Продолжить</Button>
  </Card>
</html>;
`})}),`
`,(0,c.jsx)(t.h3,{id:`переключение-мод-для-части-страницы`,children:`Переключение мод для части страницы`}),`
`,(0,c.jsxs)(t.p,{children:[`Кастомное свойство подставляется `,(0,c.jsx)(t.strong,{children:`там, где объявлено`}),`, а не там, где прочитано. Чтобы
переключить моды для поддерева, поставьте на один элемент `,(0,c.jsx)(t.em,{children:`все пять`}),` атрибутов — тогда
каждый слой переобъявляется здесь же и цепочка разрешается локально. Переопределение
одного лишь `,(0,c.jsx)(t.code,{children:`data-accent`}),` глубже по дереву не дотянется до токена Mode, который предок уже
разрешил.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<div data-theme="dark" data-accent="violet" data-radius="high" data-font="inter" data-device="desktop"></div>
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`@box-ui/tokens/css/adaptive.css`}),` необязателен: он берёт тёмную тему из
`,(0,c.jsx)(t.code,{children:`prefers-color-scheme`}),`, а Mobile — ниже 768px, но только когда документ сам не выставил эти
атрибуты.`]}),`
`,(0,c.jsx)(t.h2,{id:`куда-смотреть`,children:`Куда смотреть`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Начало работы`}),` — установка, подключение мод, использование токенов и иконок.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Основы`}),` — сырая палитра, текстовая шкала и шкалы отступов, скруглений, размеров и прозрачности.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Иконки`}),` — 1300+ иконок Solar в шести стилях и семейства «Флаги / Платежи / Бренды».`]}),`
`]}),`
`,(0,c.jsx)(t.p,{children:`Переключатели на панели управляют всеми токенами на этих страницах, поэтому любая история
заодно работает превью моды. Сами страницы намеренно окрашены в собственные цвета
Storybook — переключатели меняют содержимое Box UI, а не документацию вокруг него.`}),`
`,(0,c.jsx)(t.p,{children:`Отдельные разделы про моды и компоненты появятся, когда появятся компоненты.`})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=t(),r(),a()})))()}l();export{s as default};