import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./model-BWRrIg3v.js";import{S as i,d as a,f as o,i as s,l as c,m as l,r as u,s as d,v as f,y as p}from"./_ui-OqqgRyzq.js";function m(e){let t=e.values.desktop?.alias?.split(`/`).pop(),n=e.values.mobile?.alias?.split(`/`).pop();return t===n?t:`${t} · mobile ${n}`}var h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{r(),p(),h=t(),g={id:`foundations-scales`,title:`Основы/Шкалы`},_=n.collections.grid,v=n.collections.radius,y=e=>_.variables.filter(t=>t.path.startsWith(`${e}/`)),b=`Строки, где значения расходятся, на Mobile сжимаются — переключите «Device» на панели и посмотрите, как они меняются.`,x={name:`Отступы`,render:()=>(0,h.jsx)(c,{title:`Отступы`,lead:"`spacing/base/*` живёт в коллекции «Grid»: тринадцать ступеней, у каждой значение для Desktop и для Mobile. Начиная с `s` мобильная версия спускается на одну ступень примитивной шкалы.",children:(0,h.jsx)(l,{title:`Ступени`,description:b,aside:(0,h.jsx)(s,{children:i(y(`spacing`).length,[`ступень`,`ступени`,`ступеней`])}),children:y(`spacing`).map(e=>(0,h.jsx)(a,{label:e.cssVar,value:m(e),live:!0,children:(0,h.jsx)(`div`,{style:{height:14,width:`var(${e.cssVar})`,background:`var(--box-background-sentiment-primary)`,borderRadius:`var(--box-rounding-base-min)`}})},e.cssVar))})})},S={name:`Скругления`,render:(e,{globals:t})=>(0,h.jsxs)(c,{title:`Скругления`,lead:"Здесь складываются две коллекции. «Rounding» сопоставляет каждой ступени примитивный радиус для своей плотности (Low / Medium / High), а «Grid» переназначает ступени ещё раз для Mobile — `xl` на Desktop разрешается в значение `l` на Mobile.",children:[(0,h.jsx)(l,{title:`Моды плотности`,description:`Все три плотности рядом; переключатель «Radius» на панели управляет остальным Storybook.`,children:(0,h.jsx)(d,{min:230,children:v.modes.map(e=>(0,h.jsxs)(o,{globals:t,radius:e.slug,style:{...f,display:`flex`,flexDirection:`column`,gap:`var(--box-spacing-base-3xs)`},children:[(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,justifyContent:`space-between`,gap:8},children:[(0,h.jsx)(`span`,{style:{fontSize:`var(--box-typography-caption-l-font-size)`},children:e.name}),(0,h.jsx)(`code`,{className:`sb-code`,style:{color:`var(--box-content-base-secondary)`},children:`[data-radius="${e.slug}"]`})]}),(0,h.jsx)(`div`,{style:{display:`flex`,gap:`var(--box-spacing-base-4xs)`,flexWrap:`wrap`},children:[`xs`,`s`,`m`,`l`,`xl`,`2xl`].map(e=>(0,h.jsx)(`div`,{title:`rounding/base/${e}`,style:{display:`grid`,placeItems:`center`,width:46,height:46,background:`var(--box-background-sentiment-primary-subtle)`,border:`1px solid var(--box-content-sentiment-primary)`,borderRadius:`var(--box-rounding-base-${e})`,color:`var(--box-content-sentiment-primary)`,fontSize:`var(--box-typography-caption-m-font-size)`},children:e},e))})]},e.slug))})}),(0,h.jsx)(l,{title:`Ступени`,description:b,aside:(0,h.jsx)(s,{children:i(y(`rounding`).length,[`ступень`,`ступени`,`ступеней`])}),children:y(`rounding`).map(e=>(0,h.jsx)(a,{label:e.cssVar,value:m(e),live:!0,children:(0,h.jsx)(`div`,{style:{width:76,height:42,borderRadius:`var(${e.cssVar})`,background:`var(--box-background-sentiment-primary-subtle)`,border:`1px solid var(--box-content-sentiment-primary)`}})},e.cssVar))})]})},C={name:`Размеры`,render:()=>(0,h.jsx)(c,{title:`Размеры`,lead:"`size/base/*` из коллекции «Grid» — высоты контролов, боксы иконок, аватары.",children:(0,h.jsx)(l,{title:`Ступени`,aside:(0,h.jsx)(s,{children:i(y(`size`).length,[`ступень`,`ступени`,`ступеней`])}),children:y(`size`).map(e=>(0,h.jsx)(a,{label:e.cssVar,value:m(e),live:!0,children:(0,h.jsx)(`div`,{style:{display:`grid`,placeItems:`center`,width:`var(${e.cssVar})`,height:`var(${e.cssVar})`,background:`var(--box-control-neutral-primary)`,borderRadius:`var(--box-rounding-base-2xs)`,color:`var(--box-content-base-secondary)`,fontSize:`var(--box-typography-caption-m-font-size)`},children:e.path.split(`/`).pop()})},e.cssVar))})})},w={name:`Прозрачность`,render:()=>(0,h.jsx)(c,{title:`Прозрачность`,lead:"Примитивная коллекция «Opacity», выводится безразмерными долями (`opacity/40` → `0.4`).",children:(0,h.jsx)(l,{title:`Ступени`,aside:(0,h.jsx)(s,{children:i(n.collections.opacity.variables.length,[`ступень`,`ступени`,`ступеней`])}),children:(0,h.jsx)(d,{min:112,children:n.collections.opacity.variables.map(e=>(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--box-spacing-base-min)`},children:[(0,h.jsx)(`div`,{style:{height:46,borderRadius:`var(--box-rounding-base-xs)`,border:`1px solid var(--box-border-base-neutral)`,background:`var(--box-background-sentiment-primary)`,opacity:`var(${e.cssVar})`}}),(0,h.jsx)(u,{copyable:`var(${e.cssVar})`,children:e.path})]},e.cssVar))})})})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Отступы',
  render: () => <Page title="Отступы" lead="\`spacing/base/*\` живёт в коллекции «Grid»: тринадцать ступеней, у каждой значение для Desktop и для Mobile. Начиная с \`s\` мобильная версия спускается на одну ступень примитивной шкалы.">
      <Section title="Ступени" description={RESPONSIVE_HINT} aside={<Count>{counted(semantic('spacing').length, ['ступень', 'ступени', 'ступеней'])}</Count>}>
        {semantic('spacing').map(v => <Row key={v.cssVar} label={v.cssVar} value={deviceValue(v)} live>
            <div style={{
          height: 14,
          width: \`var(\${v.cssVar})\`,
          background: 'var(--box-background-sentiment-primary)',
          borderRadius: 'var(--box-rounding-base-min)'
        }} />
          </Row>)}
      </Section>
    </Page>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'Скругления',
  render: (_args, {
    globals
  }) => <Page title="Скругления" lead="Здесь складываются две коллекции. «Rounding» сопоставляет каждой ступени примитивный радиус для своей плотности (Low / Medium / High), а «Grid» переназначает ступени ещё раз для Mobile — \`xl\` на Desktop разрешается в значение \`l\` на Mobile.">
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
              color: 'var(--box-content-base-secondary)'
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
              background: 'var(--box-background-sentiment-primary-subtle)',
              border: '1px solid var(--box-content-sentiment-primary)',
              borderRadius: \`var(--box-rounding-base-\${step})\`,
              color: 'var(--box-content-sentiment-primary)',
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
          background: 'var(--box-background-sentiment-primary-subtle)',
          border: '1px solid var(--box-content-sentiment-primary)'
        }} />
          </Row>)}
      </Section>
    </Page>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Размеры',
  render: () => <Page title="Размеры" lead="\`size/base/*\` из коллекции «Grid» — высоты контролов, боксы иконок, аватары.">
      <Section title="Ступени" aside={<Count>{counted(semantic('size').length, ['ступень', 'ступени', 'ступеней'])}</Count>}>
        {semantic('size').map(v => <Row key={v.cssVar} label={v.cssVar} value={deviceValue(v)} live>
            <div style={{
          display: 'grid',
          placeItems: 'center',
          width: \`var(\${v.cssVar})\`,
          height: \`var(\${v.cssVar})\`,
          background: 'var(--box-control-neutral-primary)',
          borderRadius: 'var(--box-rounding-base-2xs)',
          color: 'var(--box-content-base-secondary)',
          fontSize: 'var(--box-typography-caption-m-font-size)'
        }}>
              {v.path.split('/').pop()}
            </div>
          </Row>)}
      </Section>
    </Page>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Прозрачность',
  render: () => <Page title="Прозрачность" lead="Примитивная коллекция «Opacity», выводится безразмерными долями (\`opacity/40\` → \`0.4\`).">
      <Section title="Ступени" aside={<Count>{counted(model.collections.opacity.variables.length, ['ступень', 'ступени', 'ступеней'])}</Count>}>
        <Grid min={112}>
          {model.collections.opacity.variables.map(v => <div key={v.cssVar} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--box-spacing-base-min)'
        }}>
              <div style={{
            height: 46,
            borderRadius: 'var(--box-rounding-base-xs)',
            border: '1px solid var(--box-border-base-neutral)',
            background: 'var(--box-background-sentiment-primary)',
            opacity: \`var(\${v.cssVar})\`
          }} />
              <Code copyable={\`var(\${v.cssVar})\`}>{v.path}</Code>
            </div>)}
        </Grid>
      </Section>
    </Page>
}`,...w.parameters?.docs?.source}}},T=[`Spacing`,`Rounding`,`Sizes`,`Opacity`]})))()}E();export{w as Opacity,S as Rounding,C as Sizes,x as Spacing,T as __namedExportsOrder,g as default};