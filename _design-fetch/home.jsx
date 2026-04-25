// home.jsx — home variants

const { useEffect: useEffH, useState: useStateH } = React;

function Home({ variant, onNav }) {
  if (variant === 'index') return <HomeIndex onNav={onNav} />;
  if (variant === 'desk')  return <HomeDesk onNav={onNav} />;
  return <HomeHybrid onNav={onNav} />;
}

function currentNowLine() { return { date: '2026.04.25', place: 'Zürich' }; }

/* ============================================================
   DEFAULT — Hybrid: Index up top (writing only), Desk below (everything else)
   ============================================================ */
function HomeHybrid({ onNav }) {
  const writing = [
    ...THOUGHTS.map(t => ({ kind: 'thought', date: t.date, text: t.text, target: 'thoughts', tags: t.tags })),
    ...POSTS.map(p => ({ kind: 'post', date: p.date, text: p.title, target: 'post/' + p.slug, tags: p.tags })),
    ...NEWSLETTERS.map(n => ({ kind: 'newsletter', date: n.date, text: n.title, target: 'newsletter', tags: ['letter'] })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const grouped = {};
  for (const e of writing) {
    const y = e.date.slice(0, 4);
    (grouped[y] = grouped[y] || []).push(e);
  }
  const years = Object.keys(grouped).sort().reverse();

  return (
    <Page folio="fol. 001">
      {/* hero — short */}
      <div className="home-hero">
        <div>
          <div className="t-cap ink-in">A field notebook · since 2018</div>
          <h1 className="ink-in d1">
            <em>Guillermo Galan</em>
          </h1>
          <p className="lede ink-in d2" style={{ marginTop: 14 }}>
            Writes, makes, photographs and keeps notes. Posted once here and
            syndicated to <a className="serif-link" href="#">Mastodon</a>,{' '}
            <a className="serif-link" href="#">Bluesky</a>, and an{' '}
            <a className="serif-link" onClick={() => onNav('newsletter')}>occasional letter</a>.
          </p>
        </div>
        <div className="meta-col ink-in d3">
          <div className="now-card">
            <div className="label">Now · {currentNowLine().date}</div>
            <div>Zürich · 47.37° N · 8.54° E</div>
            <div><em>looking north-west</em></div>
            <div style={{ marginTop: 6, color: 'var(--ink-3)' }}>
              {NEWSLETTERS.length} letters · {POSTS.length} posts · {PHOTOS.length} plates · {PROJECTS.length} projects
            </div>
            <div style={{ marginTop: 10, paddingTop: 8, borderTop: '.5px dotted var(--rule-2)' }}>
              <a className="link mono" onClick={() => onNav('now')} style={{ fontSize: 10.5, letterSpacing: '.06em' }}>read the now page →</a>
            </div>
          </div>
        </div>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 24 }} />

      {/* THE INDEX — main thing. Year-grouped, dense. */}
      <div className="ink-in d2">
        <div className="section-head" style={{ borderBottom: 0, paddingBottom: 0, marginBottom: 0 }}>
          <div className="title">An index, most recent first</div>
          <span className="more">{writing.length} entries · writing only</span>
        </div>
        {years.slice(0, 3).map(y => (
          <div className="year-section" key={y} style={{ marginTop: 36 }}>
            <div className="year-head">
              <span className="y">{y}</span>
              <span className="t-meta muted-2">— {grouped[y].length} entries</span>
            </div>
            {grouped[y].map((e, i) => (
              <div className="entry" key={i} onClick={() => onNav(e.target)}>
                <span className="date">{e.date}</span>
                <span className="mark"><Mark kind={e.kind} /></span>
                <span className="title" dangerouslySetInnerHTML={{ __html: e.text }} />
                <span className="arrow">→</span>
              </div>
            ))}
          </div>
        ))}
        {years.length > 3 && (
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <a className="serif-link" onClick={() => onNav('archive')}>see the full archive →</a>
          </div>
        )}
      </div>

      <Sep glyph="✻" />

      {/* BELOW THE INDEX — desk-style */}
      <section className="ink-in" style={{ marginTop: 56 }}>
        <div className="t-cap" style={{ marginBottom: 6 }}>Below the index</div>
        <h2 className="serif italic" style={{ fontSize: 30, fontWeight: 400, margin: 0 }}>
          The rest of the desk
        </h2>
        <HandRule />
      </section>

      {/* projects strip */}
      <section className="ink-in" style={{ marginTop: 40 }}>
        <div className="section-head">
          <div className="title">In the workshop</div>
          <a className="more" onClick={() => onNav('projects')}>all projects →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 22 }}>
          {PROJECTS.slice(0, 3).map(p => (
            <div key={p.slug} onClick={() => onNav('project/' + p.slug)}
              style={{ cursor: 'pointer', borderTop: '.5px solid var(--rule)', paddingTop: 14 }}>
              <div className="t-cap">№ {p.num} · {p.meta[0]}</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 22, lineHeight: 1.2, margin: '8px 0 6px' }}>
                <em>{p.italic}</em>
              </div>
              <div className="t-meta italic muted" style={{ lineHeight: 1.45 }}>{p.desc.slice(0, 110)}…</div>
            </div>
          ))}
        </div>
      </section>

      {/* photos + reading two-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, marginTop: 56 }}>
        <section className="ink-in">
          <div className="section-head">
            <div className="title">Lately, photographs</div>
            <a className="more" onClick={() => onNav('photography')}>contact sheet →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 22 }}>
            {PHOTOS.slice(0, 4).map((p, i) => (
              <div key={p.id} className="plate" onClick={() => onNav('photography')}>
                <div className="frame">
                  <PlatePlaceholder tone={p.tone} ratio={p.ratio} label={p.id} />
                  <span className="corner-tl" /><span className="corner-tr" /><span className="corner-bl" /><span className="corner-br" />
                </div>
                <div className="caption">
                  <span className="num">pl. {String(i+1).padStart(2,'0')}</span>
                  <span className="date">{p.date}</span>
                </div>
                <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-2)', marginTop: 2 }}>
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ink-in">
          <div className="section-head">
            <div className="title">On the shelf</div>
            <a className="more" onClick={() => onNav('reading')}>full shelf →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 22 }}>
            {READING.slice(0, 4).map(b => (
              <div key={b.title} className="book" onClick={() => onNav('reading')}>
                <div className="spine"><div className="initials">{b.initials}</div></div>
                <div className="info">
                  <div className="title">{b.title}</div>
                  <div className="author muted">{b.author}</div>
                  <div className="meta">{b.status.toUpperCase()} · {b.date}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Sep glyph="❦" />

      {/* opening note */}
      <GlossRow
        gloss="A note from the keeper"
        right={<>colophon · last tended<br/>{currentNowLine().date}</>}>
        <div style={{ fontFamily: 'Newsreader, serif', fontSize: 19, lineHeight: 1.6 }} className="drop-cap">
          This site is a slow correspondence. There is no algorithmic feed,
          no comment system, no analytics — only the index above, an{' '}
          <a className="serif-link" onClick={() => onNav('newsletter')}>occasional letter</a> and an{' '}
          <a className="serif-link" href="/feed.xml">RSS feed</a>. If something
          here is useful or moving, please write —{' '}
          <a className="serif-link" href="mailto:hi@guillego.com">hi@guillego.com</a>.
        </div>
      </GlossRow>
    </Page>
  );
}

/* ============================================================
   Variant: pure Index (writing + projects + letters all merged, dense)
   ============================================================ */
function HomeIndex({ onNav }) {
  const all = [
    ...THOUGHTS.map(t => ({ kind: 'thought', date: t.date, text: t.text, target: 'thoughts', tags: t.tags })),
    ...POSTS.map(p => ({ kind: 'post', date: p.date, text: p.title, target: 'post/' + p.slug, tags: p.tags })),
    ...PROJECTS.map((p, i) => ({ kind: 'project', date: '2025.' + String(12 - i).padStart(2,'0') + '.01', text: p.title, target: 'project/' + p.slug, tags: ['project'] })),
    ...NEWSLETTERS.map(n => ({ kind: 'newsletter', date: n.date, text: n.title, target: 'newsletter', tags: ['newsletter'] })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const grouped = {};
  for (const e of all) {
    const y = e.date.slice(0, 4);
    (grouped[y] = grouped[y] || []).push(e);
  }
  const years = Object.keys(grouped).sort().reverse();

  return (
    <Page folio="fol. 001 — index">
      <div className="home-hero">
        <div>
          <div className="t-cap ink-in">An index, most recent first</div>
          <h1 className="ink-in d1"><em>Guillermo Galan</em></h1>
          <p className="lede ink-in d2" style={{ marginTop: 14 }}>
            Writes, makes, photographs and keeps notes. Browse by{' '}
            <a className="serif-link" onClick={() => onNav('tags')}>tag</a> or read the{' '}
            <a className="serif-link" onClick={() => onNav('about')}>about page</a>.
          </p>
        </div>
        <div className="meta-col ink-in d3">
          <div className="now-card">
            <div className="label">Now</div>
            <div>Zürich · 47.37° N</div>
            <div><em>looking north-west</em></div>
            <div style={{ marginTop: 6 }}>{NEWSLETTERS.length} letters · {POSTS.length} posts · {PHOTOS.length} plates</div>
          </div>
        </div>
      </div>

      <hr className="rule" style={{ marginTop: 48, marginBottom: 32 }} />

      <div className="ink-in d3">
        {years.map(y => (
          <div className="year-section" key={y}>
            <div className="year-head">
              <span className="y">{y}</span>
              <span className="t-meta muted-2">— {grouped[y].length} entries</span>
            </div>
            {grouped[y].map((e, i) => (
              <div className="entry" key={i} onClick={() => onNav(e.target)}>
                <span className="date">{e.date}</span>
                <span className="mark"><Mark kind={e.kind} /></span>
                <span className="title" dangerouslySetInnerHTML={{ __html: e.text }} />
                <span className="arrow">→</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Page>
  );
}

/* ============================================================
   Variant: Desk — tableau (kept from before, name fixed)
   ============================================================ */
function HomeDesk({ onNav }) {
  return (
    <Page folio="fol. 001 — desk" wide>
      <div className="ink-in" style={{ marginTop: 8 }}>
        <div className="t-cap">A writing desk · {currentNowLine().date}</div>
        <h1 className="ink-in d1" style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1.04, letterSpacing: '-.012em', margin: '14px 0 0' }}>
          <em>Guillermo Galan</em>
        </h1>
        <p className="lede ink-in d2" style={{ marginTop: 14 }}>
          A small desk, kept tidy enough. What I'm working on, reading, and
          posting — laid out at a glance.
        </p>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 32 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56 }}>
        <div className="ink-in d2">
          <div className="section-head"><div className="title">On the page</div><a className="more" onClick={() => onNav('posts')}>archive →</a></div>
          <HandRule />
          <div style={{ marginTop: 12 }}>
            {POSTS.slice(0, 3).map(p => (
              <div key={p.slug} className="mini-row" onClick={() => onNav('post/' + p.slug)}>
                <div className="date">{p.date}</div>
                <div className="text">
                  {p.title}
                  <div className="muted-2 mono" style={{ fontSize: 10.5, marginTop: 2, letterSpacing: '.04em' }}>
                    {p.readTime} min · {p.tags.join(' · ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }} />

          <div className="section-head"><div className="title">In the workshop</div><a className="more" onClick={() => onNav('projects')}>all →</a></div>
          <HandRule />
          <div style={{ marginTop: 12 }}>
            {PROJECTS.slice(0, 3).map(p => (
              <div key={p.slug} className="mini-row" onClick={() => onNav('project/' + p.slug)}>
                <div className="date mono">№ {p.num}</div>
                <div className="text"><em style={{ fontFamily: 'Newsreader, serif' }}>{p.italic}</em>
                  <div className="muted-2 mono" style={{ fontSize: 10.5, marginTop: 2, letterSpacing: '.04em' }}>{p.meta.join(' · ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ink-in d3">
          <div className="section-head"><div className="title">In the margin</div><a className="more" onClick={() => onNav('thoughts')}>all →</a></div>
          <HandRule />
          <div style={{ marginTop: 12 }}>
            {THOUGHTS.slice(0, 4).map((t, i) => (
              <div key={i} className="mini-row" onClick={() => onNav('thoughts')}>
                <div className="date">{t.date}</div>
                <div className="text" dangerouslySetInnerHTML={{ __html: t.text }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }} />

          <div className="section-head"><div className="title">On the shelf</div><a className="more" onClick={() => onNav('reading')}>all →</a></div>
          <HandRule />
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {READING.slice(0, 4).map(b => (
              <div key={b.title} className="book" onClick={() => onNav('reading')}>
                <div className="spine"><div className="initials">{b.initials}</div></div>
                <div className="info">
                  <div className="title">{b.title}</div>
                  <div className="author muted">{b.author}</div>
                  <div className="meta">{b.status.toUpperCase()} · {b.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

Object.assign(window, { Home, currentNowLine });
