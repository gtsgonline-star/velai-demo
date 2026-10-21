import React from 'react';
import {At, Fill, ramp, useSec} from '../kit';
import {C} from '../theme';
import {CUE} from '../timing';

const KPI=({x,at,value,label,accent=C.cyan}:{x:number;at:number;value:string;label:string;accent?:string})=>{
 const s=useSec(); const p=ramp(s,at,0.7);
 return <At x={x} y={258} w={500} h={150} style={{opacity:p,transform:`translateY(${(1-p)*18}px)`,borderLeft:`4px solid ${accent}`,padding:'6px 22px',boxSizing:'border-box'}}>
  <div style={{fontSize:15,color:C.mute,letterSpacing:2,fontWeight:750}}>MODELED TARGET</div>
  <div style={{fontSize:84,fontWeight:900,lineHeight:1.02,marginTop:5,color:C.text}}>{value}</div>
  <div style={{fontSize:21,color:C.mute,marginTop:5}}>{label}</div>
 </At>;
};
export const Outcomes=()=>{
 const s=useSec(); const p1=ramp(s,CUE.n1,1.2),p2=ramp(s,CUE.n2,1.2),p3=ramp(s,CUE.n3,1.4);
 const alerts=Array.from({length:16},(_,i)=>({x:22+i*30,y:58+Math.sin(i*1.7)*24}));
 // Cinematic metric focus: each spoken target takes over the frame, while the dashboard softens behind it.
 const focus=(at:number,next:number)=>ramp(s,at-0.32,0.48)*(1-ramp(s,next-0.42,0.52));
 const f1=focus(CUE.n1,CUE.n2), f2=focus(CUE.n2,CUE.n3), f3=focus(CUE.n3,140.72);
 const focusStrength=Math.max(f1,f2,f3);
 const FocusMetric=({alpha,value,label,detail,accent}:{alpha:number;value:string;label:string;detail:string;accent:string})=>{
  return <At x={360} y={300} w={1200} h={470} style={{zIndex:30,opacity:alpha,transform:`scale(${0.82+0.18*alpha}) translateY(${(1-alpha)*24}px)`,transformOrigin:'center center',pointerEvents:'none',filter:`drop-shadow(0 0 ${18+22*alpha}px ${accent}44)`}}>
   <div style={{height:'100%',boxSizing:'border-box',borderRadius:30,border:`1.5px solid ${accent}99`,background:'linear-gradient(135deg,rgba(14,29,49,.98),rgba(7,17,31,.98))',boxShadow:`0 28px 90px rgba(0,0,0,.55), inset 0 0 0 1px ${accent}22`,padding:'42px 64px',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 45%,${accent}20,transparent 65%)`}}/>
    <div style={{position:'relative',fontSize:20,fontWeight:800,letterSpacing:4,color:accent}}>MODELED TARGET · OUTCOME INTELLIGENCE</div>
    <div style={{position:'relative',fontSize:168,fontWeight:900,lineHeight:1.04,letterSpacing:-5,marginTop:18,color:C.text,textShadow:`0 0 36px ${accent}35`}}>{value}</div>
    <div style={{position:'relative',fontSize:34,fontWeight:750,marginTop:12,color:C.text}}>{label}</div>
    <div style={{position:'relative',fontSize:21,color:C.mute,marginTop:14}}>{detail}</div>
    <div style={{position:'relative',height:5,width:'100%',borderRadius:99,background:C.line,marginTop:34,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.max(0,Math.min(100,alpha*100))}%`,background:`linear-gradient(90deg,${accent},${C.cyan})`,boxShadow:`0 0 18px ${accent}88`}}/></div>
   </div>
  </At>;
 };
 return <Fill bg="#070f1c"><div style={{position:'absolute',inset:0,filter:`blur(${focusStrength*7}px)`,transform:`scale(${1+focusStrength*0.012})`,opacity:1-focusStrength*0.12,transition:'none'}}>
  <At x={0} y={0} w={1920} h={1080} style={{background:'radial-gradient(ellipse at 72% 48%,#15304a66,transparent 58%),linear-gradient(180deg,#07101d,#0a1322)'}}/>
  <At x={72} y={42} w={1776} h={72} style={{display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${C.line}`}}>
   <div style={{fontSize:21,fontWeight:850,letterSpacing:2}}>VELAI / OUTCOME INTELLIGENCE</div><div style={{display:'flex',gap:20,fontSize:18,color:C.mute}}><span>Incidents</span><span style={{color:C.cyan,fontWeight:750}}>Impact analytics</span><span>MTTR</span></div><span style={{fontSize:15,color:C.yellow,border:`1px solid ${C.yellow}55`,borderRadius:8,padding:'7px 12px'}}>MODELED · NOT MEASURED</span>
  </At>
  <At x={72} y={137} style={{fontSize:40,fontWeight:850}}>Operational impact targets</At>
  <At x={72} y={188} style={{fontSize:19,color:C.mute}}>Illustrative solution-design targets — validate with deployment data</At>
  <KPI x={72} at={CUE.n1} value="≥25%" label="fewer human-facing notifications" accent={C.cyan}/>
  <KPI x={680} at={CUE.n2} value="1.5 h" label="target saved per P1 / P2 incident" accent={C.violet}/>
  <KPI x={1288} at={CUE.n3} value="~10%" label="MTTR reduction within 3 months" accent={C.orange}/>
  <At x={72} y={445} w={560} h={390} style={{border:`1px solid ${C.line}`,borderRadius:20,background:'#0c192a',padding:22,boxSizing:'border-box',opacity:p1}}>
   <div style={{fontSize:18,fontWeight:800,letterSpacing:1.3}}>01 / ALERT NOISE</div><div style={{fontSize:15,color:C.mute,marginTop:5}}>Signal fan-out → actionable incident</div>
   <svg viewBox="0 0 510 260" width="100%" height="260" style={{marginTop:10}}>
    {alerts.map((a,i)=>{const ex=255+(i%4-1.5)*8,ey=198;return <g key={i} opacity={Math.max(.15,1-p1*.75)}><path d={`M${a.x} ${a.y} Q${(a.x+ex)/2} ${a.y-45*p1} ${ex} ${ey}`} fill="none" stroke={i%4===0?C.orange:C.cyan} strokeWidth="1.5" strokeDasharray="4 6"/><circle cx={a.x} cy={a.y} r={4+2*Math.sin(s*3+i)} fill={i%4===0?C.orange:C.cyan}/></g>})}
    <rect x="170" y="166" width="170" height="68" rx="15" fill="#12314a" stroke={C.cyan} strokeWidth="2" opacity={.25+.75*p1}/><text x="255" y="194" textAnchor="middle" fill={C.text} fontSize="15" fontWeight="700">INC-2041</text><text x="255" y="216" textAnchor="middle" fill={C.cyan} fontSize="14">1 actionable incident</text>
    <text x="12" y="253" fill={C.mute} fontSize="13">16 illustrative alert events</text><text x="498" y="253" textAnchor="end" fill={C.cyan} fontSize="13">consolidated</text>
   </svg>
   <div style={{display:'flex',justifyContent:'space-between',fontSize:17,color:C.mute}}><span>Alert volume</span><span style={{color:C.cyan,fontWeight:800}}>−25% target</span></div>
  </At>
  <At x={680} y={445} w={560} h={390} style={{border:`1px solid ${C.line}`,borderRadius:20,background:'#0c192a',padding:22,boxSizing:'border-box',opacity:p2}}>
   <div style={{fontSize:18,fontWeight:800,letterSpacing:1.3}}>02 / P1 · P2 RESPONSE</div><div style={{fontSize:15,color:C.mute,marginTop:5}}>Illustrative workflow time comparison</div>
   <div style={{marginTop:25}}>{[['Manual investigation',100,'#64748b'],['VelAI-assisted',55,C.cyan]].map(([label,width,color],i)=><div key={String(label)} style={{marginBottom:22}}><div style={{display:'flex',justifyContent:'space-between',fontSize:17,marginBottom:7}}><span>{label}</span><span style={{color:i?C.cyan:C.mute}}>{i?'Target workflow':'Baseline'}</span></div><div style={{height:22,background:C.line,borderRadius:8,overflow:'hidden'}}><div style={{height:'100%',width:`${Number(width)*(i?p2:1)}%`,background:i?`linear-gradient(90deg,${C.cyan},${C.violet})`:String(color),borderRadius:8,boxShadow:i?`0 0 18px ${C.cyan}44`:undefined}}/></div></div>)}</div>
   <div style={{display:'flex',gap:9,marginTop:7}}><span style={{background:'#3d1b22',color:'#ff8b8b',borderRadius:8,padding:'6px 10px',fontSize:15,fontWeight:750}}>P1 · Critical</span><span style={{background:'#3b2c17',color:'#ffc66d',borderRadius:8,padding:'6px 10px',fontSize:15,fontWeight:750}}>P2 · High</span></div>
   <div style={{fontSize:14,color:C.mute,marginTop:15}}>1.5 hours saved is a modeled target, not a measured outcome.</div>
  </At>
  <At x={1288} y={445} w={560} h={390} style={{border:`1px solid ${C.line}`,borderRadius:20,background:'#0c192a',padding:22,boxSizing:'border-box',opacity:p3}}>
   <div style={{fontSize:18,fontWeight:800,letterSpacing:1.3}}>03 / MTTR TREND</div><div style={{fontSize:15,color:C.mute,marginTop:5}}>Target trajectory · 3-month horizon</div>
   <svg viewBox="0 0 510 235" width="100%" height="235" style={{marginTop:12}}>
    {Array.from({length:5},(_,i)=><line key={i} x1="30" x2="490" y1={28+i*42} y2={28+i*42} stroke={C.line} strokeWidth="1"/>)}
    <path d="M30 75 C95 55 110 120 170 110 S245 90 300 145 S390 170 490 205" pathLength="1" fill="none" stroke={C.orange} strokeWidth="4" strokeDasharray="1" strokeDashoffset={1-p3}/>
    <path d="M30 75 C95 65 110 95 170 92 S245 82 300 112 S390 135 490 150" pathLength="1" fill="none" stroke={C.cyan} strokeWidth="4" strokeDasharray="1" strokeDashoffset={1-p3}/>
    <circle cx={30+460*p3} cy={75+75*p3} r={6+2*p3} fill={C.orange} opacity={p3*0.9}/><circle cx={30+460*p3} cy={75+75*p3/2} r={6+2*p3} fill={C.cyan} opacity={p3}/><circle cx={490} cy={150} r={7+3*p3} fill={C.cyan} opacity={p3*0.35}/><text x="30" y="252" fill={C.mute} fontSize="14">Month 0</text><text x="490" y="252" textAnchor="end" fill={C.mute} fontSize="14">Month 3</text>
   </svg>
   <div style={{display:'flex',justifyContent:'space-between',fontSize:17,color:C.mute}}><span>Target reduction</span><span style={{color:C.orange,fontSize:24,fontWeight:850}}>~10%</span></div>
  </At>
  <At x={72} y={900} w={1776} h={95} style={{display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:`1px solid ${C.line}`,color:C.mute,fontSize:17}}><span>Modeled targets from solution design · validate against production telemetry</span><span style={{fontSize:15,letterSpacing:2}}>VELAI · INCIDENT INTELLIGENCE</span></At>
 </div>
 <At x={0} y={0} w={1920} h={1080} style={{zIndex:20,background:`rgba(2,7,15,${focusStrength*0.48})`,opacity:focusStrength,pointerEvents:'none',backdropFilter:`blur(${focusStrength*1.5}px)`}}/>
 <FocusMetric alpha={f1} value="≥25%" label="Fewer human-facing notifications" detail="Signal fan-out is consolidated into fewer, more actionable incidents." accent={C.cyan}/>
 <FocusMetric alpha={f2} value="1.5 h" label="Target time saved per P1 / P2 incident" detail="A modeled workflow-efficiency target—not a measured deployment result." accent={C.violet}/>
 <FocusMetric alpha={f3} value="~10%" label="MTTR reduction within three months" detail="A target trajectory to validate against production telemetry." accent={C.orange}/>
 </Fill>;
};
