import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./model-D0w5O0a5.js";import{S as i,d as a,f as o,i as s,l as c,m as l,s as u,v as d,y as f}from"./_ui-Drlf5waf.js";function p(e){let t=e.values.desktop?.alias?.split(`/`).pop(),n=e.values.mobile?.alias?.split(`/`).pop();return t===n?t:`${t} · mobile ${n}`}var m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{r(),f(),m=t(),h={id:`foundations-scales`,title:`Основы/Шкалы`},g=n.collections[`sys-responsive`],_=n.collections[`brand-rounding`],v=e=>g.variables.filter(t=>t.path.startsWith(`${e}/`)),y=`Строки, где значения расходятся, на Mobile сжимаются — переключите «Device» на панели и посмотрите, как они меняются.`,b={name:`Отступы`,render:()=>(0,m.jsx)(c,{title:`Отступы`,lead:"`spacing/base/*` живёт в коллекции «◑ System · Responsive»: тринадцать ступеней, у каждой значение для Desktop и для Mobile. Начиная с `s` мобильная версия спускается на одну ступень примитивной шкалы.",children:(0,m.jsx)(l,{title:`Ступени`,description:y,aside:(0,m.jsx)(s,{children:i(v(`spacing`).length,[`ступень`,`ступени`,`ступеней`])}),children:v(`spacing`).map(e=>(0,m.jsx)(a,{label:e.cssVar,value:p(e),live:!0,children:(0,m.jsx)(`div`,{style:{height:14,width:`var(${e.cssVar})`,background:`var(--box-accent-fill-solid)`,borderRadius:`var(--box-rounding-base-min)`}})},e.cssVar))})})},x={name:`Скругления`,render:(e,{globals:t})=>(0,m.jsxs)(c,{title:`Скругления`,lead:"Здесь складываются две коллекции. «☯︎ Brand · Rounding» сопоставляет каждой ступени примитивный радиус для своей плотности (Low / Medium / High), а «◑ System · Responsive» переназначает ступени ещё раз для Mobile — `xl` на Desktop разрешается в значение `l` на Mobile.",children:[(0,m.jsx)(l,{title:`Моды плотности`,description:`Все три плотности рядом; переключатель «Radius» на панели управляет остальным Storybook.`,children:(0,m.jsx)(u,{min:230,children:_.modes.map(e=>(0,m.jsxs)(o,{globals:t,radius:e.slug,style:{...d,display:`flex`,flexDirection:`column`,gap:`var(--box-spacing-base-3xs)`},children:[(0,m.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,justifyContent:`space-between`,gap:8},children:[(0,m.jsx)(`span`,{style:{fontSize:`var(--box-typography-caption-l-font-size)`},children:e.name}),(0,m.jsx)(`code`,{className:`sb-code`,style:{color:`var(--box-surface-base-content-muted)`},children:`[data-radius="${e.slug}"]`})]}),(0,m.jsx)(`div`,{style:{display:`flex`,gap:`var(--box-spacing-base-4xs)`,flexWrap:`wrap`},children:[`xs`,`s`,`m`,`l`,`xl`,`2xl`].map(e=>(0,m.jsx)(`div`,{title:`rounding/base/${e}`,style:{display:`grid`,placeItems:`center`,width:46,height:46,background:`var(--box-accent-fill-soft)`,border:`1px solid var(--box-accent-content-on-soft-default)`,borderRadius:`var(--box-rounding-base-${e})`,color:`var(--box-accent-content-on-soft-default)`,fontSize:`var(--box-typography-caption-m-font-size)`},children:e},e))})]},e.slug))})}),(0,m.jsx)(l,{title:`Ступени`,description:y,aside:(0,m.jsx)(s,{children:i(v(`rounding`).length,[`ступень`,`ступени`,`ступеней`])}),children:v(`rounding`).map(e=>(0,m.jsx)(a,{label:e.cssVar,value:p(e),live:!0,children:(0,m.jsx)(`div`,{style:{width:76,height:42,borderRadius:`var(${e.cssVar})`,background:`var(--box-accent-fill-soft)`,border:`1px solid var(--box-accent-content-on-soft-default)`}})},e.cssVar))})]})},S={name:`Размеры`,render:()=>(0,m.jsx)(c,{title:`Размеры`,lead:"`size/base/*` из коллекции «◑ System · Responsive» — высоты контролов, боксы иконок, аватары.",children:(0,m.jsx)(l,{title:`Ступени`,aside:(0,m.jsx)(s,{children:i(v(`size`).length,[`ступень`,`ступени`,`ступеней`])}),children:v(`size`).map(e=>(0,m.jsx)(a,{label:e.cssVar,value:p(e),live:!0,children:(0,m.jsx)(`div`,{style:{display:`grid`,placeItems:`center`,width:`var(${e.cssVar})`,height:`var(${e.cssVar})`,background:`var(--box-interaction-neutral-grayscale-solid-fill-default)`,borderRadius:`var(--box-rounding-base-2xs)`,color:`var(--box-surface-base-content-muted)`,fontSize:`var(--box-typography-caption-m-font-size)`},children:e.path.split(`/`).pop()})},e.cssVar))})})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Отступы',
  render: () => <Page title="Отступы" lead="\`spacing/base/*\` живёт в коллекции «◑ System · Responsive»: тринадцать ступеней, у каждой значение для Desktop и для Mobile. Начиная с \`s\` мобильная версия спускается на одну ступень примитивной шкалы.">
      <Section title="Ступени" description={RESPONSIVE_HINT} aside={<Count>{counted(semantic('spacing').length, ['ступень', 'ступени', 'ступеней'])}</Count>}>
        {semantic('spacing').map(v => <Row key={v.cssVar} label={v.cssVar} value={deviceValue(v)} live>
            <div style={{
          height: 14,
          width: \`var(\${v.cssVar})\`,
          background: 'var(--box-accent-fill-solid)',
          borderRadius: 'var(--box-rounding-base-min)'
        }} />
          </Row>)}
      </Section>
    </Page>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Скругления',
  render: (_args, {
    globals
  }) => <Page title="Скругления" lead="Здесь складываются две коллекции. «☯︎ Brand · Rounding» сопоставляет каждой ступени примитивный радиус для своей плотности (Low / Medium / High), а «◑ System · Responsive» переназначает ступени ещё раз для Mobile — \`xl\` на Desktop разрешается в значение \`l\` на Mobile.">
      <Section title="Моды плотности" description="Все три плотности рядом; переключатель «Radius» на панели управляет остальным Storybook.">
        <Grid min={230}>
          {radius.modes.map(m => <Scope key={m.slug} globals={globals as unknown as ModeGlobals} radius={m.slug} style={{
          ...demoSurface,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--box-spacing-base-3xs)'
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 8
          }}>
                <span style={{
              fontSize: 'var(--box-typography-caption-l-font-size)'
            }}>{m.name}</span>
                <code className="sb-code" style={{
              color: 'var(--box-surface-base-content-muted)'
            }}>{\`[data-radius="\${m.slug}"]\`}</code>
              </div>
              <div style={{
            display: 'flex',
            gap: 'var(--box-spacing-base-4xs)',
            flexWrap: 'wrap'
          }}>
                {['xs', 's', 'm', 'l', 'xl', '2xl'].map(step => <div key={step} title={\`rounding/base/\${step}\`} style={{
              display: 'grid',
              placeItems: 'center',
              width: 46,
              height: 46,
              background: 'var(--box-accent-fill-soft)',
              border: '1px solid var(--box-accent-content-on-soft-default)',
              borderRadius: \`var(--box-rounding-base-\${step})\`,
              color: 'var(--box-accent-content-on-soft-default)',
              fontSize: 'var(--box-typography-caption-m-font-size)'
            }}>
                    {step}
                  </div>)}
              </div>
            </Scope>)}
        </Grid>
      </Section>

      <Section title="Ступени" description={RESPONSIVE_HINT} aside={<Count>{counted(semantic('rounding').length, ['ступень', 'ступени', 'ступеней'])}</Count>}>
        {semantic('rounding').map(v => <Row key={v.cssVar} label={v.cssVar} value={deviceValue(v)} live>
            <div style={{
          width: 76,
          height: 42,
          borderRadius: \`var(\${v.cssVar})\`,
          background: 'var(--box-accent-fill-soft)',
          border: '1px solid var(--box-accent-content-on-soft-default)'
        }} />
          </Row>)}
      </Section>
    </Page>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'Размеры',
  render: () => <Page title="Размеры" lead="\`size/base/*\` из коллекции «◑ System · Responsive» — высоты контролов, боксы иконок, аватары.">
      <Section title="Ступени" aside={<Count>{counted(semantic('size').length, ['ступень', 'ступени', 'ступеней'])}</Count>}>
        {semantic('size').map(v => <Row key={v.cssVar} label={v.cssVar} value={deviceValue(v)} live>
            <div style={{
          display: 'grid',
          placeItems: 'center',
          width: \`var(\${v.cssVar})\`,
          height: \`var(\${v.cssVar})\`,
          background: 'var(--box-interaction-neutral-grayscale-solid-fill-default)',
          borderRadius: 'var(--box-rounding-base-2xs)',
          color: 'var(--box-surface-base-content-muted)',
          fontSize: 'var(--box-typography-caption-m-font-size)'
        }}>
              {v.path.split('/').pop()}
            </div>
          </Row>)}
      </Section>
    </Page>
}`,...S.parameters?.docs?.source}}},C=[`Spacing`,`Rounding`,`Sizes`]})))()}w();export{x as Rounding,S as Sizes,b as Spacing,C as __namedExportsOrder,h as default};