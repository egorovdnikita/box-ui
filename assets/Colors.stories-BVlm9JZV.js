import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./model-BWRrIg3v.js";import{S as a,_ as o,a as s,b as c,c as l,f as u,g as d,i as f,l as p,m,o as h,p as g,r as _,s as v,t as y,u as b,w as x,x as S,y as C}from"./_ui-OqqgRyzq.js";function w(e,t){let n=new Map;for(let r of e){let e=r.path.split(`/`).slice(0,t).join(` / `),i=n.get(e)??[];i.push(r),n.set(e,i)}return[...n]}function T({mode:e,value:t}){let n=c();return(0,O.jsx)(`button`,{type:`button`,title:`${e.name} → ${t?.alias??``} · клик копирует`,onClick:()=>t?.alias&&n(t.alias,t.alias),style:{display:`block`,width:44,height:26,padding:0,cursor:`pointer`,borderRadius:3,border:`1px solid var(--sb-border)`,background:`var(${t?.cssVar})`}})}function E({cssVar:e,name:t,globals:n}){let r=c(),i=S(e,`color`);return(0,O.jsxs)(`button`,{type:`button`,className:`sb-tile`,onClick:()=>r(`var(${e})`,e),title:`Copy var(${e})`,style:{display:`flex`,flexDirection:`column`,gap:4},children:[(0,O.jsxs)(`span`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,height:52,overflow:`hidden`,borderRadius:`var(--sb-radius)`,border:`1px solid var(--sb-border)`},children:[[`light`,`dark`].map(t=>(0,O.jsxs)(u,{globals:n,theme:t,style:{position:`relative`},children:[(0,O.jsx)(`span`,{style:{position:`absolute`,inset:0,background:`var(${e})`}}),(0,O.jsx)(`span`,{style:{position:`absolute`,insetInline:0,bottom:0,padding:`1px 4px`,background:`var(--box-background-base-primary)`,color:`var(--box-content-base-tertiary)`,fontSize:9,textTransform:`uppercase`,letterSpacing:`0.06em`,textAlign:`center`,opacity:.9},children:t})]},t)),(0,O.jsx)(`span`,{className:`sb-tile__hint`,style:{gridColumn:`1 / -1`}})]}),(0,O.jsx)(`span`,{style:{fontSize:12,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:t}),(0,O.jsxs)(`span`,{className:`sb-code`,style:{overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:[i,` · `,n.theme]})]})}var D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{D=t(),i(),C(),O=n(),{useArgs:k}=__STORYBOOK_MODULE_PREVIEW_API__,A={id:`foundations-colors`,title:`Основы/Цвета`,parameters:{docs:{description:{component:"Цветовые переменные из `Box UI | Primitives` и `Box UI | Tokens`."}}}},j=r.collections.palette,M=r.collections.accent,N=r.collections.mode,P=e=>`group-${e.replace(/[^a-z0-9]+/gi,`-`).toLowerCase()}`,F={name:`Примитивы — палитра`,args:{query:``},render:e=>{let[,t]=k(),n=e.query,r=e=>t({query:e}),i=(0,D.useMemo)(()=>w(n.trim().toLowerCase()?j.variables.filter(e=>x(n,e.path)):j.variables,1),[n]),c=i.reduce((e,[,t])=>e+t.length,0);return(0,O.jsx)(p,{title:`Цветовая палитра`,lead:`${j.variables.length} сырых цветовых переменных из коллекции «Color Palette». Они не меняются ни в одной моде — каждый семантический токен указывает на одну из них. Клик по образцу копирует CSS-переменную.`,toolbar:(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(g,{value:n,onChange:r,placeholder:`blue, alpha, 500…`}),(0,O.jsxs)(s,{children:[(0,O.jsx)(f,{children:a(c,[`образец`,`образца`,`образцов`])}),(0,O.jsx)(f,{children:a(i.length,[`семейство`,`семейства`,`семейств`])}),n&&(0,O.jsx)(b,{onReset:()=>r(``)}),(0,O.jsx)(d,{})]}),!n&&(0,O.jsx)(`div`,{style:{flexBasis:`100%`},children:(0,O.jsx)(l,{items:i.map(([e])=>({id:P(e),label:e}))})})]}),children:c===0?(0,O.jsx)(h,{query:n,onClear:()=>r(``)}):i.map(([e,t])=>(0,O.jsx)(m,{id:P(e),title:e,aside:(0,O.jsx)(f,{children:t.length}),children:(0,O.jsx)(v,{min:124,children:t.map(e=>(0,O.jsx)(o,{cssVar:e.cssVar,name:e.path.split(`/`).slice(1).join(` / `),meta:String(e.values.value?.value??``)},e.cssVar))})},e))})}},I=M.modes.map(e=>{let t=M.variables.find(e=>e.path===`colors/brand/primary`)?.values[e.slug]?.alias?.split(`/`)[0];return t&&t!==e.slug?{mode:e.name,family:t}:null}).filter(e=>e!==null),L={name:`Акцентные моды — Color`,args:{query:``},render:e=>{let[,t]=k(),n=e.query,r=e=>t({query:e}),i=(0,D.useMemo)(()=>n.trim().toLowerCase()?M.variables.filter(e=>x(n,e.path)):M.variables,[n]);return(0,O.jsxs)(p,{title:`Акцентные цветовые моды`,lead:`В коллекции «Color» десять мод. Переключите «Accent» на панели — и каждый брендовый токен ниже начнёт указывать на другую примитивную шкалу, а семантические имена останутся прежними.`,toolbar:(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(g,{value:n,onChange:r,placeholder:`brand, neutral, positive…`}),(0,O.jsxs)(s,{children:[(0,O.jsxs)(f,{children:[a(i.length,[`токен`,`токена`,`токенов`]),` ×`,` `,a(M.modes.length,[`мода`,`моды`,`мод`])]}),n&&(0,O.jsx)(b,{onReset:()=>r(``)}),(0,O.jsx)(d,{})]})]}),children:[I.length>0&&(0,O.jsxs)(y,{title:`Часть мод указывает на чужую шкалу`,children:[I.map((e,t)=>(0,O.jsxs)(`span`,{children:[t>0&&`, `,(0,O.jsx)(`strong`,{children:e.mode}),` разрешается в шкалу `,(0,O.jsx)(`strong`,{children:e.family})]},e.mode)),`. Так это устроено в Figma сегодня, и здесь воспроизведено буквально, а не тихо исправлено — почините в`,` `,(0,O.jsx)(_,{children:`Box UI | Tokens`}),` и пересоберите.`]}),i.length===0?(0,O.jsx)(h,{query:n,onClear:()=>r(``)}):(0,O.jsx)(m,{title:`Каждый токен × каждая мода`,description:`Строки — токены, столбцы — десять мод Figma. В ячейке то, во что мода разрешается: наведите, чтобы увидеть примитив, кликните, чтобы скопировать.`,children:(0,O.jsx)(`div`,{className:`sb-scroller`,children:(0,O.jsxs)(`table`,{className:`sb-table`,children:[(0,O.jsx)(`thead`,{children:(0,O.jsxs)(`tr`,{children:[(0,O.jsx)(`th`,{className:`sb-table__lead`,children:(0,O.jsx)(`span`,{className:`sb-label`,children:`Токен`})}),M.modes.map(e=>(0,O.jsx)(`th`,{children:(0,O.jsx)(`span`,{className:`sb-label`,children:e.name})},e.slug))]})}),(0,O.jsx)(`tbody`,{children:i.map(e=>(0,O.jsxs)(`tr`,{children:[(0,O.jsx)(`td`,{className:`sb-table__lead`,children:(0,O.jsx)(_,{copyable:`var(${e.cssVar})`,children:e.path})}),M.modes.map(t=>(0,O.jsx)(`td`,{children:(0,O.jsx)(T,{mode:t,value:e.values[t.slug]})},t.slug))]},e.cssVar))})]})})})]})}},R={name:`Семантика — светлая и тёмная`,args:{query:``,compare:!0},render:(e,{globals:t})=>{let[,n]=k(),{query:r,compare:i}=e,c=e=>n({query:e}),u=e=>n({compare:e}),_=(0,D.useMemo)(()=>w(r.trim().toLowerCase()?N.variables.filter(e=>x(r,e.path)):N.variables,2),[r]),y=_.reduce((e,[,t])=>e+t.length,0);return(0,O.jsx)(p,{title:`Семантические цвета`,lead:`${N.variables.length} токенов в коллекции «Mode». Каждый разрешается через коллекцию «Color», поэтому они слушаются и переключателя Theme, и переключателя Accent.`,toolbar:(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(g,{value:r,onChange:c,placeholder:`background, border, control…`}),(0,O.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:6,height:28,cursor:`pointer`},children:[(0,O.jsx)(`input`,{type:`checkbox`,checked:i,onChange:e=>u(e.target.checked)}),(0,O.jsx)(`span`,{className:`sb-caption`,children:`Светлая и тёмная рядом`})]}),(0,O.jsxs)(s,{children:[(0,O.jsx)(f,{children:a(y,[`токен`,`токена`,`токенов`])}),r&&(0,O.jsx)(b,{onReset:()=>c(``)}),(0,O.jsx)(d,{})]}),!r&&(0,O.jsx)(`div`,{style:{flexBasis:`100%`},children:(0,O.jsx)(l,{items:_.map(([e])=>({id:P(e),label:e}))})})]}),children:y===0?(0,O.jsx)(h,{query:r,onClear:()=>c(``)}):_.map(([e,n])=>(0,O.jsx)(m,{id:P(e),title:e,aside:(0,O.jsx)(f,{children:n.length}),children:(0,O.jsx)(v,{min:190,children:n.map(e=>i?(0,O.jsx)(E,{cssVar:e.cssVar,name:e.path.split(`/`).slice(2).join(`/`),globals:t},e.cssVar):(0,O.jsx)(o,{cssVar:e.cssVar,name:e.path.split(`/`).slice(2).join(`/`),live:!0},e.cssVar))})},e))})}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  name: 'Примитивы — палитра',
  args: {
    query: ''
  },
  render: args => {
    const [, updateArgs] = useArgs();
    const query = (args as {
      query: string;
    }).query;
    const setQuery = (value: string) => updateArgs({
      query: value
    });
    const groups = useMemo(() => {
      const q = query.trim().toLowerCase();
      const matched = q ? palette.variables.filter(v => matches(query, v.path)) : palette.variables;
      return groupBy(matched, 1);
    }, [query]);
    const total = groups.reduce((sum, [, list]) => sum + list.length, 0);
    return <Page title="Цветовая палитра" lead={\`\${palette.variables.length} сырых цветовых переменных из коллекции «Color Palette». Они не меняются ни в одной моде — каждый семантический токен указывает на одну из них. Клик по образцу копирует CSS-переменную.\`} toolbar={<>
            <Search value={query} onChange={setQuery} placeholder="blue, alpha, 500…" />
            <Counts>
              <Count>{counted(total, ['образец', 'образца', 'образцов'])}</Count>
              <Count>{counted(groups.length, ['семейство', 'семейства', 'семейств'])}</Count>
              {query && <ResetFilters onReset={() => setQuery('')} />}
              <ShareLink />
            </Counts>
            {!query && <div style={{
        flexBasis: '100%'
      }}>
                <JumpNav items={groups.map(([family]) => ({
          id: anchor(family),
          label: family
        }))} />
              </div>}
          </>}>
        {total === 0 ? <Empty query={query} onClear={() => setQuery('')} /> : groups.map(([family, variables]) => <Section key={family} id={anchor(family)} title={family} aside={<Count>{variables.length}</Count>}>
              <Grid min={124}>
                {variables.map(v => <Swatch key={v.cssVar} cssVar={v.cssVar} name={v.path.split('/').slice(1).join(' / ')} meta={String(v.values.value?.value ?? '')} />)}
              </Grid>
            </Section>)}
      </Page>;
  }
}`,...F.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  name: 'Акцентные моды — Color',
  args: {
    query: ''
  },
  render: args => {
    const [, updateArgs] = useArgs();
    const query = (args as {
      query: string;
    }).query;
    const setQuery = (value: string) => updateArgs({
      query: value
    });
    const rows = useMemo(() => {
      const q = query.trim().toLowerCase();
      return q ? accent.variables.filter(v => matches(query, v.path)) : accent.variables;
    }, [query]);
    return <Page title="Акцентные цветовые моды" lead="В коллекции «Color» десять мод. Переключите «Accent» на панели — и каждый брендовый токен ниже начнёт указывать на другую примитивную шкалу, а семантические имена останутся прежними." toolbar={<>
            <Search value={query} onChange={setQuery} placeholder="brand, neutral, positive…" />
            <Counts>
              <Count>
                {counted(rows.length, ['токен', 'токена', 'токенов'])} ×{' '}
                {counted(accent.modes.length, ['мода', 'моды', 'мод'])}
              </Count>
              {query && <ResetFilters onReset={() => setQuery('')} />}
              <ShareLink />
            </Counts>
          </>}>
        {mismatchedModes.length > 0 && <Callout title="Часть мод указывает на чужую шкалу">
            {mismatchedModes.map((entry, index) => <span key={entry.mode}>
                {index > 0 && ', '}
                <strong>{entry.mode}</strong> разрешается в шкалу <strong>{entry.family}</strong>
              </span>)}
            . Так это устроено в Figma сегодня, и здесь воспроизведено буквально, а не тихо исправлено — почините в{' '}
            <Code>Box UI | Tokens</Code> и пересоберите.
          </Callout>}

        {rows.length === 0 ? <Empty query={query} onClear={() => setQuery('')} /> : <Section title="Каждый токен × каждая мода" description="Строки — токены, столбцы — десять мод Figma. В ячейке то, во что мода разрешается: наведите, чтобы увидеть примитив, кликните, чтобы скопировать.">
            <div className="sb-scroller">
              <table className="sb-table">
                <thead>
                  <tr>
                    <th className="sb-table__lead">
                      <span className="sb-label">Токен</span>
                    </th>
                    {accent.modes.map(m => <th key={m.slug}>
                        <span className="sb-label">{m.name}</span>
                      </th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(v => <tr key={v.cssVar}>
                      <td className="sb-table__lead">
                        <Code copyable={\`var(\${v.cssVar})\`}>{v.path}</Code>
                      </td>
                      {accent.modes.map(m => <td key={m.slug}>
                          <AccentCell mode={m} value={v.values[m.slug]} />
                        </td>)}
                    </tr>)}
                </tbody>
              </table>
            </div>
          </Section>}
      </Page>;
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  name: 'Семантика — светлая и тёмная',
  args: {
    query: '',
    compare: true
  },
  render: (args, {
    globals
  }) => {
    const [, updateArgs] = useArgs();
    const {
      query,
      compare
    } = args as unknown as {
      query: string;
      compare: boolean;
    };
    const setQuery = (value: string) => updateArgs({
      query: value
    });
    const setCompare = (value: boolean) => updateArgs({
      compare: value
    });
    const groups = useMemo(() => {
      const q = query.trim().toLowerCase();
      const matched = q ? mode.variables.filter(v => matches(query, v.path)) : mode.variables;
      return groupBy(matched, 2);
    }, [query]);
    const total = groups.reduce((sum, [, list]) => sum + list.length, 0);
    return <Page title="Семантические цвета" lead={\`\${mode.variables.length} токенов в коллекции «Mode». Каждый разрешается через коллекцию «Color», поэтому они слушаются и переключателя Theme, и переключателя Accent.\`} toolbar={<>
            <Search value={query} onChange={setQuery} placeholder="background, border, control…" />
            <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 28,
        cursor: 'pointer'
      }}>
              <input type="checkbox" checked={compare} onChange={e => setCompare(e.target.checked)} />
              <span className="sb-caption">Светлая и тёмная рядом</span>
            </label>
            <Counts>
              <Count>{counted(total, ['токен', 'токена', 'токенов'])}</Count>
              {query && <ResetFilters onReset={() => setQuery('')} />}
              <ShareLink />
            </Counts>
            {!query && <div style={{
        flexBasis: '100%'
      }}>
                <JumpNav items={groups.map(([group]) => ({
          id: anchor(group),
          label: group
        }))} />
              </div>}
          </>}>
        {total === 0 ? <Empty query={query} onClear={() => setQuery('')} /> : groups.map(([group, variables]) => <Section key={group} id={anchor(group)} title={group} aside={<Count>{variables.length}</Count>}>
              <Grid min={190}>
                {variables.map(v => compare ? <SplitSwatch key={v.cssVar} cssVar={v.cssVar} name={v.path.split('/').slice(2).join('/')} globals={globals as unknown as ModeGlobals} /> : <Swatch key={v.cssVar} cssVar={v.cssVar} name={v.path.split('/').slice(2).join('/')} live />)}
              </Grid>
            </Section>)}
      </Page>;
  }
}`,...R.parameters?.docs?.source}}},z=[`Palette`,`Accents`,`Semantic`]})))()}B();export{L as Accents,F as Palette,R as Semantic,z as __namedExportsOrder,A as default};