import React from 'react';
import {AppFrame, Check, Cursor, Panel, Pop, Rev, Tag, ramp, useSec} from '../kit';
import {C} from '../theme';
import {CUE} from '../timing';

const SECTIONS:[string,string,string,number][]=[
 ['Impact','Checkout p99 latency reached 2.4 s for 34 minutes; approximately 18% of checkout requests timed out.','01',CUE.impact],
 ['Root cause','The payments-db connection pool saturated as retries from checkout-web amplified load.','02',CUE.cause],
 ['Resolution','On-call raised the pool limit and capped retries; service latency recovered.','03',CUE.resolution],
 ['Follow-ups','Add a pool-saturation alert, review retry budgets, and update the runbook.','04',CUE.follow],
];

const Metric=({label,value,sub,accent,at}:{label:string;value:string;sub:string;accent:string;at:number})=>{
 const s=useSec(),p=ramp(s,at,.42);
 return <div style={{opacity:p,transform:`translateY(${(1-p)*12}px)`,border:`1px solid ${accent}55`,background:`linear-gradient(145deg,${accent}12,#0b1728)`,borderRadius:14,padding:'13px 16px',boxSizing:'border-box',minWidth:0}}>
  <div style={{fontSize:14,color:C.mute,letterSpacing:1.1,fontWeight:750}}>{label.toUpperCase()}</div>
  <div style={{fontSize:34,fontWeight:900,color:accent,marginTop:5,lineHeight:1}}>{value}</div>
  <div style={{fontSize:15,color:C.mute,marginTop:6}}>{sub}</div>
 </div>;
};

export const Postmortem=()=>{
 const s=useSec(),pub=s>=CUE.publish;
 const progress=Math.min(1,Math.max(0,(s-CUE.impact)/(CUE.follow-CUE.impact+.8)));
 return <AppFrame active="Incidents">
  <Panel x={112} y={112} w={1696} h={936} style={{padding:28,background:'linear-gradient(145deg,#111e34,#0b1525)',borderColor:'#2b4262'}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
    <div>
     <div style={{fontSize:16,color:C.mute,letterSpacing:2,fontWeight:750}}>INCIDENT REVIEW / POST-INCIDENT ANALYSIS</div>
     <div style={{fontSize:39,fontWeight:900,marginTop:6}}>INC-2041 <span style={{color:C.mute,fontWeight:600}}>· Checkout latency</span></div>
     <div style={{display:'flex',gap:10,marginTop:12,flexWrap:'wrap'}}><Tag c={C.orange}>P2 · HIGH</Tag><Tag c={C.cyan}>34 min impact window</Tag><Tag c={C.green}>Service recovered</Tag></div>
    </div>
    <div style={{textAlign:'right'}}><Tag c={pub?C.green:C.yellow}>{pub?'Published':'Draft · review required'}</Tag><div style={{fontSize:15,color:C.mute,marginTop:10}}>Owner · On-call SRE</div></div>
   </div>
   <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginTop:24}}>
    <Metric label="Peak p99 latency" value="2.4 s" sub="SLO: 800 ms" accent={C.red} at={CUE.impact}/>
    <Metric label="Checkout errors" value="18%" sub="during impact window" accent={C.orange} at={CUE.impact+.22}/>
    <Metric label="Incident duration" value="34 min" sub="detected → recovered" accent={C.cyan} at={CUE.cause}/>
    <Metric label="Priority" value="P2" sub="high-severity response" accent={C.violet} at={CUE.resolution}/>
   </div>
   <div style={{display:'grid',gridTemplateColumns:'1.18fr .82fr',gap:18,marginTop:22}}>
    <div style={{border:`1px solid ${C.line}`,borderRadius:17,background:'#0a1424',padding:20,boxSizing:'border-box',height:490}}>
     <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontSize:23,fontWeight:850}}>Incident timeline</div><span style={{fontSize:15,color:C.mute,fontFamily:'monospace'}}>00:01 → 00:35</span></div>
     <div style={{height:5,background:C.line,borderRadius:5,marginTop:14,overflow:'hidden'}}><div style={{height:'100%',width:`${progress*100}%`,background:`linear-gradient(90deg,${C.cyan},${C.blue})`}}/></div>
     {SECTIONS.map(([h,t,n,at],i)=><Rev key={h} at={at} d={.28} style={{display:'grid',gridTemplateColumns:'42px 1fr',gap:14,marginTop:20}}>
      <div style={{width:38,height:38,borderRadius:12,display:'grid',placeItems:'center',background:i===0?C.red+'20':i===1?C.orange+'20':C.cyan+'18',border:`1px solid ${i===0?C.red:i===1?C.orange:C.cyan}55`,color:i===0?C.red:i===1?C.orange:C.cyan,fontSize:15,fontWeight:850}}>{n}</div>
      <div><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{fontSize:22,fontWeight:850}}>{h}</div><span style={{fontSize:14,color:C.mute,fontFamily:'monospace'}}>{['00:01','00:09','00:28','NEXT'][i]}</span></div><div style={{fontSize:19,lineHeight:1.38,color:C.mute,marginTop:5}}>{t}</div></div>
     </Rev>)}
     <div style={{display:'flex',alignItems:'center',gap:10,marginTop:22,padding:'12px 14px',background:C.green+'10',border:`1px solid ${C.green}44`,borderRadius:12}}><Check c={C.green} size={22}/><span style={{fontSize:17,color:C.green,fontWeight:750}}>Recovery verified · checkout returned to SLO</span></div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
     <div style={{border:`1px solid ${C.line}`,borderRadius:17,background:'#0a1424',padding:20,boxSizing:'border-box',height:226}}>
      <div style={{fontSize:22,fontWeight:850}}>Service impact</div>
      <div style={{display:'flex',alignItems:'center',gap:12,marginTop:17}}><div style={{width:12,height:12,borderRadius:'50%',background:C.red,boxShadow:`0 0 14px ${C.red}66`}}/><div style={{fontSize:19,fontWeight:750}}>checkout-api</div><span style={{marginLeft:'auto',fontSize:15,color:C.red,fontWeight:800}}>DEGRADED</span></div>
      <div style={{height:9,background:C.line,borderRadius:9,marginTop:12,overflow:'hidden'}}><div style={{width:`${Math.max(0,100-65*progress)}%`,height:'100%',background:`linear-gradient(90deg,${C.red},${C.orange})`,borderRadius:9}}/></div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:15,color:C.mute,marginTop:7}}><span>Elevated latency</span><span>Recovered</span></div>
      <div style={{borderTop:`1px solid ${C.line}`,marginTop:15,paddingTop:13,fontSize:17,color:C.mute}}>Dependency: <b style={{color:C.text}}>payments-db</b> · pool pressure / retry amplification</div>
     </div>
     <div style={{border:`1px solid ${C.line}`,borderRadius:17,background:'#0a1424',padding:20,boxSizing:'border-box',height:248}}>
      <div style={{fontSize:22,fontWeight:850}}>Corrective actions</div>
      {['Add pool saturation alert|Platform · open','Set retry budget / backoff|App SRE · planned','Update checkout runbook|Incident lead · pending'].map((entry,i)=>{const [a,b]=entry.split('|');return <Rev key={a} at={CUE.follow+i*.18} d={.22} style={{display:'flex',alignItems:'center',gap:10,marginTop:14,paddingBottom:11,borderBottom:i<2?`1px solid ${C.line}`:undefined}}>
       <span style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${C.cyan}88`,display:'grid',placeItems:'center',color:C.cyan,fontSize:13}}>✓</span><div style={{flex:1}}><div style={{fontSize:17,fontWeight:750}}>{a}</div><div style={{fontSize:14,color:C.mute,marginTop:3}}>{b}</div></div>
      </Rev>})}
     </div>
    </div>
   </div>
   <Rev at={CUE.human} d={.25} style={{position:'absolute',left:28,right:28,bottom:22,display:'flex',alignItems:'center',justifyContent:'space-between',gap:18,border:`1px solid ${C.yellow}66`,background:'#211c12',borderRadius:15,padding:'14px 20px',fontSize:20,fontWeight:700}}>
    <span>Human review required before publication</span><span style={{minWidth:250,height:48,boxSizing:'border-box',borderRadius:12,display:'grid',placeItems:'center',fontWeight:800,background:pub?C.green+'24':C.panel2,border:`1.5px solid ${pub?C.green:C.cyan}`,color:pub?C.green:C.text}}>{pub?'Published · approved':'Review and publish'}</span>
   </Rev>
  </Panel>
  <Cursor pts={[[121.2,1000,720],[CUE.publish,1510,1000,1]]}/>
  <Pop at={CUE.publish+.1} until={123.5} from={[1510,1000]} w={820}><div style={{display:'flex',alignItems:'center',gap:20}}><Check size={56}/><span style={{fontSize:42,fontWeight:850}}>Published after human review</span></div></Pop>
 </AppFrame>;
};
