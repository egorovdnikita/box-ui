import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./model-D0w5O0a5.js";import{S as a,_ as o,a as s,b as c,c as l,f as u,g as d,i as f,l as p,m,o as h,p as g,r as _,s as v,t as y,u as b,w as x,x as S,y as C}from"./_ui-Drlf5waf.js";function w(e){if(e?.value!==void 0)return String(e.value);if(e?.opacity===void 0)return``;let t=e.alias?.split(`:`)[1]?.replace(/^color\//,``)??``;return`${e.opacity}% · ${t}`}function T(e,t){let n=new Map;for(let r of e){let e=r.path.split(`/`).slice(0,t).join(` / `),i=n.get(e)??[];i.push(r),n.set(e,i)}return[...n]}function E({mode:e,value:t}){let n=c();return(0,k.jsx)(`button`,{type:`button`,title:`${e.name} → ${t?.alias??``} · клик копирует`,onClick:()=>t?.alias&&n(t.alias,t.alias),style:{display:`block`,width:44,height:26,padding:0,cursor:`pointer`,borderRadius:3,border:`1px solid var(--sb-border)`,background:`var(${t?.cssVar})`}})}function D({cssVar:e,name:t,globals:n}){let r=c(),i=S(e,`color`);return(0,k.jsxs)(`button`,{type:`button`,className:`sb-tile`,onClick:()=>r(`var(${e})`,e),title:`Copy var(${e})`,style:{display:`flex`,flexDirection:`column`,gap:4},children:[(0,k.jsxs)(`span`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,height:52,overflow:`hidden`,borderRadius:`var(--sb-radius)`,border:`1px solid var(--sb-border)`},children:[[`light`,`dark`].map(t=>(0,k.jsxs)(u,{globals:n,theme:t,style:{position:`relative`},children:[(0,k.jsx)(`span`,{style:{position:`absolute`,inset:0,background:`var(${e})`}}),(0,k.jsx)(`span`,{style:{position:`absolute`,insetInline:0,bottom:0,padding:`1px 4px`,background:`var(--box-surface-base-fill-page)`,color:`var(--box-surface-base-content-subtle)`,fontSize:9,textTransform:`uppercase`,letterSpacing:`0.06em`,textAlign:`center`,opacity:.9},children:t})]},t)),(0,k.jsx)(`span`,{className:`sb-tile__hint`,style:{gridColumn:`1 / -1`}})]}),(0,k.jsx)(`span`,{style:{fontSize:12,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:t}),(0,k.jsxs)(`span`,{className:`sb-code`,style:{overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:[i,` · `,n.theme]})]})}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G;function K(){return(K=e((()=>{O=t(),i(),C(),k=n(),{useArgs:A}=__STORYBOOK_MODULE_PREVIEW_API__,j={id:`foundations-colors`,title:`Основы/Цвета`,parameters:{docs:{description:{component:"Цветовые переменные из `Box UI | Components` — примитивы, именованные шкалы, акцент, тема и статусы."}}}},M={...r.collections[`prim-color`],variables:r.collections[`prim-color`].variables.map(e=>({...e,path:e.path.replace(/^color\//,``)}))},N=r.collections[`sys-color`],P=r.collections[`brand-color`],F=r.collections[`sys-theme`],I=r.collections[`sys-status`],L=e=>`group-${e.replace(/[^a-z0-9]+/gi,`-`).toLowerCase()}`,R={name:`Примитивы — палитра`,args:{query:``},render:e=>{let[,t]=A(),n=e.query,r=e=>t({query:e}),i=(0,O.useMemo)(()=>T(n.trim().toLowerCase()?M.variables.filter(e=>x(n,e.path)):M.variables,1),[n]),c=i.reduce((e,[,t])=>e+t.length,0);return(0,k.jsx)(p,{title:`Цветовая палитра`,lead:`${M.variables.length} сырых цветовых переменных из коллекции «◉ Primitives · Color». Они не меняются ни в одной моде — всё остальное указывает на них. Прозрачные ступени Figma хранит как «эта шкала на N%», и в CSS они становятся \u0060color-mix()\u0060. Клик по образцу копирует CSS-переменную.`,toolbar:(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(g,{value:n,onChange:r,placeholder:`blue, alpha, 500…`}),(0,k.jsxs)(s,{children:[(0,k.jsx)(f,{children:a(c,[`образец`,`образца`,`образцов`])}),(0,k.jsx)(f,{children:a(i.length,[`семейство`,`семейства`,`семейств`])}),n&&(0,k.jsx)(b,{onReset:()=>r(``)}),(0,k.jsx)(d,{})]}),!n&&(0,k.jsx)(`div`,{style:{flexBasis:`100%`},children:(0,k.jsx)(l,{items:i.map(([e])=>({id:L(e),label:e}))})})]}),children:c===0?(0,k.jsx)(h,{query:n,onClear:()=>r(``)}):i.map(([e,t])=>(0,k.jsx)(m,{id:L(e),title:e,aside:(0,k.jsx)(f,{children:t.length}),children:(0,k.jsx)(v,{min:124,children:t.map(e=>(0,k.jsx)(o,{cssVar:e.cssVar,name:e.path.split(`/`).slice(1).join(` / `),meta:w(e.values.value)},e.cssVar))})},e))})}},z=new Set(M.variables.map(e=>e.path.split(`/`)[0])),B=P.modes.filter(e=>z.has(e.slug)).map(e=>{let t=P.variables.find(e=>e.path===`color/solid/500`)?.values[e.slug]?.alias?.split(`:`)[1]?.split(`/`)[1];return t&&t!==e.slug?{mode:e.name,family:t}:null}).filter(e=>e!==null),V={name:`Акцентные моды — Brand · Color`,args:{query:``},render:e=>{let[,t]=A(),n=e.query,r=e=>t({query:e}),i=(0,O.useMemo)(()=>n.trim().toLowerCase()?P.variables.filter(e=>x(n,e.path)):P.variables,[n]);return(0,k.jsxs)(p,{title:`Акцентные цветовые моды`,lead:`В коллекции «☯︎ Brand · Color» ${P.modes.length} мод. Переключите «Акцент» на панели — и каждый брендовый токен ниже начнёт указывать на другую примитивную шкалу, а семантические имена останутся прежними.`,toolbar:(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(g,{value:n,onChange:r,placeholder:`brand, neutral, positive…`}),(0,k.jsxs)(s,{children:[(0,k.jsxs)(f,{children:[a(i.length,[`токен`,`токена`,`токенов`]),` ×`,` `,a(P.modes.length,[`мода`,`моды`,`мод`])]}),n&&(0,k.jsx)(b,{onReset:()=>r(``)}),(0,k.jsx)(d,{})]})]}),children:[B.length>0&&(0,k.jsxs)(y,{title:`Часть мод указывает на чужую шкалу`,children:[B.map((e,t)=>(0,k.jsxs)(`span`,{children:[t>0&&`, `,(0,k.jsx)(`strong`,{children:e.mode}),` разрешается в шкалу `,(0,k.jsx)(`strong`,{children:e.family})]},e.mode)),`. Так это устроено в Figma сегодня, и здесь воспроизведено буквально, а не тихо исправлено — почините в`,` `,(0,k.jsx)(_,{children:`Box UI | Components`}),` и пересоберите.`]}),i.length===0?(0,k.jsx)(h,{query:n,onClear:()=>r(``)}):(0,k.jsx)(m,{title:`Каждый токен × каждая мода`,description:`Строки — токены, столбцы — моды Figma. В ячейке то, во что мода разрешается: наведите, чтобы увидеть примитив, кликните, чтобы скопировать.`,children:(0,k.jsx)(`div`,{className:`sb-scroller`,children:(0,k.jsxs)(`table`,{className:`sb-table`,children:[(0,k.jsx)(`thead`,{children:(0,k.jsxs)(`tr`,{children:[(0,k.jsx)(`th`,{className:`sb-table__lead`,children:(0,k.jsx)(`span`,{className:`sb-label`,children:`Токен`})}),P.modes.map(e=>(0,k.jsx)(`th`,{children:(0,k.jsx)(`span`,{className:`sb-label`,children:e.name})},e.slug))]})}),(0,k.jsx)(`tbody`,{children:i.map(e=>(0,k.jsxs)(`tr`,{children:[(0,k.jsx)(`td`,{className:`sb-table__lead`,children:(0,k.jsx)(_,{copyable:`var(${e.cssVar})`,children:e.path})}),P.modes.map(t=>(0,k.jsx)(`td`,{children:(0,k.jsx)(E,{mode:t,value:e.values[t.slug]})},t.slug))]},e.cssVar))})]})})})]})}},H={name:`Семантика — светлая и тёмная`,args:{query:``,compare:!0},render:(e,{globals:t})=>{let[,n]=A(),{query:r,compare:i}=e,c=e=>n({query:e}),u=e=>n({compare:e}),_=(0,O.useMemo)(()=>T(r.trim().toLowerCase()?F.variables.filter(e=>x(r,e.path)):F.variables,2),[r]),y=_.reduce((e,[,t])=>e+t.length,0);return(0,k.jsx)(p,{title:`Семантические цвета`,lead:`${F.variables.length} токенов в коллекции «◑ System · Theme». Каждый разрешается через «Brand · Color», «System · Color» или «System · Status», поэтому они слушаются сразу нескольких переключателей на панели.`,toolbar:(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(g,{value:r,onChange:c,placeholder:`background, border, control…`}),(0,k.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:6,height:28,cursor:`pointer`},children:[(0,k.jsx)(`input`,{type:`checkbox`,checked:i,onChange:e=>u(e.target.checked)}),(0,k.jsx)(`span`,{className:`sb-caption`,children:`Светлая и тёмная рядом`})]}),(0,k.jsxs)(s,{children:[(0,k.jsx)(f,{children:a(y,[`токен`,`токена`,`токенов`])}),r&&(0,k.jsx)(b,{onReset:()=>c(``)}),(0,k.jsx)(d,{})]}),!r&&(0,k.jsx)(`div`,{style:{flexBasis:`100%`},children:(0,k.jsx)(l,{items:_.map(([e])=>({id:L(e),label:e}))})})]}),children:y===0?(0,k.jsx)(h,{query:r,onClear:()=>c(``)}):_.map(([e,n])=>(0,k.jsx)(m,{id:L(e),title:e,aside:(0,k.jsx)(f,{children:n.length}),children:(0,k.jsx)(v,{min:190,children:n.map(e=>i?(0,k.jsx)(D,{cssVar:e.cssVar,name:e.path.split(`/`).slice(2).join(`/`),globals:t},e.cssVar):(0,k.jsx)(o,{cssVar:e.cssVar,name:e.path.split(`/`).slice(2).join(`/`),live:!0},e.cssVar))})},e))})}},U={name:`Именованные шкалы — System · Color`,args:{query:``},render:e=>{let[,t]=A(),n=e.query,r=e=>t({query:e}),i=(0,O.useMemo)(()=>{let e=N.variables.map(e=>({...e,path:e.path.replace(/^color\//,``)}));return T(n.trim().toLowerCase()?e.filter(e=>x(n,e.path)):e,1)},[n]),c=i.reduce((e,[,t])=>e+t.length,0);return(0,k.jsx)(p,{title:`Именованные шкалы`,lead:`${N.variables.length} токенов в «◑ System · Color». Это слой между палитрой и темой: он даёт сырым шкалам роли — neutral, positive, warning, negative, informative — и ни в одной моде не меняется. Тема и статусы указывают уже сюда, а не в палитру напрямую.`,toolbar:(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(g,{value:n,onChange:r,placeholder:`neutral, positive, alpha…`}),(0,k.jsxs)(s,{children:[(0,k.jsx)(f,{children:a(c,[`токен`,`токена`,`токенов`])}),(0,k.jsx)(f,{children:a(i.length,[`роль`,`роли`,`ролей`])}),n&&(0,k.jsx)(b,{onReset:()=>r(``)}),(0,k.jsx)(d,{})]}),!n&&(0,k.jsx)(`div`,{style:{flexBasis:`100%`},children:(0,k.jsx)(l,{items:i.map(([e])=>({id:L(e),label:e}))})})]}),children:c===0?(0,k.jsx)(h,{query:n,onClear:()=>r(``)}):i.map(([e,t])=>(0,k.jsx)(m,{id:L(e),title:e,aside:(0,k.jsx)(f,{children:t.length}),children:(0,k.jsx)(v,{min:150,children:t.map(e=>(0,k.jsx)(o,{cssVar:e.cssVar,name:e.path.split(`/`).slice(1).join(` / `),meta:e.values.value?.alias?.split(`:`)[1]?.replace(/^color\//,``)??``,live:!0},e.cssVar))})},e))})}},W={name:`Статусы — System · Status`,render:()=>(0,k.jsx)(p,{title:`Статусы`,lead:`${I.variables.length} токенов × ${a(I.modes.length,[`мода`,`моды`,`мод`])}. Коллекция даёт один набор имён для всех четырёх тональностей: компонент пишет \u0060--box-status-*\u0060 один раз, а \u0060data-status\u0060 решает, станет это зелёным, жёлтым, красным или синим.`,toolbar:(0,k.jsxs)(s,{children:[(0,k.jsxs)(f,{children:[a(I.variables.length,[`токен`,`токена`,`токенов`]),` ×`,` `,a(I.modes.length,[`мода`,`моды`,`мод`])]}),(0,k.jsx)(d,{})]}),children:(0,k.jsx)(m,{title:`Каждый токен × каждая мода`,description:`Переключатель «Статус» на панели задаёт моду для всей страницы. Таблица показывает все четыре сразу.`,children:(0,k.jsx)(`div`,{className:`sb-scroller`,children:(0,k.jsxs)(`table`,{className:`sb-table`,children:[(0,k.jsx)(`thead`,{children:(0,k.jsxs)(`tr`,{children:[(0,k.jsx)(`th`,{className:`sb-table__lead`,children:(0,k.jsx)(`span`,{className:`sb-label`,children:`Токен`})}),I.modes.map(e=>(0,k.jsx)(`th`,{children:(0,k.jsx)(`span`,{className:`sb-label`,children:e.name})},e.slug))]})}),(0,k.jsx)(`tbody`,{children:I.variables.map(e=>(0,k.jsxs)(`tr`,{children:[(0,k.jsx)(`td`,{className:`sb-table__lead`,children:(0,k.jsx)(_,{copyable:`var(${e.cssVar})`,children:e.path})}),I.modes.map(t=>(0,k.jsx)(`td`,{children:(0,k.jsx)(E,{mode:t,value:e.values[t.slug]})},t.slug))]},e.cssVar))})]})})})})},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
    return <Page title="Цветовая палитра" lead={\`\${palette.variables.length} сырых цветовых переменных из коллекции «◉ Primitives · Color». Они не меняются ни в одной моде — всё остальное указывает на них. Прозрачные ступени Figma хранит как «эта шкала на N%», и в CSS они становятся \\u0060color-mix()\\u0060. Клик по образцу копирует CSS-переменную.\`} toolbar={<>
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
                {variables.map(v => <Swatch key={v.cssVar} cssVar={v.cssVar} name={v.path.split('/').slice(1).join(' / ')} meta={paletteMeta(v.values.value)} />)}
              </Grid>
            </Section>)}
      </Page>;
  }
}`,...R.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  name: 'Акцентные моды — Brand · Color',
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
    return <Page title="Акцентные цветовые моды" lead={\`В коллекции «☯︎ Brand · Color» \${accent.modes.length} мод. Переключите «Акцент» на панели — и каждый брендовый токен ниже начнёт указывать на другую примитивную шкалу, а семантические имена останутся прежними.\`} toolbar={<>
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
            <Code>Box UI | Components</Code> и пересоберите.
          </Callout>}

        {rows.length === 0 ? <Empty query={query} onClear={() => setQuery('')} /> : <Section title="Каждый токен × каждая мода" description="Строки — токены, столбцы — моды Figma. В ячейке то, во что мода разрешается: наведите, чтобы увидеть примитив, кликните, чтобы скопировать.">
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
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
    return <Page title="Семантические цвета" lead={\`\${mode.variables.length} токенов в коллекции «◑ System · Theme». Каждый разрешается через «Brand · Color», «System · Color» или «System · Status», поэтому они слушаются сразу нескольких переключателей на панели.\`} toolbar={<>
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  name: 'Именованные шкалы — System · Color',
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
      const stripped = ramps.variables.map(v => ({
        ...v,
        path: v.path.replace(/^color\\//, '')
      }));
      const q = query.trim().toLowerCase();
      return groupBy(q ? stripped.filter(v => matches(query, v.path)) : stripped, 1);
    }, [query]);
    const total = groups.reduce((sum, [, list]) => sum + list.length, 0);
    return <Page title="Именованные шкалы" lead={\`\${ramps.variables.length} токенов в «◑ System · Color». Это слой между палитрой и темой: он даёт сырым шкалам роли — neutral, positive, warning, negative, informative — и ни в одной моде не меняется. Тема и статусы указывают уже сюда, а не в палитру напрямую.\`} toolbar={<>
            <Search value={query} onChange={setQuery} placeholder="neutral, positive, alpha…" />
            <Counts>
              <Count>{counted(total, ['токен', 'токена', 'токенов'])}</Count>
              <Count>{counted(groups.length, ['роль', 'роли', 'ролей'])}</Count>
              {query && <ResetFilters onReset={() => setQuery('')} />}
              <ShareLink />
            </Counts>
            {!query && <div style={{
        flexBasis: '100%'
      }}>
                <JumpNav items={groups.map(([role]) => ({
          id: anchor(role),
          label: role
        }))} />
              </div>}
          </>}>
        {total === 0 ? <Empty query={query} onClear={() => setQuery('')} /> : groups.map(([role, variables]) => <Section key={role} id={anchor(role)} title={role} aside={<Count>{variables.length}</Count>}>
              <Grid min={150}>
                {variables.map(v => <Swatch key={v.cssVar} cssVar={v.cssVar} name={v.path.split('/').slice(1).join(' / ')} meta={v.values.value?.alias?.split(':')[1]?.replace(/^color\\//, '') ?? ''} live />)}
              </Grid>
            </Section>)}
      </Page>;
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  name: 'Статусы — System · Status',
  render: () => <Page title="Статусы" lead={\`\${status.variables.length} токенов × \${counted(status.modes.length, ['мода', 'моды', 'мод'])}. Коллекция даёт один набор имён для всех четырёх тональностей: компонент пишет \\u0060--box-status-*\\u0060 один раз, а \\u0060data-status\\u0060 решает, станет это зелёным, жёлтым, красным или синим.\`} toolbar={<Counts>
          <Count>
            {counted(status.variables.length, ['токен', 'токена', 'токенов'])} ×{' '}
            {counted(status.modes.length, ['мода', 'моды', 'мод'])}
          </Count>
          <ShareLink />
        </Counts>}>
      <Section title="Каждый токен × каждая мода" description="Переключатель «Статус» на панели задаёт моду для всей страницы. Таблица показывает все четыре сразу.">
        <div className="sb-scroller">
          <table className="sb-table">
            <thead>
              <tr>
                <th className="sb-table__lead">
                  <span className="sb-label">Токен</span>
                </th>
                {status.modes.map(m => <th key={m.slug}>
                    <span className="sb-label">{m.name}</span>
                  </th>)}
              </tr>
            </thead>
            <tbody>
              {status.variables.map(v => <tr key={v.cssVar}>
                  <td className="sb-table__lead">
                    <Code copyable={\`var(\${v.cssVar})\`}>{v.path}</Code>
                  </td>
                  {status.modes.map(m => <td key={m.slug}>
                      <AccentCell mode={m} value={v.values[m.slug]} />
                    </td>)}
                </tr>)}
            </tbody>
          </table>
        </div>
      </Section>
    </Page>
}`,...W.parameters?.docs?.source}}},G=[`Palette`,`Accents`,`Semantic`,`Ramps`,`Statuses`]})))()}K();export{V as Accents,R as Palette,U as Ramps,H as Semantic,W as Statuses,G as __namedExportsOrder,j as default};