import React, {createContext, useContext} from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, sans} from './theme';

/* ---------- time helpers: everything is driven by absolute voiceover seconds ---------- */
export const SecCtx = createContext(0);
export const useSec = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return useContext(SecCtx) + f / fps;
};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const ramp = (s: number, at: number, d = 0.5) => Easing.out(Easing.cubic)(clamp((s - at) / d));
export const usePop = (at: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const base = useContext(SecCtx);
  return spring({frame: Math.max(0, f - (at - base) * fps), fps, config: {damping: 14, stiffness: 160, mass: 0.8}});
};
export const logo = (n: string) => staticFile(`logos/${n}.png`);

/* ---------- layout primitives (absolute 1920x1080 canvas coordinates) ---------- */
type BoxP = {x: number; y: number; w?: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode};
export const At = ({x, y, w, h, style, children}: BoxP) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style}}>{children}</div>
);
export const Panel = (p: BoxP) => (
  <At {...p} style={{background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: 24, boxSizing: 'border-box', ...p.style}} />
);
export const Fill = ({children, bg = C.bg}: {children?: React.ReactNode; bg?: string}) => (
  <div style={{position: 'absolute', inset: 0, background: bg, fontFamily: sans, color: C.text, overflow: 'hidden'}}>{children}</div>
);
export const Tag = ({c = C.cyan, children, style}: {c?: string; children: React.ReactNode; style?: React.CSSProperties}) => (
  <span style={{display: 'inline-block', background: c + '22', color: c, border: `1px solid ${c}66`, borderRadius: 999, padding: '6px 16px', fontSize: 22, fontWeight: 600, ...style}}>{children}</span>
);
export const Rev = ({at, d = 0.5, dy = 18, style, children}: {at: number; d?: number; dy?: number; style?: React.CSSProperties; children?: React.ReactNode}) => {
  const p = ramp(useSec(), at, d);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style}}>{children}</div>;
};
export const LogoImg = ({n, h}: {n: string; h: number}) => <Img src={logo(n)} style={{height: h, objectFit: 'contain'}} />;

export const OpenSearchMark = ({size=76}:{size?:number}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="OpenSearch mark">
    <defs><linearGradient id="osMarkGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f59e0b"/><stop offset=".52" stopColor="#f97316"/><stop offset="1" stopColor="#14b8a6"/></linearGradient></defs>
    <circle cx="48" cy="48" r="29" fill="none" stroke="url(#osMarkGradient)" strokeWidth="12" strokeDasharray="142 42" transform="rotate(-35 48 48)"/>
    <path d="M65 67 L86 86" stroke="#14b8a6" strokeWidth="12" strokeLinecap="round"/>
    <circle cx="48" cy="48" r="10" fill="#0b1728"/>
  </svg>
);

export const Check = ({c = C.green, size = 28}: {c?: string; size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6.5" /></svg>
);
export const Lock = ({c = C.green, size = 28}: {c?: string; size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.4} strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
);
export const TeamsMark = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" rx="22" fill="#5059C9" /><text x="50" y="68" textAnchor="middle" fontSize="58" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">T</text></svg>
);

/* ---------- product chrome shared by the "live console" scenes ---------- */
const NAV = ['Dashboard', 'Incidents', 'Assistant', 'Integrations', 'Connections'];
export const AppFrame = ({active, children}: {active: string; children?: React.ReactNode}) => (
  <Fill>
    <At x={0} y={0} w={1920} h={84} style={{background: '#050b16', borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 18, boxSizing: 'border-box'}}>
      <Img src={logo('velai-symbol')} style={{height: 44}} />
      <span style={{fontSize: 28, fontWeight: 700, marginRight: 28}}>VelAI Console</span>
      {NAV.map((n) => (
        <span key={n} style={{padding: '8px 20px', borderRadius: 999, fontSize: 22, fontWeight: 600, background: n === active ? C.text : 'transparent', color: n === active ? C.bg : C.mute}}>{n}</span>
      ))}
      <span style={{marginLeft: 'auto'}}><Tag c={C.green}>Running inside your cluster</Tag></span>
    </At>
    {children}
  </Fill>
);

/* ---------- logo pop: big logo springs in exactly when the tool is spoken ---------- */
export const LogoPop = ({src, node, label, at, x, y, size = 220, hold = 2.2, returnTo, stay = false}: {src?: string; node?: React.ReactNode; label: string; at: number; x: number; y: number; size?: number; hold?: number; returnTo?: [number, number]; stay?: boolean}) => {
  const s = useSec();
  const p = usePop(at);
  const returnDur = 0.62;
  const exit = ramp(s, at + hold, returnDur);
  // If a destination is supplied, the logo settles into the dashboard and stays there.
  const landed = !!returnTo && stay && s >= at + hold + returnDur;
  const out = returnTo ? (stay ? 1 : (s < at + hold + returnDur ? 1 : 0)) : 1 - ramp(s, at + hold, 0.42);
  const centerX = returnTo ? x + (returnTo[0] - x) * exit : x;
  const centerY = returnTo ? y + (returnTo[1] - y) * exit : y;
  // Shrink to a tile-sized mark, not a tiny vanishing speck.
  const shrink = returnTo ? 1 - 0.68 * exit : 1;
  if (s < at || out <= 0) return null;
  const elapsed = Math.max(0, s - at);
  const settle = Math.min(1, elapsed / 0.55);
  const drift = landed ? 0 : Math.sin(elapsed * 2.4) * 4;
  const ring = Math.min(1, elapsed / 0.7);
  return (
    <>
    <div style={{position:'absolute',inset:0,zIndex:45,pointerEvents:'none',opacity:Math.min(1,p)*(returnTo?1-Math.min(1,exit*1.45):out),background:'rgba(3,8,17,.72)',backdropFilter:'blur(9px)'}} />
    <div style={{position: 'absolute', left: centerX, top: centerY, width: size + 110, height: size + 190, transform: `translate(-50%,-50%) scale(${(0.72 + 0.28 * p) * shrink}) translateY(${(1 - settle) * 18 + drift + (stay && returnTo ? 22 * exit : 0)}px)`, opacity: Math.min(1, p) * out, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 12, width: size + 78, height: size + 78, borderRadius: '50%', background: `radial-gradient(circle, ${C.cyan}28 0%, #1677d218 42%, transparent 72%)`, filter: 'blur(8px)', transform: `scale(${0.75 + ring * 0.35})`,opacity:returnTo?1-exit:1}} />
      <div style={{position: 'absolute', top: 12, width: size + 54, height: size + 54, borderRadius: '50%', border: `1.5px solid ${C.cyan}55`, opacity: (1 - ring) * 0.72*(returnTo?1-exit:1), transform: `scale(${0.62 + ring * 0.55})`}} />
      <div style={{position: 'absolute', top: 12, width: size + 20, height: size + 20, borderRadius: '50%', border: `1px solid ${C.cyan}33`, opacity: (0.42 + 0.18 * Math.sin(elapsed * 3))*(returnTo?1-exit:1), transform: `rotate(${elapsed * 12}deg) scale(${0.96 + 0.025 * Math.sin(elapsed * 2)})`}} />
      {src ? (
        <Img src={src} style={{
          height: size, width: size, objectFit: 'contain',
          filter: `drop-shadow(0 0 16px ${C.cyan}55) drop-shadow(0 12px 24px rgba(0,0,0,.35))`,
          transform: `scale(${0.88 + 0.12 * settle})`, position: 'relative'
        }} />
      ) : (
        <div style={{height: size, width: size, filter: `drop-shadow(0 0 16px ${C.cyan}55)`, position: 'relative'}}>{node}</div>
      )}
      <div style={{position: 'relative', marginTop: 12, fontSize: 32, fontWeight: 750, letterSpacing: 1.2, color: C.text, textShadow: `0 0 18px ${C.cyan}66, 0 4px 14px rgba(0,0,0,.6)`,opacity:returnTo?1-exit:1}}>{label}</div>
    </div>
    </>
  );
};

/* ---------- animated mouse pointer: [timeSec, x, y, click?] waypoints ---------- */
export type Pt = [number, number, number, 1?];
export const Cursor = ({pts}: {pts: Pt[]}) => {
  const s = useSec();
  const t0 = pts[0][0];
  const t1 = pts[pts.length - 1][0];
  if (s < t0 - 0.4 || s > t1 + 1) return null;
  const ts = pts.map((p) => p[0]);
  const o = {easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const x = interpolate(s, ts, pts.map((p) => p[1]), o);
  const y = interpolate(s, ts, pts.map((p) => p[2]), o);
  const vis = Math.min(ramp(s, t0 - 0.4, 0.3), 1 - ramp(s, t1 + 0.5, 0.4));
  const press = pts.some((p) => p[3] && s >= p[0] && s < p[0] + 0.14) ? 0.82 : 1;
  return (
    <>
      {pts.filter((p) => p[3]).map((p, i) => {
        const k = clamp((s - p[0]) / 0.55);
        return k > 0 && k < 1 ? (
          <div key={i} style={{position: 'absolute', left: p[1] - 60, top: p[2] - 60, width: 120, height: 120, borderRadius: '50%', border: `4px solid ${C.cyan}`, opacity: 1 - k, transform: `scale(${0.2 + 0.8 * k})`, zIndex: 90}} />
        ) : null;
      })}
      <svg style={{position: 'absolute', left: x - 5, top: y - 4, zIndex: 100, opacity: vis, transform: `scale(${press})`, transformOrigin: '5px 4px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))'}} width={44} height={44} viewBox="0 0 24 24">
        <path d="M3 2v17l4.6-4.2 3.2 7.4 2.8-1.2-3.2-7.3H18z" fill="#39bdf4" stroke="#e8f8ff" strokeWidth={1.35} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/* ---------- popup that grows out of the clicked element ---------- */
export const Pop = ({at, until, from = [960, 540], w = 900, children}: {at: number; until: number; from?: [number, number]; w?: number; children?: React.ReactNode}) => {
  const s = useSec();
  const p = usePop(at);
  const out = 1 - ramp(s, until, 0.35);
  if (s < at || out <= 0) return null;
  const k = Math.min(1, p) * out;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: `rgba(4,9,18,${0.62 * k})`, zIndex: 60}} />
      <div style={{position: 'absolute', left: 960, top: 540, width: w, zIndex: 70, boxSizing: 'border-box', transform: `translate(calc(-50% + ${(1 - p) * (from[0] - 960)}px), calc(-50% + ${(1 - p) * (from[1] - 540)}px)) scale(${0.45 + 0.55 * p})`, opacity: k, background: C.panel, border: `1px solid ${C.cyan}66`, borderRadius: 26, padding: 40, boxShadow: '0 40px 120px rgba(0,0,0,.65)'}}>
        {children}
      </div>
    </>
  );
};

/* ---------- 3D camera: tilted fly-in -> flat -> zoom to click target -> pull back (from your sample) ---------- */
export type CamKey = [number, {rx: number; ry: number; s: number; x: number; y: number; fx: number; fy: number}];
export const Camera = ({keys, children}: {keys: CamKey[]; children?: React.ReactNode}) => {
  const s = useSec();
  const ts = keys.map((k) => k[0]);
  const o = {easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const v = (f: (k: CamKey[1]) => number) => interpolate(s, ts, keys.map((k) => f(k[1])), o);
  const rx = v((k) => k.rx), ry = v((k) => k.ry), sc = v((k) => k.s), x = v((k) => k.x), y = v((k) => k.y), fx = v((k) => k.fx), fy = v((k) => k.fy);
  const tilt = clamp((Math.abs(rx) + Math.abs(ry)) / 30);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: C.bg, perspective: 2200}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(1500px 520px at 50% 108%, ${C.blue}${tilt > 0.05 ? 'aa' : '22'}, ${C.cyan}18 38%, transparent 72%)`, opacity: 0.35 + 0.65 * tilt}} />
      <div style={{position: 'absolute', inset: 0, transformOrigin: `${fx}px ${fy}px`, transform: `translate(${x}px, ${y}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`, borderRadius: 30 * tilt, overflow: tilt > 0.02 ? 'hidden' : 'visible', boxShadow: `0 60px 160px ${C.blue}${tilt > 0.05 ? '66' : '00'}`}}>
        {children}
      </div>
    </div>
  );
};
