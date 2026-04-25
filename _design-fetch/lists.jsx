// lists.jsx — Thoughts and Posts pages (year-grouped timeline)

function ThoughtsPage({ onNav, filterTag }) {
  const items = filterTag ? THOUGHTS.filter(t => t.tags.includes(filterTag)) : THOUGHTS;
  const grouped = groupByYear(items);
  const years = Object.keys(grouped).sort().reverse();

  return (
    <Page folio="fol. 002 — thoughts" >
      <div className="ink-in">
        <div className="t-cap">A microblog · short form</div>
        <h1 className="t-display ink-in d1" style={{ marginTop: 12 }}>
          <em>Thoughts</em>{filterTag && <span className="muted-2" style={{ fontSize: '.5em' }}> · #{filterTag}</span>}
        </h1>
        <p className="lede ink-in d2" style={{ maxWidth: 640, marginTop: 14 }}>
          Notes too small to be a post, too lasting to be a tweet. Posted once
          here and syndicated to other places. {filterTag && <a className="serif-link" onClick={() => onNav('thoughts')}>show all →</a>}
        </p>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 24 }} />

      <div className="ink-in d3">
        {years.map(y => (
          <div className="year-section" key={y}>
            <div className="year-head">
              <span className="y">{y}</span>
              <span className="t-meta muted-2">— {grouped[y].length} entries</span>
            </div>
            {grouped[y].map((t, i) => (
              <div className="entry" key={i}>
                <span className="date">{t.date}</span>
                <span className="mark"><Mark kind="thought" /></span>
                <span className="title" dangerouslySetInnerHTML={{ __html: t.text }} />
                <span className="tags">
                  {t.tags.map(tag => (
                    <a key={tag} onClick={(e) => { e.stopPropagation(); onNav('tag/' + tag); }}>#{tag}</a>
                  ))}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Page>
  );
}

function PostsPage({ onNav, filterTag }) {
  const items = filterTag ? POSTS.filter(p => p.tags.includes(filterTag)) : POSTS;
  const grouped = groupByYear(items);
  const years = Object.keys(grouped).sort().reverse();

  return (
    <Page folio="fol. 003 — blog" >
      <div className="ink-in">
        <div className="t-cap">Long form · essays & reports</div>
        <h1 className="t-display ink-in d1" style={{ marginTop: 12 }}>
          <em>Posts</em>{filterTag && <span className="muted-2" style={{ fontSize: '.5em' }}> · #{filterTag}</span>}
        </h1>
        <p className="lede ink-in d2" style={{ maxWidth: 640, marginTop: 14 }}>
          Pieces I wrote because I wanted to think them through. Most run to a
          few thousand words. {filterTag && <a className="serif-link" onClick={() => onNav('posts')}>show all →</a>}
        </p>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 24 }} />

      <div className="ink-in d3">
        {years.map(y => (
          <div className="year-section" key={y}>
            <div className="year-head">
              <span className="y">{y}</span>
              <span className="t-meta muted-2">— {grouped[y].length} posts</span>
            </div>
            {grouped[y].map((p, i) => (
              <div className="entry" key={i} onClick={() => onNav('post/' + p.slug)}>
                <span className="date">{p.date}</span>
                <span className="mark"><Mark kind="post" /></span>
                <span className="title">
                  {p.title}
                  <div className="muted" style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 14.5, lineHeight: 1.45, marginTop: 4, fontWeight: 400 }}>
                    {p.desc}
                  </div>
                  <div className="mono muted-2" style={{ fontSize: 10.5, marginTop: 6, letterSpacing: '.04em' }}>
                    {p.readTime} min · {p.words.toLocaleString()} words · {p.tags.map(t => '#' + t).join(' · ')}
                  </div>
                </span>
                <span className="arrow">→</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Page>
  );
}

function groupByYear(items) {
  const grouped = {};
  for (const e of items) {
    const y = e.date.slice(0, 4);
    (grouped[y] = grouped[y] || []).push(e);
  }
  return grouped;
}

Object.assign(window, { ThoughtsPage, PostsPage, groupByYear });
