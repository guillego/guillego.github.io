// data.jsx — content for guillego.com (mostly fabricated to fill out the design)

const THOUGHTS = [
  { date: '2026.04.18', text: 'Trying to capture the way the foehn flattens light over the lake — failing, mostly.', tags: ['weather', 'photo'] },
  { date: '2026.03.02', text: 'New album: <em>fog over the central plateau</em>. Eight frames, single morning.', tags: ['album', 'photo'] },
  { date: '2026.02.11', text: 'Re-read the “you and your research” talk. Different paragraphs hit, this year.', tags: ['notes'] },
  { date: '2026.01.07', text: 'Started a tiny tool to weigh my coffee on the same scale as my keyboard switches.', tags: ['tools', 'maker'] },
  { date: '2025.12.24', text: 'In Switzerland, the fog that often settles over the central plateau in winter has a name…', tags: ['weather', 'words'] },
  { date: '2025.10.30', text: 'Beans, but also: the way the steam rises in three braids when you pull just right.', tags: ['coffee'] },
  { date: '2025.09.14', text: 'Three weeks of trains. Notes on Europe’s timetabling getting better and worse, simultaneously.', tags: ['trains', 'travel'] },
  { date: '2025.05.10', text: 'First post using POSSE (post once, syndicate everywhere).', tags: ['meta', 'web'] },
  { date: '2025.03.21', text: 'On reading aloud: even technical writing benefits.', tags: ['writing'] },
  { date: '2024.12.02', text: 'A list of small joys from the year. Mostly bread.', tags: ['notes'] },
  { date: '2024.09.18', text: 'Watching a goldcrest in the fir outside the window for forty minutes.', tags: ['birds'] },
];

const POSTS = [
  { date: '2026.03.30', slug: 'a-quiet-feed', title: 'A quiet feed', desc: 'Notes on running a personal site as a slow correspondence — what to publish, what to skip, what to keep in the drawer.', tags: ['web', 'notes'], readTime: 8, words: 1820 },
  { date: '2026.01.18', slug: 'on-trains-part-2', title: 'Europe’s trains — part 2', desc: 'Five years on, the gap between the network on the map and the network you can actually book has narrowed and widened in interesting ways.', tags: ['trains', 'travel'], readTime: 14, words: 3120 },
  { date: '2025.11.05', slug: 'making-the-keypad', title: 'A small numeric keypad, in walnut', desc: 'Twelve switches, a piece of European walnut, and a weekend spent learning that QMK is more forgiving than I expected.', tags: ['maker', 'keyboards'], readTime: 11, words: 2540 },
  { date: '2025.07.12', slug: 'reading-aloud', title: 'On reading aloud', desc: 'Why I now read every long piece of writing — mine or someone else’s — out loud before publishing it.', tags: ['writing'], readTime: 6, words: 1340 },
  { date: '2024.06.27', slug: 'ufo-landing-patch', title: 'The UFO landing patch', desc: 'A small concrete pad, a fence, and the gentle local theory that this is where the saucer touched down.', tags: ['places', 'photo'], readTime: 5, words: 980 },
  { date: '2024.06.21', slug: 'pink-moon', title: 'Pink moon', desc: 'On going outside at 04:12 to see something that turns out to be only mildly pink.', tags: ['weather', 'notes'], readTime: 4, words: 720 },
  { date: '2024.06.20', slug: 'europes-trains-part-1', title: 'Europe’s trains — part 1', desc: 'Three weeks across eight countries with a single ticket, mostly. Some of the railways have signs in four languages and four typefaces.', tags: ['trains', 'travel'], readTime: 12, words: 2820 },
  { date: '2023.10.04', slug: 'small-photo-blog', title: 'On running a small photo blog', desc: 'How I’ve started thinking of the photo page as a working contact sheet, not a portfolio.', tags: ['photo', 'web'], readTime: 7, words: 1580 },
  { date: '2023.04.11', slug: 'the-coffee-rule', title: 'The coffee rule', desc: 'A single rule of thumb that has, against expectation, made every cup since better than the one before.', tags: ['coffee'], readTime: 3, words: 540 },
];

const PROJECTS = [
  { num: '01', slug: 'pocket-trains', title: 'Pocket trains', italic: 'pocket trains', desc: 'A tiny iOS app that turns your saved European train searches into a single glanceable widget. Built for myself, then let out.', meta: ['2025–present', 'swift · swiftui', 'live'] },
  { num: '02', slug: 'walnut-keypad', title: 'A numeric keypad in walnut', italic: 'a numeric keypad', desc: 'Twelve-switch handwired keypad with a hand-finished walnut case. The build log is honest about the mistakes.', meta: ['2025', 'qmk · cnc · finishing', 'shipped'] },
  { num: '03', slug: 'posse-tools', title: 'POSSE tooling for a static site', italic: 'POSSE tooling', desc: 'A small Ruby pipeline to post once on guillego.com and syndicate to Mastodon, Bluesky, and a personal RSS.', meta: ['2025', 'ruby · jekyll', 'open source'] },
  { num: '04', slug: 'fog-album', title: 'Fog over the central plateau', italic: 'fog over the central plateau', desc: 'A small photo album: eight frames from one foggy morning above Zürich, printed at home on a 3-bath Ilford process.', meta: ['2024', 'medium format · ilford', 'printed'] },
  { num: '05', slug: 'now-page-engine', title: 'A “now” page engine', italic: 'a “now” page', desc: 'Tooling that lets the now page be assembled from the same tags as the rest of the site, so it stays honest.', meta: ['2024', 'jekyll · ruby', 'open source'] },
  { num: '06', slug: 'darkroom-timer', title: 'Darkroom timer', italic: 'a darkroom timer', desc: 'An ESP32 timer that does both enlarger and tray timing, with a single rotary encoder and a lot of red light.', meta: ['2023', 'esp32 · c', 'in use'] },
];

const PHOTOS = [
  { id: 'p1', label: 'Foehn over Zürichsee', date: '2026.03.04', span: 6, ratio: 0.66, tone: 1 },
  { id: 'p2', label: 'A goldcrest, briefly', date: '2026.02.18', span: 3, ratio: 1.2, tone: 2 },
  { id: 'p3', label: 'Coffee, third pour', date: '2026.02.02', span: 3, ratio: 1.2, tone: 3 },
  { id: 'p4', label: 'Fog, central plateau', date: '2025.12.21', span: 4, ratio: 0.75, tone: 1 },
  { id: 'p5', label: 'Train shed, Bern', date: '2025.11.06', span: 4, ratio: 0.75, tone: 4 },
  { id: 'p6', label: 'Walnut, end-grain', date: '2025.10.30', span: 4, ratio: 0.75, tone: 5 },
  { id: 'p7', label: 'Snow on a fir', date: '2025.01.14', span: 6, ratio: 1.5, tone: 2 },
  { id: 'p8', label: 'Pink moon, mostly white', date: '2024.06.21', span: 6, ratio: 1.5, tone: 1 },
  { id: 'p9', label: 'UFO landing patch', date: '2024.06.27', span: 4, ratio: 0.85, tone: 4 },
  { id: 'p10', label: 'Train, Brig', date: '2024.05.04', span: 4, ratio: 0.85, tone: 5 },
  { id: 'p11', label: 'Loaf, fourth attempt', date: '2024.02.11', span: 4, ratio: 0.85, tone: 3 },
];

const READING = [
  { title: 'A Pattern Language', author: 'Christopher Alexander', initials: 'AP', status: 'reading', date: '2026.04', note: 'Slow re-read; one pattern an evening.' },
  { title: 'The Order of Time', author: 'Carlo Rovelli', initials: 'OT', status: 'finished', date: '2026.02', note: 'Underlined more than I expected.' },
  { title: 'On Looking', author: 'Alexandra Horowitz', initials: 'OL', status: 'finished', date: '2026.01', note: '' },
  { title: 'The Glass Bead Game', author: 'Hermann Hesse', initials: 'GB', status: 'shelved', date: '2025.11', note: 'Will come back to this in the spring.' },
  { title: 'Working in Public', author: 'Nadia Eghbal', initials: 'WP', status: 'finished', date: '2025.09', note: '' },
  { title: 'Mountains of the Mind', author: 'Robert Macfarlane', initials: 'MM', status: 'finished', date: '2025.07', note: 'Re-read, third time.' },
  { title: 'How to Do Nothing', author: 'Jenny Odell', initials: 'HN', status: 'finished', date: '2025.05', note: '' },
  { title: 'Seeing Like a State', author: 'James C. Scott', initials: 'SS', status: 'finished', date: '2025.03', note: '' },
];

const NEWSLETTERS = [
  { date: '2026.04.05', title: 'A small map, a wet print, and a coffee rule', slug: 'apr-2026' },
  { date: '2026.02.10', title: 'Trains, again; building a darkroom timer', slug: 'feb-2026' },
  { date: '2025.12.20', title: 'Fog over the central plateau (the album, the year)', slug: 'dec-2025' },
  { date: '2025.10.14', title: 'A keypad in walnut, and quitting four feeds', slug: 'oct-2025' },
  { date: '2025.07.30', title: 'Reading aloud and small repairs', slug: 'jul-2025' },
  { date: '2025.05.12', title: 'POSSE: posting once, syndicating everywhere', slug: 'may-2025' },
  { date: '2025.02.04', title: 'A field log: bird, bread, books', slug: 'feb-2025' },
  { date: '2024.11.18', title: 'On the slow web, in practice', slug: 'nov-2024' },
];

const TAGS_DATA = [
  { tag: 'photo', n: 24 }, { tag: 'trains', n: 11 }, { tag: 'travel', n: 14 },
  { tag: 'weather', n: 9 }, { tag: 'writing', n: 8 }, { tag: 'maker', n: 12 },
  { tag: 'keyboards', n: 6 }, { tag: 'coffee', n: 7 }, { tag: 'web', n: 10 },
  { tag: 'notes', n: 22 }, { tag: 'birds', n: 5 }, { tag: 'places', n: 9 },
  { tag: 'words', n: 4 }, { tag: 'meta', n: 3 }, { tag: 'tools', n: 8 },
  { tag: 'album', n: 4 },
];

Object.assign(window, { THOUGHTS, POSTS, PROJECTS, PHOTOS, READING, NEWSLETTERS, TAGS_DATA });
