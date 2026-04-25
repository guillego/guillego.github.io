// photography.jsx — contact sheet

const { useState: useStatePh } = React;

function PhotographyPage({ onNav }) {
  const [active, setActive] = useStatePh(null);

  return (
    <Page folio="fol. 004 — photography" wide>
      <div className="ink-in">
        <div className="t-cap">A working contact sheet</div>
        <h1 className="t-display ink-in d1" style={{ marginTop: 12 }}><em>Photography</em></h1>
        <p className="lede ink-in d2" style={{ maxWidth: 640, marginTop: 14 }}>
          Mostly medium format and a small digital camera I keep in my bag.
          Plates are listed newest first; click any to see it large.
        </p>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 0 }} />

      <div className="plates ink-in d3">
        {PHOTOS.map((p, i) => (
          <div key={p.id} className="plate"
            style={{ gridColumn: `span ${p.span}` }}
            onClick={() => setActive(p)}>
            <div className="frame">
              <PlatePlaceholder tone={p.tone} ratio={p.ratio} label={p.id} />
              <span className="corner-tl" /><span className="corner-tr" /><span className="corner-bl" /><span className="corner-br" />
            </div>
            <div className="caption">
              <span className="num">pl. {String(i+1).padStart(2,'0')}</span>
              <span className="date">{p.date}</span>
            </div>
            <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 13.5, color: 'var(--ink-2)', marginTop: 2 }}>
              {p.label}
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <div className="lightbox-frame" style={{ width: '70vw', maxHeight: '70vh', aspectRatio: active.ratio, position: 'relative' }}>
            <PlatePlaceholder tone={active.tone} ratio={active.ratio} label={active.id + ' (large)'} />
            <span style={{ position: 'absolute', top: -1, left: -1, width: 14, height: 14, border: '.5px solid var(--ink-3)', borderRight: 0, borderBottom: 0 }} />
            <span style={{ position: 'absolute', top: -1, right: -1, width: 14, height: 14, border: '.5px solid var(--ink-3)', borderLeft: 0, borderBottom: 0 }} />
            <span style={{ position: 'absolute', bottom: -1, left: -1, width: 14, height: 14, border: '.5px solid var(--ink-3)', borderRight: 0, borderTop: 0 }} />
            <span style={{ position: 'absolute', bottom: -1, right: -1, width: 14, height: 14, border: '.5px solid var(--ink-3)', borderLeft: 0, borderTop: 0 }} />
            <div className="caption-row">
              <span><em style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', color: 'var(--ink-2)', fontSize: 14 }}>{active.label}</em></span>
              <span>{active.date} · click anywhere to close</span>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}

Object.assign(window, { PhotographyPage });
