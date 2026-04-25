// newsletter.jsx, now.jsx, about.jsx, tags.jsx, post.jsx — combined remaining pages

function NewsletterPage({ onNav }) {
  const grouped = groupByYear(NEWSLETTERS);
  const years = Object.keys(grouped).sort().reverse();
  return (
    <Page folio="fol. 006 — letters" narrow>
      <div className="ink-in">
        <div className="t-cap">An occasional letter</div>
        <h1 className="t-display ink-in d1" style={{ marginTop: 12 }}><em>Newsletter</em></h1>
        <p className="lede ink-in d2" style={{ marginTop: 14 }}>
          Eight or nine times a year I send a short letter — what I'm working
          on, photographs that didn't make the site, books that did. No tracking,
          no bait. Unsubscribe with a single click.
        </p>
        <div className="ink-in d3" style={{ marginTop: 22, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="email" placeholder="your email" style={{
            background: 'var(--paper-2)', border: '.5px solid var(--rule)',
            padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
            color: 'var(--ink)', minWidth: 280,
          }} />
          <button style={{
            background: 'var(--ink)', color: 'var(--paper)',
            border: '.5px solid var(--ink)', padding: '10px 16px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer',
          }}>subscribe →</button>
          <span className="mono muted-2" style={{ fontSize: 10.5 }}>or via <a className="link" href="/feed.xml">RSS</a></span>
        </div>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 24 }} />

      <div className="ink-in d3">
        <div className="t-cap" style={{ marginBottom: 12 }}>Past issues</div>
        {years.map(y => (
          <div className="year-section" key={y} style={{ marginTop: 28 }}>
            <div className="year-head">
              <span className="y">{y}</span>
              <span className="t-meta muted-2">— {grouped[y].length} letters</span>
            </div>
            {grouped[y].map((n, i) => (
              <div className="entry" key={i}>
                <span className="date">{n.date}</span>
                <span className="mark"><Mark kind="newsletter" /></span>
                <span className="title">{n.title}</span>
                <span className="arrow">→</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Page>
  );
}

function NowPage({ onNav }) {
  return (
    <Page folio="fol. 007 — now" narrow>
      <div className="ink-in">
        <div className="t-cap">A now page · what I'm doing now</div>
        <h1 className="t-display ink-in d1" style={{ marginTop: 12 }}><em>Now</em></h1>
        <p className="lede ink-in d2" style={{ marginTop: 14 }}>
          Last tended {currentNowLine().date}. The honest answer to "so, what
          are you up to?" — kept short, updated often.
        </p>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 32 }} />

      <GlossRow gloss="In Zürich, looking at fog" right={<>47.37° N · 8.54° E<br/>4° C · overcast</>}>
        <div className="article" style={{ maxWidth: 'unset' }}>
          <p className="drop-cap" style={{ fontFamily: 'Newsreader, serif', fontSize: 19, lineHeight: 1.65 }}>
            I'm in Zürich, finishing a long-running project at work and trying
            to finish a short-running one at home (a numeric keypad in walnut).
            The mornings are still cold enough that my film camera complains
            on the first exposure of the day.
          </p>
          <h2>Working on</h2>
          <p>
            A small Ruby pipeline that lets this site post once and syndicate
            everywhere — Mastodon, Bluesky, the newsletter, RSS. The current
            target is to publish a thought from my phone in under twenty seconds,
            which I'm very close to.
          </p>
          <h2>Reading</h2>
          <p>
            <em>A Pattern Language</em>, slowly, one pattern an evening. <em>The
            Order of Time</em> alongside it, which makes for confusing dreams.
          </p>
          <h2>Photographing</h2>
          <p>
            Fog. The lake. A goldcrest in the fir outside the window when it
            holds still long enough.
          </p>
          <h2>Not doing</h2>
          <p>
            Anything new, on purpose. The list of things I am not learning right
            now is longer than the list of things I am, and I find it
            steadying.
          </p>
        </div>
      </GlossRow>
    </Page>
  );
}

function AboutPage({ onNav }) {
  return (
    <Page folio="fol. 008 — about" narrow>
      <div className="ink-in">
        <div className="t-cap">A short about</div>
        <h1 className="t-display ink-in d1" style={{ marginTop: 12 }}>
          <em>Hi, I'm Guillermo.</em>
        </h1>
        <p className="lede ink-in d2" style={{ marginTop: 14 }}>
          I write software for a living and a few other things for myself.
          Known as <span className="mono" style={{ fontSize: 14 }}>guillego</span> in most places online.
        </p>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 32 }} />

      <GlossRow gloss="The short version" right={<>elsewhere<br/>↓</>}>
        <div className="article" style={{ maxWidth: 'unset' }}>
          <p className="drop-cap" style={{ fontFamily: 'Newsreader, serif', fontSize: 19, lineHeight: 1.65 }}>
            I grew up in southern Spain, studied in Madrid, and have been
            living in Switzerland for several years. I work as a software
            engineer; on the side I make things with wood and electronics,
            shoot film, and run a small newsletter.
          </p>
          <p style={{ fontFamily: 'Newsreader, serif', fontSize: 18, lineHeight: 1.65 }}>
            This site is a slow correspondence. There is no analytics, no
            comment system, and the front page is the index. If something here
            is useful or moving, please write — the address is{' '}
            <a className="serif-link" href="mailto:hi@guillego.com">hi@guillego.com</a>.
            I read everything; I reply to most.
          </p>
          <h2>Elsewhere</h2>
          <ul style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, listStyle: 'none', padding: 0, lineHeight: 2 }}>
            <li>email · <a className="link" href="mailto:hi@guillego.com">hi@guillego.com</a></li>
            <li>mastodon · <a className="link" href="#">@guillego@mastodon.social</a></li>
            <li>bluesky · <a className="link" href="#">@guillego.com</a></li>
            <li>github · <a className="link" href="#">@guillego</a></li>
            <li>rss · <a className="link" href="/feed.xml">/feed.xml</a></li>
          </ul>
        </div>
      </GlossRow>
    </Page>
  );
}

function TagsPage({ onNav, filterTag }) {
  if (filterTag) {
    // show entries with that tag from thoughts + posts
    const ts = THOUGHTS.filter(t => t.tags.includes(filterTag)).map(t => ({ kind: 'thought', date: t.date, text: t.text, target: 'thoughts' }));
    const ps = POSTS.filter(p => p.tags.includes(filterTag)).map(p => ({ kind: 'post', date: p.date, text: p.title, target: 'post/' + p.slug }));
    const all = [...ts, ...ps].sort((a,b) => b.date.localeCompare(a.date));
    return (
      <Page folio={`fol. — #${filterTag}`}>
        <div className="ink-in">
          <a className="t-cap" onClick={() => onNav('tags')} style={{ cursor: 'pointer' }}>← all tags</a>
          <h1 className="t-display ink-in d1" style={{ marginTop: 14 }}>
            <em>#{filterTag}</em>
            <span className="muted-2" style={{ fontSize: '.4em', marginLeft: 14 }}>{all.length} entries</span>
          </h1>
        </div>
        <hr className="rule" style={{ marginTop: 36, marginBottom: 16 }} />
        <div className="ink-in d2">
          {all.map((e, i) => (
            <div key={i} className="entry" onClick={() => onNav(e.target)}>
              <span className="date">{e.date}</span>
              <span className="mark"><Mark kind={e.kind} /></span>
              <span className="title" dangerouslySetInnerHTML={{ __html: e.text }} />
              <span className="arrow">→</span>
            </div>
          ))}
        </div>
      </Page>
    );
  }
  const sorted = [...TAGS_DATA].sort((a, b) => b.n - a.n);
  return (
    <Page folio="fol. 009 — tags" narrow>
      <div className="ink-in">
        <div className="t-cap">An index of tags</div>
        <h1 className="t-display ink-in d1" style={{ marginTop: 12 }}><em>Tags</em></h1>
        <p className="lede ink-in d2" style={{ marginTop: 14 }}>
          Browse the notebook by subject. Sized roughly by how often I've come
          back to each.
        </p>
      </div>

      <hr className="rule" style={{ marginTop: 40, marginBottom: 8 }} />

      <div className="tag-cloud ink-in d3">
        {sorted.map(t => (
          <span key={t.tag} className="tag" onClick={() => onNav('tag/' + t.tag)}
            style={{ fontSize: 12 + Math.min(10, t.n / 2.5) }}>
            #{t.tag}<span className="n">{t.n}</span>
          </span>
        ))}
      </div>
    </Page>
  );
}

function PostPage({ slug, onNav }) {
  const p = POSTS.find(x => x.slug === slug);
  if (!p) return (
    <Page folio="fol. — not found">
      <h1 className="t-display"><em>Lost in the archive.</em></h1>
      <p className="t-lede">No post by that slug. <a className="serif-link" onClick={() => onNav('posts')}>back to posts →</a></p>
    </Page>
  );
  return (
    <Page folio={`fol. — post`} narrow>
      <article className="ink-in">
        <a className="t-cap" onClick={() => onNav('posts')} style={{ cursor: 'pointer' }}>← back to posts</a>
        <h1 className="ink-in d1" style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-.012em', margin: '14px 0 6px' }}>
          {p.title}
        </h1>
        <div className="lede ink-in d2" style={{ marginBottom: 18 }}>{p.desc}</div>
        <div className="byline ink-in d3">
          <span>{p.date}</span>
          <span>·</span>
          <span>{p.readTime} min · {p.words.toLocaleString()} words</span>
          <span>·</span>
          <span>{p.tags.map(t => (
            <a key={t} className="link" onClick={() => onNav('tag/' + t)} style={{ marginRight: 6 }}>#{t}</a>
          ))}</span>
        </div>

        <div className="ink-in d3 drop-cap" style={{ fontFamily: 'Newsreader, serif', fontSize: 19, lineHeight: 1.65 }}>
          <p>
            This is a placeholder for the body of the post. The structure of
            an entry on this site is intentionally simple: a serif body, a few
            section headings in a heavier weight, footnotes only when they
            earn their keep, and dates always in <span className="mono">yyyy.mm.dd</span>.
          </p>
          <h2 style={{ fontFamily: 'Newsreader, serif', fontWeight: 500, fontSize: 24, margin: '32px 0 8px' }}>A first section</h2>
          <p>
            Lorem ipsum is not what I want here, ever — when this is a real
            post, this is where the argument starts. For the design preview, just
            imagine the rest of the piece: a few paragraphs, a pull-quote in
            italics, and a single image plate near the bottom.
          </p>
          <blockquote style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 22, lineHeight: 1.5, color: 'var(--ink-2)', margin: '28px 0', borderLeft: '2px solid var(--accent)', paddingLeft: 18 }}>
            “Most of what I do begins with a question I cannot answer alone,
            and a notebook page that does not yet make sense.”
          </blockquote>
          <h2 style={{ fontFamily: 'Newsreader, serif', fontWeight: 500, fontSize: 24, margin: '32px 0 8px' }}>A small image plate</h2>
          <div style={{ background: 'var(--paper-2)', border: '.5px solid var(--rule-2)', padding: 18, margin: '12px 0' }}>
            <PlatePlaceholder tone={3} ratio={1.6} label={p.slug + ' · plate'} />
          </div>
          <p>
            And we close. If you have thoughts, the address is{' '}
            <a className="serif-link" href="mailto:hi@guillego.com">hi@guillego.com</a>.
          </p>
        </div>
      </article>
    </Page>
  );
}

Object.assign(window, { NewsletterPage, NowPage, AboutPage, TagsPage, PostPage });
