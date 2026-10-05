import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,r}from"./react-Bl2r1tuC.js";import{a as i,o as a}from"./blocks-C2yojZzC.js";function o(e){let t={code:`code`,em:`em`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Обзор`,id:`introduction`}),`
`,(0,c.jsx)(t.h1,{id:`box-ui`,children:`Box UI`}),`
`,(0,c.jsxs)(t.p,{children:[`Дизайн-токены и иконки, сгенерированные прямо из файла Figma «Box UI | Components» —
1118 переменных в 15 коллекциях. Каждая `,(0,c.jsx)(t.strong,{children:`мода переменных`}),` выведена в переключатель на
панели сверху.`]}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Коллекция Figma`}),(0,c.jsx)(t.th,{children:`Моды`}),(0,c.jsx)(t.th,{children:`Переключатель`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`◉ Primitives ・ Color / Spacing / Rounding / Size / Typography`}),(0,c.jsxs)(t.td,{children:[`только `,(0,c.jsx)(t.em,{children:`Value`})]}),(0,c.jsx)(t.td,{children:`—`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`◑ System ・ Color`}),(0,c.jsxs)(t.td,{children:[`только `,(0,c.jsx)(t.em,{children:`Value`})]}),(0,c.jsx)(t.td,{children:`—`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`☯︎ Brand ・ Color`}),(0,c.jsx)(t.td,{children:`Indigo, Lime, Yellow, Pink, Monochrome`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-accent`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`☯︎ Brand ・ Rounding`}),(0,c.jsx)(t.td,{children:`Low, Medium, High`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-radius`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`☯︎ Brand ・ Typography`}),(0,c.jsx)(t.td,{children:`Inter, Inter Display, Inter Tight, Inter Variable`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-font`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`☯︎ Brand ・ Icon`}),(0,c.jsx)(t.td,{children:`Bold, Bold Duotone, Broken, Line Duotone, Linear, Outline`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-icon-style`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`◑ System ・ Theme`}),(0,c.jsx)(t.td,{children:`Light, Dark`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-theme`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`◑ System ・ Responsive`}),(0,c.jsx)(t.td,{children:`Desktop, Mobile`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-device`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`◑ System ・ Status`}),(0,c.jsx)(t.td,{children:`Positive, Warning, Negative, Information`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-status`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`◑ System ・ Controls ・ Appearance`}),(0,c.jsx)(t.td,{children:`Solid, Soft, Outline`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-appearance`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`◑ System ・ Controls ・ State`}),(0,c.jsx)(t.td,{children:`Default, Hover, Active, Disabled`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-state`})})]})]})]}),`
`,(0,c.jsx)(t.h2,{id:`как-разрешается-токен`,children:`Как разрешается токен`}),`
`,(0,c.jsxs)(t.p,{children:[`Ничего не дублируется под каждую тему. Каждый алиас Figma становится переходом `,(0,c.jsx)(t.code,{children:`var()`}),`,
поэтому переключение моды на `,(0,c.jsx)(t.code,{children:`<html>`}),` заново разрешает всю цепочку — ровно как смена моды
в самой Figma.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`--box-accent-fill-solid   [data-theme]   System · Theme
  └─ var(--box-brand-solid-500) [data-accent]  Brand · Color
       └─ var(--box-palette-indigo-solid-500)          Primitives · Color (фиксировано)
            └─ #6366f1
`})}),`
`,(0,c.jsx)(t.p,{children:`У кнопки над этим ещё два переключаемых слоя — и ни один не описан в CSS компонента
повторно:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`--box-state-accent-fill   [data-state]   Controls · State
  └─ var(--box-control-accent-fill-default)  [data-appearance]  Controls · Appearance
       └─ var(--box-interaction-accent-solid-fill-default)  [data-theme]  System · Theme
            └─ … → var(--box-palette-indigo-solid-500)
`})}),`
`,(0,c.jsx)(t.p,{children:`С размерами то же самое, только со стороны скруглений на уровень глубже:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`--box-rounding-base-xl   [data-device]  System · Responsive  Desktop → xl, Mobile → l
  └─ var(--box-radius-xl)  [data-radius]  Brand · Rounding   Low 20 · Medium 24 · High 32
       └─ var(--box-rounding-20)                             Primitives · Rounding
            └─ 20px
`})}),`
`,(0,c.jsx)(t.h2,{id:`как-это-применять`,children:`Как это применять`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import '@box-ui/tokens/css';
import { Button, Card, Text } from '@box-ui/react';
import { Icon } from '@box-ui/icons';

<html data-theme="dark" data-accent="pink" data-radius="high" data-device="mobile">
  <Card>
    <Text variant="h4">Готово</Text>
    <Button startIcon={<Icon name="check-circle" size="2xs" />}>Продолжить</Button>
  </Card>
</html>;
`})}),`
`,(0,c.jsx)(t.h3,{id:`переключение-мод-для-части-страницы`,children:`Переключение мод для части страницы`}),`
`,(0,c.jsxs)(t.p,{children:[`Кастомное свойство подставляется `,(0,c.jsx)(t.strong,{children:`там, где объявлено`}),`, а не там, где прочитано. Чтобы
переключить моды для поддерева, поставьте на один элемент `,(0,c.jsx)(t.em,{children:`все`}),` атрибуты — тогда каждый
слой переобъявляется здесь же и цепочка разрешается локально. Переопределение одного лишь
`,(0,c.jsx)(t.code,{children:`data-accent`}),` глубже по дереву не дотянется до токена темы, который предок уже разрешил.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<div
  data-theme="dark"
  data-accent="pink"
  data-radius="high"
  data-font="inter"
  data-device="desktop"
  data-status="positive"
  data-appearance="solid"
  data-state="default"
></div>
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Из этого же правила следует, почему `,(0,c.jsx)(t.code,{children:`<Button>`}),` сам несёт `,(0,c.jsx)(t.code,{children:`data-appearance`}),` и `,(0,c.jsx)(t.code,{children:`data-state`}),`:
без них вид и состояние кнопки разрешались бы на предке. По той же причине
`,(0,c.jsx)(t.code,{children:`controls.css`}),` переобъявляет на каждом контроле те 18 переменных темы, что ведут в
коллекцию «Status», — иначе `,(0,c.jsx)(t.code,{children:`data-status`}),` на самой кнопке ничего бы не менял.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`@box-ui/tokens/css/adaptive.css`}),` необязателен: он берёт тёмную тему из
`,(0,c.jsx)(t.code,{children:`prefers-color-scheme`}),`, а Mobile — ниже 768px, но только когда документ сам не выставил эти
атрибуты.`]}),`
`,(0,c.jsx)(t.h2,{id:`куда-смотреть`,children:`Куда смотреть`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Начало работы`}),` — установка, подключение мод, использование токенов и иконок.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Основы`}),` — палитра, именованные шкалы, акцент, тема, статусы, текстовая шкала и шкалы отступов, скруглений и размеров.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Контролы`}),` — вид × состояние × семейство на живых кнопках.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Иконки`}),` — 1300+ иконок Solar в шести стилях и семейства «Флаги / Платежи / Бренды».`]}),`
`]}),`
`,(0,c.jsx)(t.p,{children:`Переключатели на панели управляют всеми токенами на этих страницах, поэтому любая история
заодно работает превью моды. Сами страницы намеренно окрашены в собственные цвета
Storybook — переключатели меняют содержимое Box UI, а не документацию вокруг него.`}),`
`,(0,c.jsx)(t.p,{children:`Отдельные разделы про моды и компоненты появятся, когда появятся компоненты.`})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=t(),r(),a()})))()}l();export{s as default};