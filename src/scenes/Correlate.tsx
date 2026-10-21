import React from 'react';
import {AppFrame, At, Check, Panel, Rev, Tag, ramp, usePop, useSec} from '../kit';
import {C} from '../theme';
import {CUE} from '../timing';

const ALERTS: [string,string,string,string][] = [
 ['payments-api','p99 latency 2.4 s','SLO > 800 ms · 3m window','FIRING · prod'],
 ['checkout-web','HTTP error rate 5.1%','Baseline 0.4% · 5m window','FIRING · prod'],
 ['payments-db','Connection pool 92% used','Acquire wait rising · pool max 100','FIRING · prod'],
 ['ingress','5xx rate spike','Gateway errors · 184 events','FIRING · prod'],
 ['order-queue','Consumer lag 4 min','Oldest message age · rising','FIRING · prod'],
];
const CHIPS: [string, number][] = [['Same fingerprint', CUE.fingerprint], ['Maintenance windows', CUE.maintenance], ['Service topology', CUE.topology], ['Timing', CUE.timing]];

export const Correlate = () => {
  const s = useSec();
  const merge = ramp(s, CUE.one, 0.8);
  const pop = usePop(CUE.one);
  return (
    <AppFrame active="Incidents">
      <At x={64} y={124} style={{fontSize: 30, fontWeight: 700}}>Incoming alerts</At>
      {ALERTS.map(([a,b,meta,status],i)=>{
        const p=ramp(s,CUE.five+i*.28,.5);
        return <Panel key={a} x={64-(1-p)*120} y={180+i*150} w={620} h={128} style={{opacity:p*(1-.72*merge),display:'flex',flexDirection:'column',justifyContent:'center',padding:'15px 22px',borderLeft:`4px solid ${C.red}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><div style={{fontSize:25,fontWeight:800}}>{a}</div><span style={{fontSize:14,color:C.red,fontWeight:800,letterSpacing:1.1}}>{status}</span></div>
          <div style={{fontSize:22,color:C.orange,fontWeight:700,marginTop:4}}>{b}</div><div style={{fontSize:16,color:C.mute,fontFamily:'monospace',marginTop:5}}>{meta}</div>
        </Panel>;
      })}
      {CHIPS.map(([t, at], i) => {
        const on = ramp(s, at, 0.4);
        return (
          <At key={t} x={740} y={230 + i * 150} w={430} h={96} style={{boxSizing: 'border-box', border: `2px solid ${on > 0.5 ? C.cyan : C.line}`, background: on > 0.5 ? C.cyan + '1c' : C.panel, borderRadius: 18, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', fontSize: 28, fontWeight: 600, color: on > 0.5 ? C.text : C.mute}}>
            <span style={{width: 30, opacity: on}}><Check c={C.cyan} /></span>{t}
          </At>
        );
      })}
      <At x={1210} y={150} style={{fontSize: 30, fontWeight: 700}}>Incident</At>
      <Panel x={1210} y={230} w={646} h={520} style={{opacity: Math.min(1, pop), transform: `scale(${0.8 + 0.2 * pop})`, border: `2px solid ${C.cyan}`,background:'linear-gradient(145deg,#14233a,#0e1829)',boxShadow:`0 0 48px ${C.cyan}22`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <Tag c={C.orange}>P2 · ACTIVE</Tag><span style={{fontSize:18,fontFamily:'monospace',color:C.mute}}>CORRELATION ENGINE</span>
        </div>
        <div style={{display:'flex',alignItems:'baseline',gap:16,marginTop:18}}>
          <span style={{fontSize:142,fontWeight:850,lineHeight:1,background:`linear-gradient(180deg,${C.text},${C.cyan})`,WebkitBackgroundClip:'text',color:'transparent'}}>1</span><span style={{fontSize:32,color:C.mute}}>incident formed</span>
        </div>
        <div style={{fontSize:28,fontWeight:750,marginTop:14}}>INC-2041 · Checkout latency</div>
        <div style={{margin:'18px 0',display:'flex',gap:10,flexWrap:'wrap'}}><Tag c={C.cyan}>5 alerts → 1 incident</Tag><Tag c={C.violet}>Fingerprint match</Tag></div>
        <svg viewBox="0 0 560 86" width="100%" height="86" style={{marginTop:4}}>
          {Array.from({length:5},(_,i)=><g key={i}><rect x={i*112+8} y="22" width="78" height="42" rx="10" fill={C.cyan+'18'} stroke={C.cyan+'77'}/><circle cx={i*112+47} cy="43" r="5" fill={C.cyan}/></g>)}
          <path d="M55 43 H505" stroke={C.cyan} strokeWidth="2" strokeDasharray="5 7" opacity=".7"/>
          <path d="M280 64 V80" stroke={C.violet} strokeWidth="3"/><path d="M273 73 L280 80 L287 73" fill="none" stroke={C.violet} strokeWidth="3"/>
        </svg>
        <Rev at={CUE.paged} style={{display:'flex',alignItems:'center',gap:14,fontSize:28,fontWeight:750,color:C.green,marginTop:10}}><Check/> Humans paged: 0 <span style={{fontSize:18,color:C.mute,fontWeight:500}}>· grouped before escalation</span></Rev>
      </Panel>
    </AppFrame>
  );
};
