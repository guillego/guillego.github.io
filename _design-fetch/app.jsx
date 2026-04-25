// app.jsx — router, nav, footer, tweaks

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "flexoki",
  "density": "regular",
  "motifs": "subtle",
  "homeVariant": "hybrid",
  "type": "quiet",
  "mode": "light"
}/*EDITMODE-END*/;

function useHashRoute() {
  const [route, setRoute] = useState(() => (location.hash || '#home').slice(1));
  useEffect(() => {
    const onHash = () => setRoute((location.hash || '#home').slice(1));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const navigate = (to) => { location.hash = '#' + to; window.scrollTo(0, 0); };
  return [route, navigate];
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, navigate] = useHashRoute();

  useEffect(() => {
    document.body.dataset.palette = t.palette;
    document.body.dataset.density = t.density;
    document.body.dataset.motifs = t.motifs;
    document.body.dataset.mode = t.mode;
    document.body.dataset.type = t.type;
  }, [t.palette, t.density, t.motifs, t.mode, t.type]);

  let page;
  const [head, ...rest] = route.split('/');
  const tail = rest.join('/');
  if (head === '' || head === 'home') page = <Home variant={t.homeVariant} onNav={navigate} />;
  else if (head === 'thoughts') page = <ThoughtsPage onNav={navigate} />;
  else if (head === 'posts') page = <PostsPage onNav={navigate} />;
  else if (head === 'post') page = <PostPage slug={tail} onNav={navigate} />;
  else if (head === 'projects') page = <ProjectsPage onNav={navigate} />;
  else if (head === 'project') page = <ProjectDetail slug={tail} onNav={navigate} />;
  else if (head === 'photography') page = <PhotographyPage onNav={navigate} />;
  else if (head === 'reading') page = <ReadingPage onNav={navigate} />;
  else if (head === 'newsletter') page = <NewsletterPage onNav={navigate} />;
  else if (head === 'now') page = <NowPage onNav={navigate} />;
  else if (head === 'about') page = <AboutPage onNav={navigate} />;
  else if (head === 'tags') page = <TagsPage onNav={navigate} />;
  else if (head === 'tag') page = <TagsPage onNav={navigate} filterTag={tail} />;
  else page = <Home variant={t.homeVariant} onNav={navigate} />;

  const isHome = head === '' || head === 'home';

  return (
    <div className="app" key={route} data-screen-label={head || 'home'}>
      <Nav route={head || 'home'} onNav={navigate} />
      {page}
      <Footer onNav={navigate} />

      <TweaksPanel>
        <TweakSection label="Layout" />
        {isHome && <TweakRadio label="Home" value={t.homeVariant}
          options={['hybrid', 'index', 'desk']}
          onChange={(v) => setTweak('homeVariant', v)} />}
        <TweakRadio label="Density" value={t.density}
          options={['sparse', 'regular', 'rich']}
          onChange={(v) => setTweak('density', v)} />

        <TweakSection label="Look" />
        <TweakRadio label="Palette" value={t.palette}
          options={['flexoki', 'slate', 'oxide']}
          onChange={(v) => setTweak('palette', v)} />
        <TweakRadio label="Mode" value={t.mode}
          options={['light', 'dark']}
          onChange={(v) => setTweak('mode', v)} />
        <TweakRadio label="Type" value={t.type}
          options={['quiet', 'serif', 'mono']}
          onChange={(v) => setTweak('type', v)} />

        <TweakSection label="Motifs" />
        <TweakRadio label="Field-journal motifs" value={t.motifs}
          options={['off', 'subtle', 'full']}
          onChange={(v) => setTweak('motifs', v)} />
      </TweaksPanel>
    </div>
  );
}

function Nav({ route, onNav }) {
  const links = [
    { to: 'home', label: 'Index' },
    { to: 'thoughts', label: 'Thoughts' },
    { to: 'posts', label: 'Posts' },
    { to: 'photography', label: 'Photography' },
    { to: 'projects', label: 'Projects' },
    { to: 'reading', label: 'Reading' },
    { to: 'newsletter', label: 'Letters' },
    { to: 'now', label: 'Now' },
    { to: 'about', label: 'About' },
  ];
  const folioOf = (r) => {
    const map = { home: '001', thoughts: '002', posts: '003', photography: '004', projects: '005', newsletter: '006', now: '007', about: '008', tags: '009', reading: '010' };
    return map[r] || '—';
  };
  return (
    <nav className="nav">
      <a className="nav-brand" onClick={() => onNav('home')}>
        <span className="dot" />
        <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>guillego</span>
      </a>
      <div className="nav-center">
        {links.map(l => (
          <a key={l.to} className={`nav-link ${route === l.to ? 'active' : ''}`}
            onClick={() => onNav(l.to)}>{l.label}</a>
        ))}
      </div>
      <div className="nav-right">
        <span>fol. {folioOf(route)}</span>
        <span className="folio">2026</span>
      </div>
    </nav>
  );
}

function Footer({ onNav }) {
  return (
    <footer className="foot">
      <div className="foot-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
            <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 22 }}>guillego</span>
          </div>
          <p className="t-meta" style={{ marginTop: 14, maxWidth: 320, lineHeight: 1.7, fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-2)' }}>
            A working notebook of writing, projects and photographs. Posted
            once here, syndicated everywhere.
          </p>
        </div>
        <div>
          <div className="foot-h">Notebook</div>
          <div className="foot-list">
            <a onClick={() => onNav('thoughts')}>Thoughts</a><br/>
            <a onClick={() => onNav('posts')}>Posts</a><br/>
            <a onClick={() => onNav('photography')}>Photography</a><br/>
            <a onClick={() => onNav('projects')}>Projects</a><br/>
            <a onClick={() => onNav('reading')}>Reading</a>
          </div>
        </div>
        <div>
          <div className="foot-h">Subscribe</div>
          <div className="foot-list">
            <a onClick={() => onNav('newsletter')}>Newsletter</a><br/>
            <a href="/feed.xml">RSS — /feed.xml</a><br/>
            <a onClick={() => onNav('now')}>Now</a><br/>
            <a onClick={() => onNav('tags')}>Tags</a>
          </div>
        </div>
        <div>
          <div className="foot-h">Elsewhere</div>
          <div className="foot-list">
            <a href="mailto:hi@guillego.com">hi@guillego.com</a><br/>
            <a href="#">@guillego — mastodon</a><br/>
            <a href="#">@guillego.com — bsky</a><br/>
            <a href="#">@guillego — github</a>
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© Guillermo Esteves · made with ♡</span>
        <span>set in Newsreader & JetBrains Mono · last tended {currentNowLine().date}</span>
      </div>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
