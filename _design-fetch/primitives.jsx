// primitives.jsx — small reusable bits

const { useEffect: useEffP, useState: useStateP, useRef: useRefP } = React;

/* tiny inline marks: each one is a small sketch in SVG.
   Used as the bullet next to entries; varies per kind. */
function Mark({ kind, size = 12 }) {
  const s = size;
  if (kind === 'thought') return (
    <svg width={s} height={s} viewBox="0 0 12 12">
      <circle cx="6" cy="6" r="2.4" fill="none" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
  if (kind === 'post') return (
    <svg width={s} height={s} viewBox="0 0 12 12">
      <rect x="2" y="2" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
  if (kind === 'project') return (
    <svg width={s} height={s} viewBox="0 0 12 12">
      <path d="M6 1.5 L10.5 6 L6 10.5 L1.5 6 Z" fill="none" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
  if (kind === 'photo') return (
    <svg width={s} height={s} viewBox="0 0 12 12">
      <circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.45" />
      <circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
  if (kind === 'newsletter') return (
    <svg width={s} height={s} viewBox="0 0 12 12">
      <path d="M2 3 L10 3 L10 9 L2 9 Z M2 3 L6 6.5 L10 3" fill="none" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
  if (kind === 'reading') return (
    <svg width={s} height={s} viewBox="0 0 12 12">
      <path d="M6 2.5 L6 10 M2 3 Q6 4 6 2.5 M10 3 Q6 4 6 2.5 M2 3 L2 9 Q6 10 6 8.5 M10 3 L10 9 Q6 10 6 8.5" fill="none" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
  return <svg width={s} height={s}><circle cx={s/2} cy={s/2} r="1.5" fill="currentColor" /></svg>;
}

/* a hand-feel underline rule */
function HandRule({ width = '100%' }) {
  return (
    <svg className="hand-rule" viewBox="0 0 400 8" preserveAspectRatio="none" width={width}>
      <path d="M0 4 C 60 2.5, 120 5.5, 180 4.2 S 320 3, 400 4.5"
        fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.75" />
      <path d="M2 6 C 80 5.5, 160 7, 240 6 S 380 6.5, 398 6"
        fill="none" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

/* a fleuron / dingbat */
function Fleuron({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ verticalAlign: 'middle' }}>
      <path d="M7 1 C 9 4, 9 5, 7 7 C 5 5, 5 4, 7 1 Z M7 13 C 9 10, 9 9, 7 7 C 5 9, 5 10, 7 13 Z M1 7 C 4 9, 5 9, 7 7 C 5 5, 4 5, 1 7 Z M13 7 C 10 9, 9 9, 7 7 C 9 5, 10 5, 13 7 Z"
        fill="currentColor" opacity="0.55" />
      <circle cx="7" cy="7" r="0.7" fill="currentColor" />
    </svg>
  );
}

/* a small leaf glyph (brand) */
function LeafGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <path d="M3 15 C 5 6, 11 3, 15 3 C 15 7, 12 13, 3 15 Z"
        fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="0.8" />
      <path d="M3 15 L 14 4" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.55" />
    </svg>
  );
}

/* placeholder photo "plate" — striped, with mono caption inside */
function PlatePlaceholder({ tone = 1, ratio = 1, label = '' }) {
  // tone-tinted backgrounds in oklch-ish hand-tuned values
  const tones = {
    1: { bg: 'rgba(120, 120, 110, 0.18)', stripe: 'rgba(80, 70, 50, 0.12)' },
    2: { bg: 'rgba(130, 150, 120, 0.18)', stripe: 'rgba(80, 100, 60, 0.12)' },
    3: { bg: 'rgba(180, 130, 90, 0.18)', stripe: 'rgba(140, 80, 40, 0.12)' },
    4: { bg: 'rgba(110, 140, 160, 0.18)', stripe: 'rgba(70, 100, 130, 0.12)' },
    5: { bg: 'rgba(160, 130, 100, 0.20)', stripe: 'rgba(110, 80, 50, 0.14)' },
  };
  const t = tones[tone] || tones[1];
  return (
    <div style={{
      width: '100%',
      paddingBottom: `${100 / ratio}%`,
      position: 'relative',
      background: t.bg,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(45deg, ${t.stripe} 0 1px, transparent 1px 8px)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10, letterSpacing: '.16em',
          color: 'var(--ink-3)', textTransform: 'uppercase',
          background: 'color-mix(in srgb, var(--paper) 80%, transparent)',
          padding: '4px 8px',
          border: '.5px solid var(--rule-2)',
        }}>
          plate · {label}
        </div>
      </div>
    </div>
  );
}

/* page wrapper with folio mark */
function Page({ children, folio, narrow, wide, label }) {
  const cls = ['page', narrow && 'narrow', wide && 'wide'].filter(Boolean).join(' ');
  return (
    <main className={cls}>
      {folio && <div className="folio-mark">{folio}</div>}
      {children}
    </main>
  );
}

/* margin gloss row — left gloss, body, right meta */
function GlossRow({ gloss, right, children }) {
  return (
    <div className="gloss-row">
      <div className="gloss">{gloss}<span className="tick" /></div>
      <div>{children}</div>
      <div className="gloss-r">{right}</div>
    </div>
  );
}

/* ornamental separator */
function Sep({ glyph = '✻' }) {
  return <div className="dingbat dingbat--center">{glyph} {glyph} {glyph}</div>;
}

Object.assign(window, { Mark, HandRule, Fleuron, LeafGlyph, PlatePlaceholder, Page, GlossRow, Sep });
