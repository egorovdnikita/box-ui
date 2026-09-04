import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{t as r}from"./src-BeM6eDJj.js";import"./iframe-CTQc9ObK.js";import{n as i,t as a}from"./model-BWRrIg3v.js";import{S as o,f as s,i as c,l,m as u,n as d,r as f,v as p,y as m}from"./_ui-OqqgRyzq.js";function h(){return(h=e((()=>{t(),r(),n()})))()}function g({variant:e=`body-m`,tone:t,as:n,className:r,children:i,...a}){let o=n??b[e];return(0,v.jsx)(o,{className:y(`box-text`,`box-text--${e}`,t&&t!==`primary`&&`box-text--${t}`,r),...a,children:i})}var _,v,y,b;function x(){return(x=e((()=>{_=t(),v=n(),y=(...e)=>e.filter(Boolean).join(` `),b={"display-l":`h1`,"display-m":`h1`,"display-s":`h1`,h1:`h1`,h2:`h2`,h3:`h3`,h4:`h4`,h5:`h5`,"body-l":`p`,"body-m":`p`,"caption-l":`span`,"caption-m":`span`},(0,_.forwardRef)(function({variant:e=`primary`,size:t=`m`,iconOnly:n,startIcon:r,endIcon:i,className:a,children:o,type:s=`button`,...c},l){return(0,v.jsxs)(`button`,{ref:l,type:s,className:y(`box-button`,`box-button--${e}`,`box-button--${t}`,n&&`box-button--icon-only`,a),...c,children:[r,!n&&o,i]})}),(0,_.forwardRef)(function({label:e,hint:t,error:n,id:r,className:i,...a},o){let s=r??(e?`box-input-${e.replace(/\s+/g,`-`).toLowerCase()}`:void 0),c=n??t;return(0,v.jsxs)(`div`,{className:`box-field`,children:[e&&(0,v.jsx)(`label`,{className:`box-field__label`,htmlFor:s,children:e}),(0,v.jsx)(`input`,{ref:o,id:s,className:y(`box-input`,i),"aria-invalid":n?!0:void 0,...a}),c&&(0,v.jsx)(`span`,{className:y(`box-field__hint`,n&&`box-field__hint--error`),children:c})]})})})))()}function S(){return(S=e((()=>{h(),x()})))()}function C(e){let t=E.variables.find(t=>t.path===`${e}/font-size`),n=E.variables.find(t=>t.path===`${e}/line-height`);return{desktop:`${t?.values.desktop?.alias} / ${n?.values.desktop?.alias}`,mobile:`${t?.values.mobile?.alias} / ${n?.values.mobile?.alias}`}}var w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{a(),S(),m(),w=n(),T={id:`foundations-typography`,title:`Основы/Типографика`},E=i.collections.grid,D=i.collections.font,O=[{variant:`display-l`,token:`typography/display/l`,sample:`Display L`},{variant:`display-m`,token:`typography/display/m`,sample:`Display M`},{variant:`display-s`,token:`typography/display/s`,sample:`Display S`},{variant:`h1`,token:`typography/heading/H1`,sample:`Heading 1`},{variant:`h2`,token:`typography/heading/H2`,sample:`Heading 2`},{variant:`h3`,token:`typography/heading/H3`,sample:`Heading 3`},{variant:`h4`,token:`typography/heading/H4`,sample:`Heading 4`},{variant:`h5`,token:`typography/heading/H5`,sample:`Heading 5`},{variant:`body-l`,token:`typography/body/l`,sample:`Body L — the quick brown fox jumps over the lazy dog`},{variant:`body-m`,token:`typography/body/m`,sample:`Body M — the quick brown fox jumps over the lazy dog`},{variant:`caption-l`,token:`typography/caption/l`,sample:`Caption L — supporting copy`},{variant:`caption-m`,token:`typography/caption/m`,sample:`Caption M — supporting copy`}],k={name:`Шкала текста`,render:()=>(0,w.jsx)(l,{title:`Шкала текста`,lead:`Двенадцать текстовых стилей из коллекции «Grid». У каждой ступени своё значение для Desktop и для Mobile — переключите «Device» на панели, и шкала сожмётся.`,children:(0,w.jsx)(u,{title:`Ступени`,description:`В строке — токен Figma, во что он разрешается на каждом устройстве, и сам стиль.`,aside:(0,w.jsx)(c,{children:o(O.length,[`стиль`,`стиля`,`стилей`])}),children:(0,w.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`},children:O.map(({variant:e,token:t,sample:n})=>{let r=C(t),i=r.desktop!==r.mobile;return(0,w.jsxs)(`div`,{className:`sb-row`,style:{display:`flex`,flexDirection:`column`,gap:6,padding:`12px 6px`},children:[(0,w.jsxs)(`div`,{style:{display:`flex`,gap:10,flexWrap:`wrap`,alignItems:`baseline`},children:[(0,w.jsx)(f,{copyable:t,children:t}),(0,w.jsxs)(d,{children:[r.desktop,i&&` · mobile ${r.mobile}`]}),i&&(0,w.jsx)(c,{children:`адаптивный`})]}),(0,w.jsx)(g,{variant:e,as:`div`,style:{color:`var(--sb-text)`},children:n})]},e)})})})})},A={name:`Моды гарнитур`,render:(e,{globals:t})=>(0,w.jsxs)(l,{title:`Моды гарнитур`,lead:"Коллекция «Typography» подменяет семейство за `typography/font-family/*`. Ниже сразу все четыре моды; переключатель на панели меняет ту, которой пользуется остальной Storybook.",children:[D.modes.map(e=>(0,w.jsx)(u,{title:e.name,aside:(0,w.jsx)(f,{children:`[data-font="${e.slug}"]`}),children:(0,w.jsxs)(s,{globals:t,font:e.slug,style:{...p,display:`flex`,flexDirection:`column`,gap:`var(--box-spacing-base-4xs)`},children:[(0,w.jsxs)(g,{variant:`h3`,as:`div`,children:[`Box UI — `,e.name]}),(0,w.jsx)(g,{variant:`body-m`,as:`div`,tone:`secondary`,children:`The quick brown fox jumps over the lazy dog · 0123456789`})]})},e.slug)),(0,w.jsx)(u,{title:`Запасные шрифты`,description:"Из Figma приходит только имя семейства. Сгенерированный CSS дописывает `var(--box-font-fallback)`, чтобы недоступная гарнитура падала в системный стек, а не в засечный шрифт по умолчанию.",children:(0,w.jsx)(f,{children:`--box-type-font-family-heading: "Inter Display", var(--box-font-fallback);`})})]})},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: 'Шкала текста',
  render: () => <Page title="Шкала текста" lead="Двенадцать текстовых стилей из коллекции «Grid». У каждой ступени своё значение для Desktop и для Mobile — переключите «Device» на панели, и шкала сожмётся.">
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: 'Моды гарнитур',
  render: (_args, {
    globals
  }) => <Page title="Моды гарнитур" lead="Коллекция «Typography» подменяет семейство за \`typography/font-family/*\`. Ниже сразу все четыре моды; переключатель на панели меняет ту, которой пользуется остальной Storybook.">
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
        <Code>--box-type-font-family-heading: "Inter Display", var(--box-font-fallback);</Code>
      </Section>
    </Page>
}`,...A.parameters?.docs?.source}}},j=[`Ramp`,`Typefaces`]})))()}M();export{k as Ramp,A as Typefaces,j as __namedExportsOrder,T as default};