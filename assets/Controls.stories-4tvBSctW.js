import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./model-D0w5O0a5.js";import{n as a,t as o}from"./src-BDI9D27A.js";import{S as s,a as c,g as l,i as u,l as d,m as f,r as p,v as m,y as h}from"./_ui-Drlf5waf.js";function g({children:e,style:t}){return(0,y.jsx)(`div`,{style:{...m,padding:`var(--box-spacing-base-m)`,...t},children:e})}function _({columns:e,rows:t,trailing:n}){let r=`max-content repeat(${e.length}, max-content)${n?` max-content`:``}`;return(0,y.jsx)(g,{style:{overflowX:`auto`},children:(0,y.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:r,gap:`var(--box-spacing-base-2xs) var(--box-spacing-base-m)`,alignItems:`center`,width:`max-content`},children:[(0,y.jsx)(`span`,{style:E,children:`Семейство`}),e.map(e=>(0,y.jsx)(`span`,{style:E,children:e.label},e.key)),n&&(0,y.jsx)(`span`,{style:E,children:n}),t.map(t=>(0,y.jsxs)(v.Fragment,{children:[(0,y.jsx)(`span`,{style:E,children:t.label}),t.cells.map((t,n)=>(0,y.jsx)(`div`,{children:t},e[n].key)),n&&(0,y.jsx)(`span`,{style:{...E,textTransform:`none`},children:t.trailing})]},t.key))]})})}var v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{v=t(),i(),o(),h(),y=n(),b={id:`controls-controls`,title:`Контролы/Кнопки`},x=r.collections[`sys-appearance`],S=r.collections[`sys-state`],C=[{id:`accent`,label:`Accent`,figma:`Button/Priority`},{id:`status`,label:`Status`,figma:`Button/Status`},{id:`static`,label:`Static`,figma:`Button/Static`},{id:`neutral`,label:`Neutral`,figma:`Button/Neutral`},{id:`ghost`,label:`Ghost`,figma:`—`}],w=x.modes.map(e=>e.slug),T=[`xs`,`s`,`m`,`l`,`xl`],E={color:`var(--box-surface-base-content-muted)`,fontFamily:`var(--box-typography-font-family-body)`,fontSize:`var(--box-typography-caption-l-font-size)`,lineHeight:`var(--box-typography-caption-l-line-height)`,textTransform:`uppercase`,letterSpacing:`0.06em`,whiteSpace:`nowrap`},D={name:`Вид × семейство`,render:()=>(0,y.jsxs)(d,{title:`Кнопки`,lead:`Семейство выбирает группу токенов, «Вид контрола» — моду, под которой эта группа разрешается. Ни одна комбинация ниже не описана в CSS отдельно: кнопка читает три переменные, а остальное делают моды Figma.`,toolbar:(0,y.jsxs)(c,{children:[(0,y.jsx)(u,{children:s(C.length,[`семейство`,`семейства`,`семейств`])}),(0,y.jsx)(u,{children:s(w.length,[`вид`,`вида`,`видов`])}),(0,y.jsx)(l,{})]}),children:[(0,y.jsx)(f,{title:`Каждое семейство × каждый вид`,description:"Наведите курсор или нажмите — состояния ведёт `controls.css`, а не React.",children:(0,y.jsx)(_,{columns:x.modes.map(e=>({key:e.slug,label:e.name})),trailing:`Figma`,rows:C.map(e=>({key:e.id,label:e.label,trailing:e.figma,cells:w.map(t=>(0,y.jsx)(a,{family:e.id,appearance:t,children:`Кнопка`},t))}))})}),(0,y.jsx)(f,{title:`Состояния`,description:"Те же кнопки с принудительно выставленным `data-state`. Так видно коллекцию «Controls · State» целиком, не ловя курсором каждое состояние.",children:(0,y.jsx)(_,{columns:S.modes.map(e=>({key:e.slug,label:e.name})),rows:C.map(e=>({key:e.id,label:e.label,cells:S.modes.map(t=>(0,y.jsx)(a,{family:e.id,state:t.slug,disabled:t.slug===`disabled`,children:`Кнопка`},t.slug))}))})}),(0,y.jsx)(f,{title:`Размеры`,description:"Пять вариантов из Figma: XS (32), S (36), M (40), L (44), XL (48). Высота приходит из `size/base/*`, поэтому на Mobile шкала пересчитывается.",children:(0,y.jsx)(g,{style:{display:`flex`,gap:`var(--box-spacing-base-xs)`,alignItems:`center`,flexWrap:`wrap`},children:T.map(e=>(0,y.jsx)(a,{size:e,children:e.toUpperCase()},e))})}),(0,y.jsx)(f,{title:`Как это разрешается`,description:"Один переход `var()` на каждый слой Figma — ровно та же цепочка, что в файле.",children:(0,y.jsx)(p,{children:`--box-state-accent-fill        ← Controls · State       [data-state]
  --box-control-accent-fill-default  ← Controls · Appearance  [data-appearance]
    --box-interaction-accent-solid-fill-default  ← System · Theme  [data-theme]
      --box-accent-fill-solid
        --box-brand-solid-500        ← Brand · Color          [data-accent]
          --box-palette-indigo-solid-500   ← Primitives · Color`})})]})},O={name:`Статусные кнопки`,render:()=>(0,y.jsx)(d,{title:`Статусные кнопки`,lead:"Семейство `status` читает те же три переменные, но под модой коллекции «System · Status». Статус живёт на самой кнопке: `controls.css` переобъявляет на контроле те переменные темы, что ведут в «System · Status», поэтому четыре тональности уживаются на одной странице.",children:w.map(e=>(0,y.jsx)(f,{title:e,children:(0,y.jsx)(g,{style:{display:`flex`,gap:`var(--box-spacing-base-xs)`,flexWrap:`wrap`},children:[`positive`,`warning`,`negative`,`information`].map(t=>(0,y.jsx)(a,{family:`status`,appearance:e,status:t,children:t},t))})},e))})},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: 'Вид × семейство',
  render: () => <Page title="Кнопки" lead="Семейство выбирает группу токенов, «Вид контрола» — моду, под которой эта группа разрешается. Ни одна комбинация ниже не описана в CSS отдельно: кнопка читает три переменные, а остальное делают моды Figma." toolbar={<Counts>
          <Count>{counted(FAMILIES.length, ['семейство', 'семейства', 'семейств'])}</Count>
          <Count>{counted(APPEARANCES.length, ['вид', 'вида', 'видов'])}</Count>
          <ShareLink />
        </Counts>}>
      <Section title="Каждое семейство × каждый вид" description="Наведите курсор или нажмите — состояния ведёт \`controls.css\`, а не React.">
        <ModeGrid columns={appearance.modes.map(m => ({
        key: m.slug,
        label: m.name
      }))} trailing="Figma" rows={FAMILIES.map(family => ({
        key: family.id,
        label: family.label,
        trailing: family.figma,
        cells: APPEARANCES.map(mode => <Button key={mode} family={family.id} appearance={mode}>
                Кнопка
              </Button>)
      }))} />
      </Section>

      <Section title="Состояния" description="Те же кнопки с принудительно выставленным \`data-state\`. Так видно коллекцию «Controls · State» целиком, не ловя курсором каждое состояние.">
        <ModeGrid columns={state.modes.map(m => ({
        key: m.slug,
        label: m.name
      }))} rows={FAMILIES.map(family => ({
        key: family.id,
        label: family.label,
        cells: state.modes.map(m => <Button key={m.slug} family={family.id} state={m.slug as ControlState} disabled={m.slug === 'disabled'}>
                Кнопка
              </Button>)
      }))} />
      </Section>

      <Section title="Размеры" description="Пять вариантов из Figma: XS (32), S (36), M (40), L (44), XL (48). Высота приходит из \`size/base/*\`, поэтому на Mobile шкала пересчитывается.">
        <Surface style={{
        display: 'flex',
        gap: 'var(--box-spacing-base-xs)',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
          {SIZES.map(size => <Button key={size} size={size}>
              {size.toUpperCase()}
            </Button>)}
        </Surface>
      </Section>

      <Section title="Как это разрешается" description="Один переход \`var()\` на каждый слой Figma — ровно та же цепочка, что в файле.">
        <Code>{\`--box-state-accent-fill        ← Controls · State       [data-state]
  --box-control-accent-fill-default  ← Controls · Appearance  [data-appearance]
    --box-interaction-accent-solid-fill-default  ← System · Theme  [data-theme]
      --box-accent-fill-solid
        --box-brand-solid-500        ← Brand · Color          [data-accent]
          --box-palette-indigo-solid-500   ← Primitives · Color\`}</Code>
      </Section>
    </Page>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: 'Статусные кнопки',
  render: () => <Page title="Статусные кнопки" lead="Семейство \`status\` читает те же три переменные, но под модой коллекции «System · Status». Статус живёт на самой кнопке: \`controls.css\` переобъявляет на контроле те переменные темы, что ведут в «System · Status», поэтому четыре тональности уживаются на одной странице.">
      {APPEARANCES.map(mode => <Section key={mode} title={mode}>
          <Surface style={{
        display: 'flex',
        gap: 'var(--box-spacing-base-xs)',
        flexWrap: 'wrap'
      }}>
            {(['positive', 'warning', 'negative', 'information'] as const).map(status => <Button key={status} family="status" appearance={mode} status={status}>
                {status}
              </Button>)}
          </Surface>
        </Section>)}
    </Page>
}`,...O.parameters?.docs?.source}}},k=[`Matrix`,`Statuses`]})))()}A();export{D as Matrix,O as Statuses,k as __namedExportsOrder,b as default};