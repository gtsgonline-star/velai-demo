import React from 'react';
import {AppFrame, At, Cursor, LogoImg, Lock, Panel, Rev, Tag, TeamsMark, ramp, useSec} from '../kit';
import {C} from '../theme';
import {CUE} from '../timing';

const QUESTION='@VelAI why is checkout slow right now?';
const Chip=({children,c=C.cyan}:{children:React.ReactNode;c?:string})=><span style={{border:`1px solid ${c}55`,background:c+'12',color:c,borderRadius:9,padding:'7px 12px',fontSize:17,fontWeight:650}}>{children}</span>;
export const Assistant=()=>{
 const s=useSec(); const tab=s<CUE.teams?0:s<CUE.console?1:2;
 const typed=QUESTION.slice(0,Math.max(0,Math.floor((s-CUE.ask)*25)));
 return <AppFrame active="Assistant">
  <Panel x={250} y={124} w={1420} h={924} style={{padding:0,overflow:'hidden'}}>
   <div style={{display:'flex',height:74,borderBottom:`1px solid ${C.line}`}}>
    {[['slack-logo','Slack'],['teams','Microsoft Teams'],['velai-symbol','Console']].map(([asset,name],i)=><div key={name} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:12,fontSize:23,fontWeight:700,background:tab===i?C.panel2:'transparent',borderBottom:`3px solid ${tab===i?C.cyan:'transparent'}`}}>
      {asset==='teams'?<span style={{width:26,height:26}}><TeamsMark/></span>:<LogoImg n={asset} h={25}/>} {name}
    </div>)}
   </div>
   <div style={{padding:'30px 36px'}}>
    <div style={{display:'flex',gap:15,alignItems:'center',minHeight:58}}><div style={{width:46,height:46,borderRadius:'50%',background:C.blue,display:'grid',placeItems:'center',fontWeight:800,fontSize:18}}>JT</div><div><div style={{fontSize:15,color:C.mute}}>INCIDENT CHANNEL · 00:02</div><div style={{fontSize:26}}>{typed}</div></div></div>
    <Rev at={CUE.slack-0.8} style={{display:'flex',gap:15,marginTop:24}}>
      <div style={{width:46,height:46,borderRadius:14,background:C.cyan+'18',border:`1px solid ${C.cyan}55`,display:'grid',placeItems:'center',fontSize:17,fontWeight:850,color:C.cyan}}>AI</div>
      <div style={{background:C.panel2,borderRadius:'5px 16px 16px 16px',padding:'22px 25px',flex:1}}>
       <div style={{fontSize:15,color:C.cyan,letterSpacing:1.3,fontWeight:750}}>VELAI · INCIDENT CONTEXT</div>
       <div style={{fontSize:25,lineHeight:1.42,marginTop:9}}>Checkout p99 is <b>2.4 s</b>. The leading hypothesis is payments-db connection-pool saturation (<b>82% relative score</b>).</div>
       <div style={{display:'flex',gap:9,marginTop:16,flexWrap:'wrap'}}><Chip>Prometheus · pool 92%</Chip><Chip>Grafana · p99 trend</Chip><Chip c={C.orange}>OpenSearch · 412 timeouts</Chip><Chip c={C.green}>Kubernetes · pod restarts</Chip></div>
      </div>
    </Rev>
    <Rev at={CUE.scoped} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginTop:20}}>
      {[['Signal','SLO breach · checkout-api'],['Likely dependency','payments-db'],['Recommended check','Pool wait + active/max']].map(([h,t])=><div key={h} style={{border:`1px solid ${C.line}`,background:'#0c1829',borderRadius:13,padding:15}}><div style={{fontSize:14,color:C.mute,letterSpacing:1}}>{h.toUpperCase()}</div><div style={{fontSize:19,fontWeight:700,marginTop:7}}>{t}</div></div>)}
    </Rev>
    <Rev at={CUE.scoped+0.65} style={{marginTop:18,border:`1px solid ${C.green}66`,background:C.green+'0c',borderRadius:14,padding:'15px 19px',display:'flex',alignItems:'center',gap:12}}>
      <Lock c={C.green} size={24}/><div style={{flex:1}}><div style={{fontSize:20,fontWeight:750}}>Permission-aware response</div><div style={{fontSize:17,color:C.mute,marginTop:3}}>Only incident data within your access scope is used. No production write action was taken.</div></div><Chip c={C.green}>Read-only</Chip>
    </Rev>
    <Rev at={CUE.scoped+1.2} style={{marginTop:20}}>
      <div style={{fontSize:15,color:C.mute,letterSpacing:1.5,fontWeight:750}}>INVESTIGATION THREAD · LIVE UPDATES</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:10}}>
       {[['00:02:14','Alert correlated','5 signals → INC-2041'],['00:02:18','Hypothesis ranked','Pool saturation leads'],['00:02:21','Next step suggested','Validate pool pressure']].map(([time,h,t],i)=><div key={time} style={{borderLeft:`3px solid ${i===2?C.violet:C.cyan}`,padding:'8px 13px',background:C.panel+'88'}}><div style={{fontSize:14,color:C.mute,fontFamily:'monospace'}}>{time}</div><div style={{fontSize:18,fontWeight:750,marginTop:4}}>{h}</div><div style={{fontSize:16,color:C.mute,marginTop:3}}>{t}</div></div>)}
      </div>
    </Rev>
   </div>
  </Panel>
  <Cursor pts={[[79.4,900,520],[CUE.slack,560,162,1],[CUE.teams,960,162,1],[CUE.console,1360,162,1]]}/>
 </AppFrame>;
};
