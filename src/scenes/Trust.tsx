import React from 'react';
import {At, Fill, LogoImg, LogoPop, Lock, Rev, Tag, logo, ramp, useSec} from '../kit';
import {C} from '../theme';
import {CUE} from '../timing';

const Box=({x,y,w,h,c=C.line,children}:{x:number;y:number;w:number;h:number;c?:string;children?:React.ReactNode})=><At x={x} y={y} w={w} h={h} style={{boxSizing:'border-box',border:`1.5px solid ${c}`,borderRadius:18,background:C.panel,padding:20}}>{children}</At>;
export const Trust=()=>{
 const s=useSec(); const guard=ramp(s,CUE.guardrails,0.7);
 const azureFocus=s>=CUE.azure&&s<CUE.azure+1.35; const awsFocus=s>=CUE.bedrock&&s<CUE.bedrock+1.35;
 return <Fill>
  <At x={140} y={78} style={{fontSize:54,fontWeight:850}}>Your environment, your rules</At>
  <At x={140} y={170} w={1060} h={820} style={{boxSizing:'border-box',border:`2px dashed ${C.cyan}88`,borderRadius:25}}><div style={{position:'absolute',left:24,top:15,fontSize:23,color:C.cyan,fontWeight:750}}>CUSTOMER KUBERNETES CLUSTER</div></At>
  <Rev at={88.9}><Box x={195} y={245} w={290} h={180} c={C.violet}><LogoImg n="velai-symbol" h={68}/><div style={{fontSize:24,fontWeight:750,marginTop:8}}>VelAI agent</div><div style={{fontSize:16,color:C.mute,marginTop:4}}>Advisory · read-only</div></Box></Rev>
  <Rev at={89.6}><Box x={520} y={245} w={610} h={180}><div style={{fontSize:16,color:C.mute,letterSpacing:1}}>INFERENCE CONFIGURATION</div><div style={{fontSize:31,fontWeight:850,marginTop:7}}>Your own models</div><div style={{fontSize:20,color:C.mute,marginTop:4}}>vLLM · Ollama · TGI</div><div style={{display:'flex',gap:8,marginTop:15}}><Tag c={C.cyan}>Tenant-managed</Tag><Tag c={C.green}>Model choice retained</Tag></div></Box></Rev>
  <Rev at={CUE.noWrite}><Box x={520} y={455} w={610} h={140} c={C.red}><div style={{display:'flex',alignItems:'center',gap:10,fontSize:24,fontWeight:800}}><Lock c={C.red}/>Production boundary</div><div style={{fontSize:18,color:C.red,marginTop:6}}>No agent-held production write credentials</div><div style={{fontSize:15,color:C.mute,marginTop:4}}>Customer-owned identity · human approval gates</div></Box></Rev>
  <Rev at={CUE.writes}><Box x={195} y={455} w={290} h={140} c={C.green}>
    <div style={{fontSize:15,color:C.green,letterSpacing:1.1,fontWeight:750}}>SCOPED WRITE ACTIONS</div>
    <div style={{display:'flex',alignItems:'center',gap:10,marginTop:9,minWidth:0}}>
      <div style={{width:34,height:34,flex:'none',display:'grid',placeItems:'center',background:'#0b1c31',borderRadius:8,border:`1px solid ${C.line}`}}><LogoImg n="jira-mark" h={24}/></div>
      <div style={{fontSize:17,fontWeight:800,lineHeight:1.15,whiteSpace:"nowrap"}}>Tickets &amp; chat</div>
    </div>
    <div style={{fontSize:15,color:C.mute,lineHeight:1.35,marginTop:8}}>Permitted, scoped actions only</div>
  </Box></Rev>
  <Rev at={CUE.guardrails-0.2}><At x={195} y={625} w={935} h={250} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,opacity:0.75+0.25*guard}}>
    <div style={{border:`1px solid ${C.line}`,borderRadius:16,padding:20,background:C.panel}}><div style={{fontSize:17,color:C.mute,letterSpacing:1}}>MODEL OUTPUT</div><div style={{fontSize:27,fontWeight:800,marginTop:10}}>Advisory only</div><div style={{fontSize:18,color:C.mute,marginTop:7}}>Suggests diagnosis and next steps.</div></div>
    <div style={{border:`2px solid ${C.cyan}`,borderRadius:16,padding:20,background:C.cyan+'0c',boxShadow:`0 0 ${38*guard}px ${C.cyan}30`}}><div style={{display:'flex',alignItems:'center',gap:10,fontSize:17,color:C.cyan,letterSpacing:1}}><Lock c={C.cyan}/>ENFORCEMENT LAYER</div><div style={{fontSize:27,fontWeight:800,marginTop:10}}>Policy + approval</div><div style={{fontSize:18,color:C.mute,marginTop:7}}>Authorization gates tools before execution.</div></div>
    <div style={{gridColumn:'1 / span 2',border:`1px solid ${C.line}`,borderRadius:15,padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#0b1728'}}><span style={{fontSize:19}}>Audit trail</span><span style={{fontSize:17,color:C.mute}}>Decision · actor · timestamp · action outcome</span><Tag c={C.green}>Traceable</Tag></div>
  </At></Rev>
  <Rev at={CUE.azure-0.4}><Box x={1260} y={190} w={560} h={340} c={C.line}><div style={{fontSize:20,color:C.mute}}>DOCUMENTED MODEL OPTIONS · CUSTOMER TENANT</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginTop:28}}><div style={{background:C.panel2,border:`1px solid ${C.line}`,borderRadius:14,padding:18,opacity:azureFocus?0.12:1}}><LogoImg n="azure-logo" h={76}/><div style={{fontSize:27,fontWeight:800,marginTop:12}}>Azure</div><div style={{fontSize:15,color:C.mute}}>Cloud platform</div></div><div style={{background:C.panel2,border:`1px solid ${C.line}`,borderRadius:14,padding:18}}><div style={{height:76,display:'grid',placeItems:'center',fontSize:38,fontWeight:900,color:C.text}}>OpenAI</div><div style={{fontSize:27,fontWeight:800,marginTop:12}}>OpenAI</div><div style={{fontSize:15,color:C.mute}}>Model provider</div></div></div><div style={{fontSize:15,color:C.mute,marginTop:14}}>Azure-hosted OpenAI models are a deployment relationship, not a single brand mark.</div></Box></Rev>
  <Rev at={CUE.bedrock-0.4}><Box x={1260} y={610} w={560} h={340} c={C.line}><div style={{fontSize:20,color:C.mute}}>DOCUMENTED ALTERNATIVE · YOUR TENANT</div><div style={{marginTop:24,opacity:awsFocus?0.12:1}}><LogoImg n="aws-logo" h={100}/><div style={{fontSize:31,fontWeight:800,marginTop:12}}>AWS Bedrock</div><div style={{fontSize:16,color:C.mute,marginTop:4}}>Customer-managed provider option</div></div></Box></Rev>
  <LogoPop src={logo('azure-logo')} label="Azure" at={CUE.azure} x={960} y={540} size={230} hold={0.55} returnTo={[1400,300]}/>
  <LogoPop node={<div style={{width:230,height:230,display:'grid',placeItems:'center',fontSize:58,fontWeight:900,letterSpacing:-2,color:'#fff',background:'linear-gradient(145deg,#111827,#263b59)',border:'1px solid #6aa8ff',borderRadius:36}}>OpenAI</div>} label="OpenAI" at={CUE.azure+0.85} x={960} y={540} size={230} hold={0.55} returnTo={[1680,300]}/>
  <LogoPop src={logo('aws-logo')} label="AWS Bedrock" at={CUE.bedrock} x={960} y={540} size={260} hold={0.82} returnTo={[1540,715]}/>
 </Fill>;
};
