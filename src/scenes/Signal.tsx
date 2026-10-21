import React from 'react';
import {interpolate} from 'remotion';
import {AppFrame, At, Cursor, LogoPop, Panel, Pop, Rev, Tag, logo, ramp, useSec} from '../kit';
import {C} from '../theme';
import {CUE} from '../timing';

// Smooth, deterministic telemetry curve (not an ECG/heartbeat). The overall
// latency level rises in sync with the spoken SLO-breach beat.
const makeLatencyTrace = (time: number, rise: number, base: number, amp: number, phase = 0, count = 180) =>
  Array.from({length: count}, (_, i) => {
    const u = i / (count - 1);
    const x = u * 1000;
    const broad = Math.sin(u * Math.PI * 2.1 + time * 0.42 + phase) * amp * 0.34;
    const fine = Math.sin(u * Math.PI * 6.4 - time * 0.23 + phase * 1.7) * amp * 0.13;
    const slowDrift = Math.sin(u * Math.PI * 0.9 + time * 0.17) * amp * 0.12;
    const gentleTrend = rise * (u * 48 + Math.pow(u, 1.7) * 47);
    const y = base - gentleTrend - broad - fine - slowDrift;
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

const latencyY = (u: number, time: number, rise: number, base: number, amp: number, phase = 0) =>
  base - rise * (u * 48 + Math.pow(u, 1.7) * 47)
  - Math.sin(u * Math.PI * 2.1 + time * 0.42 + phase) * amp * 0.34
  - Math.sin(u * Math.PI * 6.4 - time * 0.23 + phase * 1.7) * amp * 0.13
  - Math.sin(u * Math.PI * 0.9 + time * 0.17) * amp * 0.12;

const ROWS: [string,string][] = [
  ['Incident ID','INC-2041 · P2'], ['Affected service','checkout-api · prod'],
  ['Customer impact','5.1% errors · p99 2.4 s'], ['Detection window','00:01–00:11 · 5 min metrics'],
];

export const Signal = () => {
  const s = useSec();
  const draw = interpolate(s, [12.55, CUE.building], [0.06, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rise = interpolate(s, [CUE.guhatek, CUE.signalProm, CUE.building], [0.12, 0.52, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = makeLatencyTrace(s, rise, 348, 30);
  const secondary = makeLatencyTrace(s * 0.72, rise * 0.42, 374, 13, 1.1);
  const markerX = Math.max(0, Math.min(990, draw * 990));
  const markerY = latencyY(draw, s, rise, 348, 30);
  const baselineY = latencyY(draw, s * 0.72, rise * 0.42, 374, 13, 1.1);
  return (
    <AppFrame active="Incidents">
      <Panel x={64} y={124} w={1040} h={800}>
        <div style={{fontSize: 30, fontWeight: 700}}>checkout-api · p99 latency</div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:18,fontFamily:'monospace',fontSize:18,color:C.mute}}>
          <span>METRIC: http_server_requests_seconds</span><span>WINDOW: 5m · LIVE</span>
        </div>
        <svg viewBox="0 0 1000 400" width={992} height={400} style={{marginTop: 16,background:'linear-gradient(180deg,#0b1728aa,#101d31aa)',borderRadius:14}}>
          {Array.from({length:11},(_,i)=><line key={'gx'+i} x1={i*100} x2={i*100} y1="0" y2="400" stroke={C.line} strokeWidth="1" opacity=".6"/>)}
          {Array.from({length:9},(_,i)=><line key={'gy'+i} x1="0" x2="1000" y1={i*50} y2={i*50} stroke={C.line} strokeWidth="1" opacity=".6"/>)}
          <line x1={0} x2={1000} y1={258} y2={258} stroke={C.red} strokeDasharray="10 8" strokeWidth={2} opacity={0.9} />
          <path d={pulse} pathLength={1} strokeDasharray="1" strokeDashoffset={1-draw} fill="none" stroke={C.cyan} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" opacity=".98" filter="drop-shadow(0 0 5px #22c3ee66)"/>
          <path d={secondary} pathLength={1} strokeDasharray="1" strokeDashoffset={1-draw} fill="none" stroke={C.blue} strokeWidth={2.5} strokeDasharray="8 9" strokeLinejoin="round" strokeLinecap="round" opacity=".72"/>
          <circle cx={markerX} cy={markerY} r="7" fill={C.cyan} stroke="#e8eef8" strokeWidth="2" opacity={draw>0.03?0.98:0}/>
          <circle cx={markerX} cy={baselineY} r="4" fill={C.blue} stroke="#cdeaff" strokeWidth="1.2" opacity={draw>0.03?0.8:0}/>
          <text x="18" y="28" fill={C.mute} fontSize="18">p99 (ms)</text><text x="850" y="382" fill={C.mute} fontSize="18">time →</text>
        </svg>
        <div style={{display:'flex',gap:18,marginTop:12,fontSize:17,color:C.mute,fontFamily:'monospace',alignItems:'center'}}>
          <span><b style={{color:C.cyan}}>━</b> live p99 latency</span><span style={{color:C.red}}>╌ 800 ms SLO threshold</span><span><b style={{color:C.blue}}>━</b> rolling baseline</span>
        </div>
        <div style={{marginTop:20,padding:'14px 16px',borderRadius:14,background:'#0a1424',border:`1px solid ${C.line}`}}>
          <div style={{fontSize:16,color:C.mute,letterSpacing:1.5,marginBottom:12}}>DEPENDENCY TRACE · REQUEST PATH</div>
          <div style={{display:'flex',alignItems:'center',gap:8,fontSize:19,fontWeight:700}}>
            <span style={{padding:'9px 12px',borderRadius:9,background:C.panel2,border:`1px solid ${C.line}`}}>ingress</span><span style={{color:C.cyan}}>→</span>
            <span style={{padding:'9px 12px',borderRadius:9,background:C.cyan+'18',border:`1px solid ${C.cyan}77`}}>checkout-api</span><span style={{color:C.red}}>→</span>
            <span style={{padding:'9px 12px',borderRadius:9,background:C.red+'18',border:`1px solid ${C.red}77`}}>payments-db</span>
            <span style={{marginLeft:'auto',fontFamily:'monospace',fontSize:17,color:C.red}}>span: 2.4s</span>
          </div>
        </div>
        <Rev at={CUE.signalProm + 0.2} style={{marginTop: 20, display: 'flex', gap: 14}}>
          <Tag c={C.red}>p99 above 800 ms SLO</Tag><Tag c={C.orange}>Prometheus alert firing</Tag>
        </Rev>
      </Panel>
      <Panel x={1136} y={124} w={720} h={800}>
        <At x={60} y={260} w={600} h={300} style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',opacity:ramp(s,CUE.guhatek,0.6)*(1-ramp(s,CUE.building-0.2,0.7))*(1-ramp(s,CUE.signalProm+1.5,0.4)),transform:`scale(${0.92+0.08*ramp(s,CUE.guhatek,0.6)})`}}>
          <img src={logo('guhatek-logo')} style={{height:170,width:360,objectFit:'contain'}} />
          <div style={{fontSize:18,color:C.mute,letterSpacing:3,marginTop:16}}>POWERED BY GUHATEK</div>
        </At>
        <Rev at={CUE.building}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:48,height:48,borderRadius:14,display:'grid',placeItems:'center',background:C.orange+'22',border:`1px solid ${C.orange}88`,fontSize:26,fontWeight:800,color:C.orange}}>!</div>
            <div style={{flex:1}}><div style={{fontSize:18,color:C.mute,letterSpacing:2}}>INCIDENT · INC-2041</div><div style={{fontSize:30,fontWeight:750}}>Checkout latency elevated</div></div>
            <Tag c={C.orange}>P2</Tag>
          </div>
          <div style={{display:'flex',gap:10,marginTop:18,flexWrap:'wrap'}}><Tag c={C.red}>SLO breach</Tag><Tag c={C.cyan}>5 signals correlated</Tag></div>
        </Rev>
        <div style={{marginTop:20,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {ROWS.map(([k,v],i)=><Rev key={k} at={CUE.building+.35+i*.22} d={.24} style={{minHeight:88,boxSizing:'border-box',padding:'13px 15px',borderRadius:12,background:'#0b1728',border:`1px solid ${C.line}`}}>
            <div style={{fontSize:15,color:C.mute,letterSpacing:1.1,fontWeight:700}}>{k.toUpperCase()}</div><div style={{fontSize:20,fontWeight:700,marginTop:7,lineHeight:1.2}}>{v}</div>
          </Rev>)}
        </div>
        <Rev at={CUE.building+1.35} d={.25} style={{marginTop:14,padding:'13px 15px',borderRadius:12,background:'#2a1720',border:`1px solid ${C.red}66`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><span style={{fontSize:16,color:C.red,fontWeight:800,letterSpacing:1}}>ACTIVE SIGNALS</span><span style={{fontSize:16,color:C.mute,fontFamily:'monospace'}}>5 correlated · 0 responders paged</span></div>
          <div style={{fontSize:18,fontWeight:650,marginTop:7,lineHeight:1.35}}>payments-db pool 92% · checkout-web errors 5.1% · ingress 5xx spike</div>
        </Rev>
      </Panel>
      <LogoPop src={logo('prometheus-logo')} label="Prometheus" at={CUE.signalProm} x={960} y={540} size={250} hold={0.95} />
      <Cursor pts={[[20.2, 1000, 760], [CUE.incClick, 1480, 300, 1]]} />
      <Pop at={CUE.incClick + 0.1} until={23.2} from={[1480, 300]} w={860}>
        <div style={{fontSize: 40, fontWeight: 800}}>INC-2041 · Checkout latency elevated</div>
        <div style={{display: 'flex', gap: 14, margin: '22px 0'}}><Tag c={C.orange}>P2</Tag><Tag c={C.cyan}>Prometheus alert</Tag><Tag c={C.green}>Inside your environment</Tag></div>
        <div style={{fontSize: 28, color: C.mute, lineHeight: 1.5}}>VelAI starts building the incident from the signal: service, topology, recent deploys and matching runbooks.</div>
      </Pop>
    </AppFrame>
  );
};
