"use client";

/* ─── Option A: Node Lettermark ────────────────────────────────────────────
   The letter "A" drawn as 5 graph nodes connected by violet lines.
   Nodes pulse in staggered sequence.
────────────────────────────────────────────────────────────────────────── */
function LogoNodeA({ size = 40 }: { size?: number }) {
  const s = size;
  const r = s * 0.065;
  const sw = s * 0.038;

  const nodes = [
    { cx: s * 0.5,  cy: s * 0.06 },  // peak
    { cx: s * 0.06, cy: s * 0.94 },  // bottom-left
    { cx: s * 0.94, cy: s * 0.94 },  // bottom-right
    { cx: s * 0.32, cy: s * 0.56 },  // crossbar-left
    { cx: s * 0.68, cy: s * 0.56 },  // crossbar-right
  ];
  const edges: [number, number][] = [[0, 1], [0, 2], [3, 4]];
  const delays = [0, 0.6, 1.0, 0.3, 0.8];

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ overflow: "visible" }}>
      <defs>
        <style>{`
          @keyframes logoNodePulse {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 1; }
          }
          @keyframes logoLinePulse {
            0%, 100% { opacity: 0.25; }
            50% { opacity: 0.7; }
          }
          ${nodes.map((_, i) => `
            .lna-node-${i} {
              animation: logoNodePulse 2.4s ease-in-out ${delays[i]}s infinite;
            }
          `).join("")}
          .lna-edge {
            animation: logoLinePulse 2.4s ease-in-out infinite;
          }
        `}</style>
        <filter id="lna-glow">
          <feGaussianBlur stdDeviation={s * 0.04} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#a855f7"
          strokeWidth={sw}
          strokeLinecap="round"
          className="lna-edge"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx} cy={n.cy} r={r}
          fill="#a855f7"
          filter="url(#lna-glow)"
          className={`lna-node-${i}`}
        />
      ))}
    </svg>
  );
}

/* ─── Option B: Orbital ─────────────────────────────────────────────────────
   A large center node with a smaller node orbiting it.
   The orbit line and outer node glow, leaving a fading arc.
────────────────────────────────────────────────────────────────────────── */
function LogoOrbital({ size = 40 }: { size?: number }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const orbitR = s * 0.35;
  const nodeR = s * 0.08;
  const dotR = s * 0.05;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ overflow: "visible" }}>
      <defs>
        <style>{`
          @keyframes orbit {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes centerPulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          .orb-ring {
            animation: orbit 3s linear infinite;
            transform-origin: ${cx}px ${cy}px;
          }
          .orb-center {
            animation: centerPulse 3s ease-in-out infinite;
          }
        `}</style>
        <filter id="orb-glow">
          <feGaussianBlur stdDeviation={s * 0.05} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Orbit track */}
      <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke="#a855f7" strokeWidth={s * 0.012} opacity={0.15} />

      {/* Center node */}
      <circle cx={cx} cy={cy} r={nodeR} fill="#a855f7" className="orb-center" filter="url(#orb-glow)" />

      {/* Orbiting group */}
      <g className="orb-ring">
        {/* Line from center to dot */}
        <line
          x1={cx} y1={cy}
          x2={cx + orbitR} y2={cy}
          stroke="#a855f7" strokeWidth={s * 0.018} opacity={0.4}
        />
        {/* Orbiting dot */}
        <circle cx={cx + orbitR} cy={cy} r={dotR} fill="#c084fc" filter="url(#orb-glow)" />
      </g>
    </svg>
  );
}

/* ─── Option C: Constellation ───────────────────────────────────────────────
   7 nodes in a tight cluster, edges light up in a travelling wave.
────────────────────────────────────────────────────────────────────────── */
function LogoConstellation({ size = 40 }: { size?: number }) {
  const s = size;

  const nodes = [
    { cx: s * 0.5,  cy: s * 0.1  },  // 0 top
    { cx: s * 0.82, cy: s * 0.32 },  // 1 top-right
    { cx: s * 0.75, cy: s * 0.72 },  // 2 bottom-right
    { cx: s * 0.5,  cy: s * 0.9  },  // 3 bottom
    { cx: s * 0.25, cy: s * 0.72 },  // 4 bottom-left
    { cx: s * 0.18, cy: s * 0.32 },  // 5 top-left
    { cx: s * 0.5,  cy: s * 0.5  },  // 6 center
  ];
  const edges: [number, number][] = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],
    [6,0],[6,2],[6,4],
  ];
  const nodeDelays = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.2];
  const edgeDelays = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.05, 0.25, 0.45];

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ overflow: "visible" }}>
      <defs>
        <style>{`
          @keyframes conNode {
            0%, 100% { opacity: 0.3; r: ${s * 0.045}px; }
            50% { opacity: 1; r: ${s * 0.07}px; }
          }
          @keyframes conEdge {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.65; }
          }
          ${nodeDelays.map((d, i) => `.con-n${i} { animation: conNode 2.8s ease-in-out ${d}s infinite; }`).join("\n          ")}
          ${edgeDelays.map((d, i) => `.con-e${i} { animation: conEdge 2.8s ease-in-out ${d}s infinite; }`).join("\n          ")}
        `}</style>
        <filter id="con-glow">
          <feGaussianBlur stdDeviation={s * 0.035} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#a855f7"
          strokeWidth={s * 0.025}
          strokeLinecap="round"
          className={`con-e${i}`}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx} cy={n.cy} r={s * 0.055}
          fill="#a855f7"
          filter="url(#con-glow)"
          className={`con-n${i}`}
        />
      ))}
    </svg>
  );
}

/* ─── Preview page ─────────────────────────────────────────────────────── */
const options = [
  {
    id: "A",
    name: "Node Lettermark",
    description: 'The "A" in Kura drawn as graph nodes. Staggered pulse animation.',
    Logo: LogoNodeA,
  },
  {
    id: "B",
    name: "Orbital",
    description: "A center node with a smaller node orbiting it. Suggests exploration and graph traversal.",
    Logo: LogoOrbital,
  },
  {
    id: "C",
    name: "Constellation",
    description: "A 7-node cluster with edges lighting up in a travelling wave.",
    Logo: LogoConstellation,
  },
];

export default function LogoPreviewPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-16">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Logo concepts — all animated. Tell me which one you want.</p>
        <p className="text-xs text-muted-foreground">Shown at nav size (32px) and hero size (96px).</p>
      </div>

      {options.map(({ id, name, description, Logo }) => (
        <div key={id} className="rounded-2xl border border-border/50 bg-card p-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="text-3xl font-bold text-primary">{id}</div>
            <div>
              <h2 className="text-lg font-bold">{name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>

          {/* Nav size */}
          <div className="mb-8">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Nav size</p>
            <div className="flex items-center gap-3 rounded-xl bg-background px-4 py-3 w-fit border border-border/40">
              <Logo size={32} />
              <span className="text-lg font-bold tracking-tight text-primary">Kura</span>
            </div>
          </div>

          {/* Hero size */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Hero size</p>
            <div className="flex flex-col items-center gap-4 rounded-xl bg-background py-12 border border-border/40">
              <Logo size={96} />
              <div className="text-center">
                <p className="text-4xl font-bold tracking-tight text-primary">Kura</p>
                <p className="text-sm text-muted-foreground mt-1">Discover anime through studio DNA</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
