import React from 'react';
import {Img} from 'remotion';
import {At, Fill, logo, ramp, usePop, useSec} from '../kit';
import {C, grad, monoF} from '../theme';
import {CUE} from '../timing';

const ALERTS: [string, number, number][] = [
  ['payments-api · p99 latency 2.4 s', 120, 120], ['checkout-web · error rate 5.1 %', 1240, 260],
  ['payments-db · pool saturation 92 %', 120, 535], ['ingress · 5xx spike', 1240, 540], ['order-queue · consumer lag 4 min', 650, 650],
];

const Toast = ({text, at, x, y, hot}: {text: string; at: number; x: number; y: number; hot?: boolean}) => {
  const s = useSec();
  const p = usePop(at);
  if (s < at) return null;
  const shake = hot ? Math.sin((s - at) * 60) * 8 * Math.max(0, 1 - (s - at) * 1.4) : 0;
  return (
    <At x={x + shake} y={y - (1 - p) * 40} w={hot ? 760 : 560} style={{opacity: Math.min(1, p), padding: '22px 28px', borderRadius: 18, boxSizing: 'border-box', background: hot ? '#3a1217' : C.panel, border: `2px solid ${hot ? C.red : C.line}`, fontSize: hot ? 36 : 26, fontWeight: 600, display: 'flex', gap: 18, alignItems: 'center'}}>
      <span style={{width: 16, height: 16, borderRadius: '50%', background: C.red, boxShadow: `0 0 18px ${C.red}`, flex: 'none'}} />
      {text}
    </At>
  );
};

export const Intro = () => {
  const s = useSec();
  const hide = 1 - ramp(s, CUE.meet - 0.4, 0.5);
  const reveal = ramp(s, CUE.meet, 1);
  const elapsed = Math.min(10, Math.max(0, s));
  const sec = Math.floor(elapsed);
  const tenth = Math.floor((elapsed - sec) * 10);
  const pulse = 0.5 + 0.5 * Math.sin(s * 5.2);
  const progress = Math.min(1, s / 10);
  return (
    <Fill>
      {/* Live telemetry texture: subtle grid, scanline and signal traces make the cold open feel like a real observability wall. */}
      <At x={0} y={0} w={1920} h={1080} style={{opacity: hide, background: `radial-gradient(900px 600px at 50% 44%, ${C.red}2e, transparent 72%), linear-gradient(180deg, #07101d 0%, #0a1322 58%, #101426 100%)`}} />
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute', inset:0, opacity: hide * 0.28}}>
        {Array.from({length: 25},(_,i)=><line key={'v'+i} x1={i*80} y1="0" x2={i*80} y2="1080" stroke={C.cyan} strokeWidth="1" opacity=".22"/>)}
        {Array.from({length: 15},(_,i)=><line key={'h'+i} x1="0" y1={i*80} x2="1920" y2={i*80} stroke={C.cyan} strokeWidth="1" opacity=".18"/>)}
        <path d="M0 740 L220 740 L260 730 L300 744 L340 710 L380 744 L470 744 L520 690 L570 744 L750 744 L800 735 L840 742 L910 700 L950 744 L1160 744 L1200 720 L1240 744 L1440 744 L1490 675 L1530 744 L1920 744" fill="none" stroke={C.red} strokeWidth="3" strokeDasharray="8 10"/>
        <path d={`M0 ${840+Math.sin(s*2)*8} C360 820 520 870 780 840 S1320 800 1920 830`} fill="none" stroke={C.cyan} strokeWidth="2"/>
      </svg>
      <At x={0} y={74} w={1920} style={{textAlign:'center',opacity:hide,fontSize:20,fontFamily:monoF,letterSpacing:5,color:C.mute}}>PRODUCTION OBSERVABILITY  /  CHECKOUT CLUSTER</At>
      <At x={0} y={230} w={1920} style={{textAlign:'center',opacity:hide}}>
        <div style={{fontSize:22,letterSpacing:4,color:C.red,fontWeight:700}}>INCIDENT CLOCK · LIVE</div>
        <div style={{fontFamily:monoF,fontSize:190,fontWeight:600,letterSpacing:7,lineHeight:1.12,textShadow:`0 0 ${28+30*pulse}px ${C.red}55, 0 10px 35px #0008`}}>
          00:<span style={{color:sec>=8?C.red:C.text}}>{String(sec).padStart(2,'0')}</span><span style={{fontSize:72,color:C.red,opacity:.9}}>.{tenth}</span>
        </div>
        <div style={{width:620,height:8,margin:'26px auto 0',background:C.line,borderRadius:10,overflow:'hidden'}}>
          <div style={{width:`${progress*100}%`,height:'100%',background:`linear-gradient(90deg,${C.cyan},${C.orange},${C.red})`,boxShadow:`0 0 20px ${C.red}88`}}/>
        </div>
        <div style={{marginTop:14,fontSize:20,color:C.mute,letterSpacing:2}}>SIGNAL DETECTED <span style={{color:C.red}}>→</span> ALERTS CORRELATING</div>
      </At>
      <div style={{opacity:hide}}>
        <Toast hot text="CRITICAL · checkout-api p99 latency breached SLO" at={CUE.alert} x={580} y={860} />
        {ALERTS.map(([t, x, y], i) => <Toast key={t} text={t} at={CUE.storm + i * 0.7} x={x} y={y} />)}
      </div>
      <At x={1420} y={100} w={390} h={126} style={{opacity:hide, border:`1px solid ${C.red}66`,borderRadius:18,background:'#170e19cc',padding:22,boxSizing:'border-box'}}>
        <div style={{fontSize:18,color:C.mute,letterSpacing:2}}>ALERT FAN-OUT</div>
        <div style={{fontSize:48,fontWeight:800,color:C.red,lineHeight:1.1}}>{Math.min(5,Math.max(0,Math.floor((s-CUE.storm)*1.2)+1))}<span style={{fontSize:22,color:C.mute}}> / 5 signals</span></div>
        <div style={{height:5,background:C.line,borderRadius:5,marginTop:10,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,Math.max(0,(s-CUE.storm)/3.4*100))}%`,background:C.red}}/></div>
      </At>
      {/* Cinematic blue brand reveal: logo mark resolves first, wordmark follows, then the tagline. */}
      {s >= CUE.meet - 0.12 && (() => {
        const t = Math.max(0, s - CUE.meet);
        const markIn = ramp(s, CUE.meet, 1.05);
        const wordIn = ramp(s, CUE.meet + 0.55, 0.72);
        const tagIn = ramp(s, CUE.meet + 1.0, 0.55);
        const settle = 1 - Math.min(1, t / 0.95);
        const sweep = ramp(s, CUE.meet + 0.08, 0.82) * (1 - ramp(s, CUE.meet + 1.05, 0.36));
        return <>
          <At x={0} y={0} w={1920} h={1080} style={{opacity: 0.72 * (1 - ramp(s, CUE.meet + 0.7, 0.9)),background:`radial-gradient(ellipse 520px 430px at 50% 44%, ${C.blue}55 0%, ${C.cyan}1f 42%, transparent 76%)`}}/>
          <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute',inset:0,pointerEvents:'none',opacity:sweep*0.8}}>
            <defs><linearGradient id="velaiRevealSweep"><stop offset="0" stopColor={C.cyan} stopOpacity="0"/><stop offset=".48" stopColor={C.cyan} stopOpacity=".9"/><stop offset="1" stopColor={C.blue} stopOpacity="0"/></linearGradient></defs>
            <path d={`M 650 ${540-420*sweep} Q 960 ${450-360*sweep} 1270 ${540-420*sweep}`} fill="none" stroke="url(#velaiRevealSweep)" strokeWidth="5" strokeLinecap="round" opacity=".8"/>
            <circle cx="960" cy="440" r={170+90*sweep} fill="none" stroke={C.blue} strokeWidth="2" opacity={.3*(1-sweep)}/>
          </svg>
          <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute',inset:0,pointerEvents:'none',opacity:markIn*0.42}}>
            <g transform={`translate(960 330) scale(${0.45+0.55*markIn})`} stroke={C.blue} strokeWidth="3" strokeLinecap="round">
              {Array.from({length:12},(_,i)=><line key={i} x1="0" y1="-178" x2="0" y2="-225" transform={`rotate(${i*30})`} opacity={i%3===0?0.85:0.42}/>)}
            </g>
            <circle cx="960" cy="330" r={130+80*markIn} fill="none" stroke={C.cyan} strokeWidth="2" opacity={0.22*(1-markIn*0.7)}/>
          </svg>
          <At x={0} y={190} w={1920} style={{textAlign:'center',opacity:reveal,transform:`translateY(${(1-markIn)*34}px) scale(${0.82+0.18*markIn+0.025*settle})`}}>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:285,filter:`drop-shadow(0 0 ${18+22*markIn}px ${C.blue}99) drop-shadow(0 0 52px ${C.cyan}45)`}}>
              <Img src={logo('velai-symbol')} style={{height:280,objectFit:'contain',clipPath:`inset(${(1-markIn)*100}% 0 0 0)`}}/>
            </div>
            <div style={{fontSize:150,fontWeight:850,letterSpacing:10,background:grad,WebkitBackgroundClip:'text',color:'transparent',marginTop:8,opacity:wordIn,transform:`translateY(${(1-wordIn)*24}px)`,textShadow:`0 0 36px ${C.blue}30`}}>VelAI</div>
            <div style={{fontSize:40,color:C.mute,marginTop:6,opacity:tagIn,transform:`translateY(${(1-tagIn)*14}px)`}}>Your AI-powered SRE copilot</div>
          </At>
        </>;
      })()}
    </Fill>
  );
};
