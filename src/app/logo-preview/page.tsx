"use client";

/* ─── Shared animation keyframes ─────────────────────────────────────── */
const KEYFRAMES = `
  @keyframes drawIn {
    from { stroke-dashoffset: 1; opacity: 0.2; }
    to   { stroke-dashoffset: 0; opacity: 1; }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.85; }
    50%       { opacity: 1; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

/* ─── Option A: ク Katakana mark ────────────────────────────────────────
   Two strokes of the katakana character ク.
   Strokes draw in sequentially, then glow pulses.
────────────────────────────────────────────────────────────────────────── */
function LogoKu({ size = 40 }: { size?: number }) {
  const id = `ku-${size}`;
  const sw = size * 0.13;

  return (
    <svg width={size} height={size * 56/48} viewBox="0 0 48 56" style={{ overflow: "visible" }}>
      <defs>
        <style>{`
          ${KEYFRAMES}
          .${id}-bar   { opacity: 0; animation: fadeIn 0.4s ease-out 0.05s forwards, glowPulse 3s ease-in-out 0.5s infinite; }
          .${id}-sweep { opacity: 0; animation: fadeIn 0.5s ease-out 0.35s forwards, glowPulse 3s ease-in-out 0.85s infinite; }
        `}</style>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Horizontal bar — top portion of ク */}
      <path d="M 7,20 L 36,20" fill="none" stroke="#a855f7" strokeWidth={sw}
        strokeLinecap="round" className={`${id}-bar`} filter={`url(#${id}-glow)`} />
      {/* Sweep — from upper-right curving down to lower-left */}
      <path d="M 32,8 C 46,14 46,38 30,50 L 12,56" fill="none" stroke="#a855f7" strokeWidth={sw}
        strokeLinecap="round" className={`${id}-sweep`} filter={`url(#${id}-glow)`} />
    </svg>
  );
}

/* ─── Option B: Geometric K ─────────────────────────────────────────────
   Three strokes forming a bold K. Each draws in with a stagger,
   then a gradient sweep replays on a loop.
────────────────────────────────────────────────────────────────────────── */
function LogoK({ size = 40 }: { size?: number }) {
  const id = `k-${size}`;
  const u = size / 48;
  const sw = size * 0.115;

  const strokes = [
    { d: `M ${10*u},${6*u} L ${10*u},${42*u}`, delay: 0.0 },
    { d: `M ${10*u},${24*u} L ${38*u},${6*u}`,  delay: 0.3 },
    { d: `M ${10*u},${24*u} L ${38*u},${42*u}`, delay: 0.55 },
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${48*u} ${48*u}`} style={{ overflow: "visible" }}>
      <defs>
        <style>{`
          ${KEYFRAMES}
          ${strokes.map((_, i) => `
            .${id}-s${i} { stroke-dasharray:1; stroke-dashoffset:1;
              animation: drawIn 0.5s ease-out ${strokes[i].delay}s forwards,
                         glowPulse 3s ease-in-out ${0.5 + strokes[i].delay}s infinite; }
          `).join("")}
        `}</style>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation={size * 0.07} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {strokes.map((s, i) => (
        <path key={i} d={s.d} fill="none"
          stroke={`url(#${id}-grad)`}
          strokeWidth={sw} strokeLinecap="round" pathLength={1}
          className={`${id}-s${i}`} filter={`url(#${id}-glow)`} />
      ))}
    </svg>
  );
}

/* ─── Option C: Vault rings ─────────────────────────────────────────────
   Three concentric arcs that draw in from 0 with a stagger,
   plus a center node. Suggests depth, collection, and storage.
────────────────────────────────────────────────────────────────────────── */
function LogoVault({ size = 40 }: { size?: number }) {
  const id = `v-${size}`;
  const cx = size / 2;
  const cy = size / 2;
  const arcs = [
    { r: size * 0.42, sw: size * 0.07, delay: 0.0, opacity: 1.0 },
    { r: size * 0.29, sw: size * 0.07, delay: 0.2, opacity: 0.75 },
    { r: size * 0.16, sw: size * 0.07, delay: 0.4, opacity: 0.55 },
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <defs>
        <style>{`
          ${KEYFRAMES}
          ${arcs.map((a, i) => `
            .${id}-arc-${i} {
              stroke-dasharray: 1; stroke-dashoffset: 1;
              animation: drawIn 0.8s cubic-bezier(0.4,0,0.2,1) ${a.delay}s forwards,
                         glowPulse 3s ease-in-out ${0.8 + a.delay}s infinite;
            }
          `).join("")}
          .${id}-dot {
            animation: fadeIn 0.3s ease-out 0.7s both,
                       glowPulse 3s ease-in-out 1s infinite;
          }
        `}</style>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation={size * 0.06} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {arcs.map((a, i) => (
        <circle key={i} cx={cx} cy={cy} r={a.r}
          fill="none" stroke="#a855f7" strokeWidth={a.sw} strokeLinecap="round"
          strokeDasharray={`${Math.PI * 1.5} ${Math.PI * 0.5}`}
          pathLength={1} className={`${id}-arc-${i}`}
          style={{ opacity: a.opacity }} filter={`url(#${id}-glow)`}
          transform={`rotate(-120 ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={size * 0.06}
        fill="#c084fc" className={`${id}-dot`} filter={`url(#${id}-glow)`} />
    </svg>
  );
}

/* ─── Preview page ─────────────────────────────────────────────────────── */
const OPTIONS = [
  {
    id: "A",
    name: "ク Katakana",
    description: 'Two strokes of the katakana character ク — the first syllable of Kura. Draws in, then glows. Unique to any other app.',
    Logo: LogoKu,
  },
  {
    id: "B",
    name: "Geometric K",
    description: "Bold K, three strokes drawing in with a purple gradient. Clean and legible at any size.",
    Logo: LogoK,
  },
  {
    id: "C",
    name: "Vault Rings",
    description: "Three concentric arcs drawing in sequence. Abstract, modern — suggests depth and collection.",
    Logo: LogoVault,
  },
];

export default function LogoPreviewPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-14">
      <p className="text-sm text-muted-foreground">
        Three animated logo concepts. Tell me A, B, or C.
      </p>

      {OPTIONS.map(({ id, name, description, Logo }) => (
        <div key={id} className="rounded-2xl border border-border/50 bg-card p-8 space-y-8">
          <div className="flex items-start gap-5">
            <span className="text-3xl font-bold text-primary leading-none">{id}</span>
            <div>
              <h2 className="text-lg font-bold">{name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5 max-w-lg">{description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Nav preview */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Navbar</p>
              <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-background px-4 py-3 w-fit">
                <Logo size={28} />
                <span className="text-base font-bold tracking-tight text-primary">Kura</span>
              </div>
            </div>

            {/* Hero preview */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Hero</p>
              <div className="flex items-center gap-5 rounded-xl border border-border/40 bg-background px-6 py-5">
                <Logo size={72} />
                <div>
                  <p className="text-3xl font-bold tracking-tight text-primary leading-tight">Kura</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Your personal anime library</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
