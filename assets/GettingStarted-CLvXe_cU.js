import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,r}from"./react-Bl2r1tuC.js";import{a as i,o as a}from"./blocks-C2yojZzC.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Начало работы`,id:`getting-started`}),`
`,(0,c.jsx)(t.h1,{id:`начало-работы`,children:`Начало работы`}),`
`,(0,c.jsxs)(t.p,{children:[`Три пакета, и ни в одном нет литерального цвета, радиуса или размера: всё приходит из
переменных Figma через `,(0,c.jsx)(t.code,{children:`@box-ui/tokens`}),`.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-bash`,children:`npm i @box-ui/tokens @box-ui/icons @box-ui/react
`})}),`
`,(0,c.jsx)(t.h2,{id:`1-подключите-css`,children:`1. Подключите CSS`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-js`,children:`import '@box-ui/tokens/css';
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Это `,(0,c.jsx)(t.code,{children:`primitives.css`}),` (777 фиксированных значений на `,(0,c.jsx)(t.code,{children:`:root`}),`) плюс `,(0,c.jsx)(t.code,{children:`theme.css`}),` (по блоку на
каждую моду Figma, выбираются атрибутом `,(0,c.jsx)(t.code,{children:`data-*`}),`). Их можно импортировать по отдельности,
если нужен только один.`]}),`
`,(0,c.jsx)(t.p,{children:`Дополнительно:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-js`,children:`import '@box-ui/tokens/css/adaptive.css';
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Он берёт тёмную тему из `,(0,c.jsx)(t.code,{children:`prefers-color-scheme`}),`, а Mobile — ниже 768px, `,(0,c.jsx)(t.strong,{children:`но только если
документ сам не выставил эти атрибуты`}),`.`]}),`
`,(0,c.jsx)(t.h2,{id:`2-выберите-моды`,children:`2. Выберите моды`}),`
`,(0,c.jsx)(t.p,{children:`Каждая переключаемая коллекция Figma соответствует одному атрибуту:`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Атрибут`}),(0,c.jsx)(t.th,{children:`Коллекция Figma`}),(0,c.jsx)(t.th,{children:`Значения`}),(0,c.jsx)(t.th,{children:`По умолчанию`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-theme`})}),(0,c.jsx)(t.td,{children:`System · Theme`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`light`}),` `,(0,c.jsx)(t.code,{children:`dark`})]}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`light`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-accent`})}),(0,c.jsx)(t.td,{children:`Brand · Color`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`indigo`}),` `,(0,c.jsx)(t.code,{children:`lime`}),` `,(0,c.jsx)(t.code,{children:`yellow`}),` `,(0,c.jsx)(t.code,{children:`pink`}),` `,(0,c.jsx)(t.code,{children:`monochrome`})]}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`indigo`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-radius`})}),(0,c.jsx)(t.td,{children:`Brand · Rounding`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`low`}),` `,(0,c.jsx)(t.code,{children:`medium`}),` `,(0,c.jsx)(t.code,{children:`high`})]}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`low`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-font`})}),(0,c.jsx)(t.td,{children:`Brand · Typography`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`inter`}),` `,(0,c.jsx)(t.code,{children:`inter-display`}),` `,(0,c.jsx)(t.code,{children:`inter-tight`}),` `,(0,c.jsx)(t.code,{children:`inter-variable`})]}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`inter`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-device`})}),(0,c.jsx)(t.td,{children:`System · Responsive`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`desktop`}),` `,(0,c.jsx)(t.code,{children:`mobile`})]}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`desktop`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-status`})}),(0,c.jsx)(t.td,{children:`System · Status`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`positive`}),` `,(0,c.jsx)(t.code,{children:`warning`}),` `,(0,c.jsx)(t.code,{children:`negative`}),` `,(0,c.jsx)(t.code,{children:`information`})]}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`positive`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-appearance`})}),(0,c.jsx)(t.td,{children:`Controls · Appearance`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`solid`}),` `,(0,c.jsx)(t.code,{children:`soft`}),` `,(0,c.jsx)(t.code,{children:`outline`})]}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`solid`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`data-state`})}),(0,c.jsx)(t.td,{children:`Controls · State`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`default`}),` `,(0,c.jsx)(t.code,{children:`hover`}),` `,(0,c.jsx)(t.code,{children:`active`}),` `,(0,c.jsx)(t.code,{children:`disabled`})]}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`default`})})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`Поставьте их на `,(0,c.jsx)(t.code,{children:`<html>`}),` — и за ними пойдёт весь документ:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<html data-theme="dark" data-accent="pink" data-radius="high" data-font="inter" data-device="desktop">
`})}),`
`,(0,c.jsx)(t.p,{children:`Или пусть это сделает провайдер:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-jsx`,children:`import { BoxUIProvider } from '@box-ui/react';

<BoxUIProvider target="root" theme="dark" accent="violet" radius="high">
  <App />
</BoxUIProvider>;
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`target="local"`}),` — значение по умолчанию — вместо этого оборачивает детей в `,(0,c.jsx)(t.code,{children:`<div>`}),`, и
именно так две темы уживаются на одной странице.`]}),`
`,(0,c.jsx)(t.h2,{id:`3-пользуйтесь-токенами`,children:`3. Пользуйтесь токенами`}),`
`,(0,c.jsx)(t.p,{children:`В CSS, по имени:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`.card {
  background: var(--box-surface-base-fill-raised);
  color: var(--box-surface-base-content-strong);
  border-radius: var(--box-rounding-base-m);
  padding: var(--box-spacing-base-m);
}
`})}),`
`,(0,c.jsx)(t.p,{children:`Или из JS, если не хочется набирать имена руками:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-js`,children:`import { color, layout } from '@box-ui/tokens';

color.background.base.secondary; // 'var(--box-surface-base-fill-raised)'
layout.spacing.base.m; // 'var(--box-spacing-base-m)'
`})}),`
`,(0,c.jsxs)(t.p,{children:[`В `,(0,c.jsx)(t.code,{children:`model`}),` лежит весь граф — коллекции, моды и то, на что ссылается каждая переменная.
Именно из него собраны эти страницы документации.`]}),`
`,(0,c.jsx)(t.h2,{id:`4-иконки`,children:`4. Иконки`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-jsx`,children:`import { Icon, IconStyleProvider } from '@box-ui/icons';

<Icon name="home-smile" size="l" title="Home" />

<IconStyleProvider style="bold-duotone">
  <Icon name="shield-check" size="m" />
</IconStyleProvider>;
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Размеры — токены `,(0,c.jsx)(t.code,{children:`size/base/*`}),`, поэтому иконка слушается `,(0,c.jsx)(t.code,{children:`data-device`}),` наравне со всем
остальным, а геометрия красится `,(0,c.jsx)(t.code,{children:`currentColor`}),`. Каждый стиль — отдельный динамический
`,(0,c.jsx)(t.code,{children:`import()`}),`, так что приложение везёт только то, что рисует.`]}),`
`,(0,c.jsxs)(t.p,{children:[`Без `,(0,c.jsx)(t.code,{children:`title`}),` иконка скрыта от вспомогательных технологий — это то, что нужно для
декоративных; передавайте `,(0,c.jsx)(t.code,{children:`title`}),`, когда смысл несёт именно иконка.`]}),`
`,(0,c.jsx)(t.h2,{id:`куда-дальше`,children:`Куда дальше`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Обзор`}),` — как работает цепочка алиасов и почему при локальном переключении нужны все атрибуты.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Основы`}),` — палитра, шкалы, текстовая шкала; везде показаны реально вычисленные значения.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Иконки`}),` — галерея с поиском и семейства «Флаги / Платежи / Бренды».`]}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`Машиночитаемая сводка всего перечисленного: `,(0,c.jsx)(`a`,{href:`llms.txt`,target:`_blank`,rel:`noreferrer`,children:`llms.txt`}),`.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=t(),r(),a()})))()}l();export{s as default};