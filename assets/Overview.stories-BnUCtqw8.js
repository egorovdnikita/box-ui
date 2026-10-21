import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{c as r,i,m as a,p as o}from"./_ui-x_8awshv.js";import{a as s,i as c,r as l,t as u}from"./_doctable-CJKetd0Y.js";var d,f;function p(){return(p=e((()=>{s(),d={"brand-color":`data-accent`,"brand-rounding":`data-radius`,"brand-type":`data-font`,"brand-icon":`data-icon-style`,"sys-status":`data-status`,"sys-theme":`data-theme`,"sys-responsive":`data-device`,"sys-appearance":`data-appearance`,"sys-state":`data-state`},f={"brand-color":`deep`,"brand-rounding":`low`,"brand-type":`inter`,"brand-icon":`bold`,"sys-status":`positive`,"sys-theme":`light`,"sys-responsive":`desktop`,"sys-appearance":`solid`,"sys-state":`default`}})))()}function m({rows:e}){return(0,b.jsx)(`div`,{className:`sb-modes`,children:e.map(e=>(0,b.jsxs)(`button`,{type:`button`,className:`sb-modes__row sb-modes__link`,onClick:()=>C(e.story),children:[(0,b.jsx)(`span`,{className:`sb-modes__name`,children:e.title}),(0,b.jsx)(`span`,{className:`sb-caption`,children:e.text}),(0,b.jsx)(`span`,{className:`sb-modes__arrow`,"aria-hidden":`true`,children:`→`})]},e.story+e.title))})}function h({items:e}){return(0,b.jsx)(m,{rows:e})}function g(){return(0,b.jsxs)(`div`,{className:`sb-modes`,children:[(0,b.jsxs)(`div`,{className:`sb-modes__row sb-modes__row--head`,children:[(0,b.jsx)(`span`,{children:`Атрибут`}),(0,b.jsx)(`span`,{children:`Коллекция Figma`}),(0,b.jsx)(`span`,{children:`Значения`})]}),w.map(e=>{let t=l[e];return(0,b.jsxs)(`div`,{className:`sb-modes__row`,children:[(0,b.jsx)(`code`,{className:`sb-code`,children:d[e]}),(0,b.jsx)(`span`,{children:t.figmaName.replace(/^\S+\s+/,``)}),(0,b.jsx)(`span`,{className:`sb-modes__values`,children:t.modes.map(t=>(0,b.jsx)(`code`,{className:t.slug===f[e]?`sb-modes__value is-default`:`sb-modes__value`,children:t.slug},t.slug))})]},e)})]})}function _({children:e}){return(0,b.jsx)(`p`,{className:`sb-prose`,children:e})}function v({children:e}){return(0,b.jsx)(`code`,{className:`sb-inline`,children:e})}function y({code:e,label:t}){let n=a();return(0,b.jsxs)(`div`,{className:`sb-codeblock`,children:[t&&(0,b.jsx)(`span`,{className:`sb-codeblock__label`,children:t}),(0,b.jsx)(`pre`,{children:e}),(0,b.jsx)(`button`,{type:`button`,className:`sb-codeblock__copy`,onClick:()=>n(e,`код`),children:`Копировать`})]})}var b,x,S,C,w;function T(){return(T=e((()=>{p(),c(),o(),b=n(),{addons:x}=__STORYBOOK_MODULE_PREVIEW_API__,{SELECT_STORY:S}=__STORYBOOK_MODULE_CORE_EVENTS__,C=e=>x.getChannel().emit(S,{storyId:e}),w=u.filter(e=>l[e].modes.length>1);try{h.displayName=`NextSteps`,h.__docgenInfo={description:`Where to go next.`,displayName:`NextSteps`,filePath:`/Users/egorov_d_nikita/Projects/box-ui/apps/storybook/stories/_docs.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`storybook/stories/_docs.tsx`,name:`TypeLiteral`}],description:``,name:`items`,required:!0,tags:{},type:{name:`{ story: string; title: string; text: string; }[]`}}},tags:{}}}catch{}try{g.displayName=`ModeTable`,g.__docgenInfo={description:`Every switchable collection with its attribute, modes and default — from the model.`,displayName:`ModeTable`,filePath:`/Users/egorov_d_nikita/Projects/box-ui/apps/storybook/stories/_docs.tsx`,methods:[],props:{},tags:{}}}catch{}try{_.displayName=`P`,_.__docgenInfo={description:`A paragraph of running text, in the page's own type.`,displayName:`P`,filePath:`/Users/egorov_d_nikita/Projects/box-ui/apps/storybook/stories/_docs.tsx`,methods:[],props:{},tags:{}}}catch{}try{v.displayName=`C`,v.__docgenInfo={description:`Inline code inside prose.`,displayName:`C`,filePath:`/Users/egorov_d_nikita/Projects/box-ui/apps/storybook/stories/_docs.tsx`,methods:[],props:{},tags:{}}}catch{}try{y.displayName=`CodeBlock`,y.__docgenInfo={description:`A block of code with a copy button, drawn in the chrome like the token tables.`,displayName:`CodeBlock`,filePath:`/Users/egorov_d_nikita/Projects/box-ui/apps/storybook/stories/_docs.tsx`,methods:[],props:{code:{defaultValue:null,declarations:[{fileName:`storybook/stories/_docs.tsx`,name:`TypeLiteral`}],description:``,name:`code`,required:!0,tags:{},type:{name:`string`}},label:{defaultValue:null,declarations:[{fileName:`storybook/stories/_docs.tsx`,name:`TypeLiteral`}],description:``,name:`label`,required:!1,tags:{},type:{name:`string`}}},tags:{}}}catch{}})))()}var E=t({Docs:()=>k,__namedExportsOrder:()=>A,default:()=>O}),D,O,k,A;function j(){return(j=e((()=>{T(),o(),D=n(),O={id:`introduction`,title:`Обзор`},k={name:`Обзор`,render:()=>(0,D.jsxs)(i,{title:`Box UI`,lead:`Дизайн-система из файла Figma «Foundation – Core»: токены и иконки, собранные прямо из переменных и компонентов Figma. Каждая переменная — CSS-переменная с именем из её Code syntax, каждая мода — атрибут на <html>.`,children:[(0,D.jsx)(r,{title:`Что здесь`,description:`Страницы повторяют страницы документации в Figma: те же группы, значения в каждой моде, Code syntax и описания.`,children:(0,D.jsx)(h,{items:[{story:`tokens-primitives--color`,title:`Токены ・ Primitives`,text:`Сырые значения: палитра и шкалы. Напрямую в компонентах не применяются.`},{story:`tokens-brand--color`,title:`Токены ・ Brand`,text:`Характер бренда: акцентный цвет, скругление, гарнитура, стиль иконок.`},{story:`tokens-system--themes`,title:`Токены ・ System`,text:`Семантика для компонентов: темы, адаптив, статусы, состояния контролов.`},{story:`icons-system--system`,title:`Иконки`,text:`Полная библиотека иконок системы: интерфейсные, брендовые, платёжные и флаги в едином стиле.`}]})}),(0,D.jsx)(r,{title:`Начало работы`,children:(0,D.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,D.jsx)(y,{label:`Терминал`,code:`git clone https://github.com/egorovdnikita/box-ui.git
cd box-ui
npm install`}),(0,D.jsxs)(_,{children:[`Пакеты пока не опубликованы в npm. `,(0,D.jsx)(v,{children:`npm install`}),` в клоне собирает токены и иконки; в свой проект пакет подключается по пути: `,(0,D.jsx)(v,{children:`npm i ../box-ui/packages/tokens`}),`.`]}),(0,D.jsx)(y,{label:`JS`,code:`import '@box-ui/tokens/css';`}),(0,D.jsxs)(_,{children:[`Моды выбираются атрибутами на `,(0,D.jsx)(v,{children:`<html>`}),` или любом элементе — тогда на нём нужны все атрибуты сразу. Выделено значение по умолчанию.`]}),(0,D.jsx)(g,{}),(0,D.jsx)(y,{label:`HTML`,code:`<html data-theme="dark" data-accent="bright" data-radius="high" data-device="mobile">`}),(0,D.jsx)(y,{label:`CSS`,code:`.card {
  background: var(--surface-base-fill-raised);
  border-radius: var(--rounding-m);
}`})]})}),(0,D.jsx)(r,{title:`Моды в Storybook`,children:(0,D.jsxs)(_,{children:[`Кнопка «Моды» на панели сверху переключает их для всех страниц, тема перекрашивает и саму документацию. В таблицах токенов каждая колонка показывает свою моду независимо от выбранной. Машиночитаемая сводка —`,` `,(0,D.jsx)(`a`,{className:`sb-link`,href:`llms.txt`,target:`_blank`,rel:`noreferrer`,children:`llms.txt`}),`.`]})})]})},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: 'Обзор',
  render: () => <Page title="Box UI" lead="Дизайн-система из файла Figma «Foundation – Core»: токены и иконки, собранные прямо из переменных и компонентов Figma. Каждая переменная — CSS-переменная с именем из её Code syntax, каждая мода — атрибут на <html>.">
      <Section title="Что здесь" description="Страницы повторяют страницы документации в Figma: те же группы, значения в каждой моде, Code syntax и описания.">
        <NextSteps items={[{
        story: 'tokens-primitives--color',
        title: 'Токены ・ Primitives',
        text: 'Сырые значения: палитра и шкалы. Напрямую в компонентах не применяются.'
      }, {
        story: 'tokens-brand--color',
        title: 'Токены ・ Brand',
        text: 'Характер бренда: акцентный цвет, скругление, гарнитура, стиль иконок.'
      }, {
        story: 'tokens-system--themes',
        title: 'Токены ・ System',
        text: 'Семантика для компонентов: темы, адаптив, статусы, состояния контролов.'
      }, {
        story: 'icons-system--system',
        title: 'Иконки',
        text: 'Полная библиотека иконок системы: интерфейсные, брендовые, платёжные и флаги в едином стиле.'
      }]} />
      </Section>

      <Section title="Начало работы">
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
          <CodeBlock label="Терминал" code={\`git clone https://github.com/egorovdnikita/box-ui.git
cd box-ui
npm install\`} />
          <P>
            Пакеты пока не опубликованы в npm. <C>npm install</C> в клоне собирает токены и иконки; в свой проект пакет
            подключается по пути: <C>npm i ../box-ui/packages/tokens</C>.
          </P>
          <CodeBlock label="JS" code="import '@box-ui/tokens/css';" />
          <P>
            Моды выбираются атрибутами на <C>{'<html>'}</C> или любом элементе — тогда на нём нужны все атрибуты сразу.
            Выделено значение по умолчанию.
          </P>
          <ModeTable />
          <CodeBlock label="HTML" code={\`<html data-theme="dark" data-accent="bright" data-radius="high" data-device="mobile">\`} />
          <CodeBlock label="CSS" code={\`.card {
  background: var(--surface-base-fill-raised);
  border-radius: var(--rounding-m);
}\`} />
        </div>
      </Section>

      <Section title="Моды в Storybook">
        <P>
          Кнопка «Моды» на панели сверху переключает их для всех страниц, тема перекрашивает и саму документацию. В
          таблицах токенов каждая колонка показывает свою моду независимо от выбранной. Машиночитаемая сводка —{' '}
          <a className="sb-link" href="llms.txt" target="_blank" rel="noreferrer">
            llms.txt
          </a>
          .
        </P>
      </Section>
    </Page>
}`,...k.parameters?.docs?.source}}},A=[`Docs`]})))()}export{j as n,p as r,E as t};