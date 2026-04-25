// projects.jsx — projects index + detail

function ProjectsPage({ onNav }) {
  return (
    <Page folio="fol. 005 — projects" >
      <div className="ink-in">
        <div className="t-cap">In the workshop</div>
        <h1 className="t-display ink-in d1" style={{ marginTop: 12 }}><em>Projects</em></h1>
        <p className="lede ink-in d2" style={{ maxWidth: 640, marginTop: 14 }}>
          Things I have made — software, hardware, prints, and a few of each.
          Listed in order of recency, with the build notes where I have them.
        </p>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 0 }} />

      <div className="ink-in d3">
        {PROJECTS.map(p => (
          <div key={p.slug} className="proj-card" onClick={() => onNav('project/' + p.slug)}>
            <div className="num">№ {p.num}</div>
            <div>
              <div className="title">{p.title}</div>
              <div className="desc">{p.desc}</div>
              <div className="meta">
                {p.meta.map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
            <div className="preview">
              <div style={{ background: 'var(--paper-2)', border: '.5px solid var(--rule-2)', padding: 16 }}>
                <PlatePlaceholder tone={(parseInt(p.num,10) % 5) + 1} ratio={1.4} label={p.slug} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

function ProjectDetail({ slug, onNav }) {
  const p = PROJECTS.find(x => x.slug === slug);
  if (!p) {
    return (
      <Page folio="fol. — not found">
        <h1 className="t-display"><em>Lost in the index.</em></h1>
        <p className="t-lede">No project by that slug. <a className="serif-link" onClick={() => onNav('projects')}>back to projects →</a></p>
      </Page>
    );
  }
  return (
    <Page folio={`fol. — proj. ${p.num}`}>
      <div className="ink-in">
        <a className="t-cap" onClick={() => onNav('projects')} style={{ cursor: 'pointer' }}>← back to projects</a>
        <div className="t-cap" style={{ marginTop: 18 }}>Project № {p.num}</div>
        <h1 className="t-display ink-in d1" style={{ marginTop: 6 }}><em>{p.italic}</em></h1>
        <p className="t-lede ink-in d2" style={{ marginTop: 14, maxWidth: 720 }}>{p.desc}</p>
        <div className="mono muted-2 ink-in d3" style={{ marginTop: 18, fontSize: 11, letterSpacing: '.05em', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {p.meta.map(m => <span key={m}>{m}</span>)}
        </div>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 40 }} />

      <div className="ink-in d3" style={{ background: 'var(--paper-2)', border: '.5px solid var(--rule-2)', padding: 28 }}>
        <PlatePlaceholder tone={(parseInt(p.num,10) % 5) + 1} ratio={2.2} label={p.slug + ' · hero'} />
      </div>

      <div style={{ height: 56 }} />

      <GlossRow gloss="A note on the build" right={<>{p.meta[0]}<br/>{p.meta[2]}</>}>
        <div className="article" style={{ maxWidth: 'unset' }}>
          <p style={{ fontFamily: 'Newsreader, serif', fontSize: 18, lineHeight: 1.65 }}>
            This is where the proper build log will live: a sequence of small
            failures, a few good corners turned, and a part list at the
            bottom. For now, the short version is that this took longer than
            I expected and taught me more than I deserved.
          </p>
          <p style={{ fontFamily: 'Newsreader, serif', fontSize: 18, lineHeight: 1.65 }}>
            If you would like the source — software or hardware — write to{' '}
            <a className="serif-link" href="mailto:hi@guillego.com">hi@guillego.com</a>{' '}
            and I will send what I have.
          </p>
        </div>
      </GlossRow>
    </Page>
  );
}

Object.assign(window, { ProjectsPage, ProjectDetail });
