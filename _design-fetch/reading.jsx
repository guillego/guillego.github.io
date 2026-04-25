// reading.jsx — bookshelf

function ReadingPage({ onNav }) {
  const grouped = { reading: [], finished: [], shelved: [] };
  for (const b of READING) (grouped[b.status] || (grouped[b.status] = [])).push(b);

  return (
    <Page folio="fol. 010 — library" >
      <div className="ink-in">
        <div className="t-cap">A small library</div>
        <h1 className="t-display ink-in d1" style={{ marginTop: 12 }}><em>Reading</em></h1>
        <p className="lede ink-in d2" style={{ maxWidth: 640, marginTop: 14 }}>
          What's on the desk, what's been finished, what's been put back on the
          shelf for later. Updated whenever a book moves between piles.
        </p>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 32 }} />

      {[
        ['Currently reading', 'reading'],
        ['Recently finished', 'finished'],
        ['On the shelf, for later', 'shelved'],
      ].map(([title, key]) => (
        <section key={key} className="ink-in" style={{ marginBottom: 48 }}>
          <div className="section-head">
            <div className="title">{title}</div>
            <span className="more">{(grouped[key] || []).length} books</span>
          </div>
          <HandRule />
          <div className="shelf">
            {(grouped[key] || []).map(b => (
              <div key={b.title} className="book">
                <div className="spine"><div className="initials">{b.initials}</div></div>
                <div className="info">
                  <div className="title">{b.title}</div>
                  <div className="author muted">{b.author}</div>
                  <div className="meta">{b.status.toUpperCase()} · {b.date}</div>
                  {b.note && <div className="muted" style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 13.5, marginTop: 6, lineHeight: 1.4 }}>{b.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </Page>
  );
}

Object.assign(window, { ReadingPage });
