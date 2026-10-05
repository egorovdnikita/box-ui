import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./model-D0w5O0a5.js";import{r as i,t as a}from"./src-BDI9D27A.js";import{S as o,f as s,i as c,l,m as u,n as d,r as f,v as p,y as m}from"./_ui-Drlf5waf.js";function h(e){let t=v.variables.find(t=>t.path===`${e}/font-size`),n=v.variables.find(t=>t.path===`${e}/line-height`);return{desktop:`${t?.values.desktop?.alias} / ${n?.values.desktop?.alias}`,mobile:`${t?.values.mobile?.alias} / ${n?.values.mobile?.alias}`}}var g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{r(),a(),m(),g=t(),_={id:`foundations-typography`,title:`Основы/Типографика`},v=n.collections[`sys-responsive`],y=n.collections[`brand-type`],b=[{variant:`display-l`,token:`typography/display/l`,sample:`Display L`},{variant:`display-m`,token:`typography/display/m`,sample:`Display M`},{variant:`display-s`,token:`typography/display/s`,sample:`Display S`},{variant:`h1`,token:`typography/heading/H1`,sample:`Heading 1`},{variant:`h2`,token:`typography/heading/H2`,sample:`Heading 2`},{variant:`h3`,token:`typography/heading/H3`,sample:`Heading 3`},{variant:`h4`,token:`typography/heading/H4`,sample:`Heading 4`},{variant:`h5`,token:`typography/heading/H5`,sample:`Heading 5`},{variant:`body-l`,token:`typography/body/l`,sample:`Body L — the quick brown fox jumps over the lazy dog`},{variant:`body-m`,token:`typography/body/m`,sample:`Body M — the quick brown fox jumps over the lazy dog`},{variant:`caption-l`,token:`typography/caption/l`,sample:`Caption L — supporting copy`},{variant:`caption-m`,token:`typography/caption/m`,sample:`Caption M — supporting copy`}],x={name:`Шкала текста`,render:()=>(0,g.jsx)(l,{title:`Шкала текста`,lead:`Двенадцать текстовых стилей из коллекции «◑ System · Responsive». У каждой ступени своё значение для Desktop и для Mobile — переключите «Device» на панели, и шкала сожмётся.`,children:(0,g.jsx)(u,{title:`Ступени`,description:`В строке — токен Figma, во что он разрешается на каждом устройстве, и сам стиль.`,aside:(0,g.jsx)(c,{children:o(b.length,[`стиль`,`стиля`,`стилей`])}),children:(0,g.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`},children:b.map(({variant:e,token:t,sample:n})=>{let r=h(t),a=r.desktop!==r.mobile;return(0,g.jsxs)(`div`,{className:`sb-row`,style:{display:`flex`,flexDirection:`column`,gap:6,padding:`12px 6px`},children:[(0,g.jsxs)(`div`,{style:{display:`flex`,gap:10,flexWrap:`wrap`,alignItems:`baseline`},children:[(0,g.jsx)(f,{copyable:t,children:t}),(0,g.jsxs)(d,{children:[r.desktop,a&&` · mobile ${r.mobile}`]}),a&&(0,g.jsx)(c,{children:`адаптивный`})]}),(0,g.jsx)(i,{variant:e,as:`div`,style:{color:`var(--sb-text)`},children:n})]},e)})})})})},S={name:`Моды гарнитур`,render:(e,{globals:t})=>(0,g.jsxs)(l,{title:`Моды гарнитур`,lead:"Коллекция «☯︎ Brand · Typography» подменяет семейство за `typography/font-family/*`. Ниже сразу все четыре моды; переключатель на панели меняет ту, которой пользуется остальной Storybook.",children:[y.modes.map(e=>(0,g.jsx)(u,{title:e.name,aside:(0,g.jsx)(f,{children:`[data-font="${e.slug}"]`}),children:(0,g.jsxs)(s,{globals:t,font:e.slug,style:{...p,display:`flex`,flexDirection:`column`,gap:`var(--box-spacing-base-4xs)`},children:[(0,g.jsxs)(i,{variant:`h3`,as:`div`,children:[`Box UI — `,e.name]}),(0,g.jsx)(i,{variant:`body-m`,as:`div`,tone:`secondary`,children:`The quick brown fox jumps over the lazy dog · 0123456789`})]})},e.slug)),(0,g.jsx)(u,{title:`Запасные шрифты`,description:"Из Figma приходит только имя семейства. Сгенерированный CSS дописывает `var(--box-font-fallback)`, чтобы недоступная гарнитура падала в системный стек, а не в засечный шрифт по умолчанию.",children:(0,g.jsx)(f,{children:`--box-typography-font-family-heading: "Inter Display", var(--box-font-fallback);`})})]})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Шкала текста',
  render: () => <Page title="Шкала текста" lead="Двенадцать текстовых стилей из коллекции «◑ System · Responsive». У каждой ступени своё значение для Desktop и для Mobile — переключите «Device» на панели, и шкала сожмётся.">
      <Section title="Ступени" description="В строке — токен Figma, во что он разрешается на каждом устройстве, и сам стиль." aside={<Count>{counted(RAMP.length, ['стиль', 'стиля', 'стилей'])}</Count>}>
        <div style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
          {RAMP.map(({
          variant,
          token,
          sample
        }) => {
          const sizes = sizesFor(token);
          const responsive = sizes.desktop !== sizes.mobile;
          return <div key={variant} className="sb-row" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: '12px 6px'
          }}>
                <div style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              alignItems: 'baseline'
            }}>
                  <Code copyable={token}>{token}</Code>
                  <Caption>
                    {sizes.desktop}
                    {responsive && \` · mobile \${sizes.mobile}\`}
                  </Caption>
                  {responsive && <Count>адаптивный</Count>}
                </div>
                <Text variant={variant} as="div" style={{
              color: 'var(--sb-text)'
            }}>
                  {sample}
                </Text>
              </div>;
        })}
        </div>
      </Section>
    </Page>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'Моды гарнитур',
  render: (_args, {
    globals
  }) => <Page title="Моды гарнитур" lead="Коллекция «☯︎ Brand · Typography» подменяет семейство за \`typography/font-family/*\`. Ниже сразу все четыре моды; переключатель на панели меняет ту, которой пользуется остальной Storybook.">
      {font.modes.map(m => <Section key={m.slug} title={m.name} aside={<Code>{\`[data-font="\${m.slug}"]\`}</Code>}>
          <Scope globals={globals as unknown as ModeGlobals} font={m.slug} style={{
        ...demoSurface,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--box-spacing-base-4xs)'
      }}>
            <Text variant="h3" as="div">
              Box UI — {m.name}
            </Text>
            <Text variant="body-m" as="div" tone="secondary">
              The quick brown fox jumps over the lazy dog · 0123456789
            </Text>
          </Scope>
        </Section>)}
      <Section title="Запасные шрифты" description="Из Figma приходит только имя семейства. Сгенерированный CSS дописывает \`var(--box-font-fallback)\`, чтобы недоступная гарнитура падала в системный стек, а не в засечный шрифт по умолчанию.">
        <Code>--box-typography-font-family-heading: "Inter Display", var(--box-font-fallback);</Code>
      </Section>
    </Page>
}`,...S.parameters?.docs?.source}}},C=[`Ramp`,`Typefaces`]})))()}w();export{x as Ramp,S as Typefaces,C as __namedExportsOrder,_ as default};