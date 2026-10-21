import React from 'react';
import {AppFrame, At, Cursor, OpenSearchMark, LogoImg, LogoPop, Lock, Panel, Pop, Rev, Tag, logo, ramp, useSec} from '../kit';
import {C} from '../theme';
import {CUE} from '../timing';

const SOURCES: [string, string, number][] = [
  ['prometheus-logo', 'Prometheus', CUE.invProm],
  ['grafana-logo', 'Grafana', CUE.grafana],
  ['kubernetes-logo', 'Kubernetes', CUE.kubernetes],
  ['opensearch-mark', 'OpenSearch', CUE.opensearch],
];
const HYP: [string, number, [string, string][]][] = [
  ['Connection pool saturation on payments-db', 82, [['prometheus-logo', 'pool_in_use · 92%'], ['grafana-logo', 'latency panel rising'], ['opensearch-mark', '412 timeout events'], ['kubernetes-logo', 'pod restarts']]],
  ['Retry storm from checkout-web', 54, [['opensearch-mark', 'retry spike'], ['grafana-logo', 'request rate elevated']]],
  ['Recent configuration change', 21, [['kubernetes-logo', 'pod configuration reviewed']]],
];

export const Investigate = () => {
  const s = useSec();
  return (
    <AppFrame active="Incidents">
      <Panel x={64} y={124} w={1130} h={924} style={{padding:26}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontSize:17,color:C.mute,letterSpacing:2}}>ROOT-CAUSE ANALYSIS</div><div style={{fontSize:32,fontWeight:800,marginTop:5}}>Investigation · INC-2041</div></div>
          <Tag c={C.green}><Lock size={19}/> Read-only</Tag>
        </div>
        {HYP.map(([title,score,evidence],i)=>{
          const at=CUE.patterns+i*1.5;
          const p=ramp(s,at+0.15,0.9);
          const primary=i===0;
          return <Rev key={title} at={at} style={{marginTop:primary?22:16,background:primary?'linear-gradient(130deg,#172b47,#122038)':C.panel2,borderRadius:17,padding:22,border:`1px solid ${primary?C.cyan+'77':C.line}`,boxShadow:primary?`0 0 26px ${C.cyan}12`:undefined,height:primary?340:190,boxSizing:'border-box'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:18}}>
              <div style={{display:'flex',gap:12,alignItems:'center'}}><span style={{width:34,height:34,borderRadius:10,display:'grid',placeItems:'center',background:primary?C.cyan+'22':C.line,color:primary?C.cyan:C.mute,fontWeight:800}}>{String(i+1).padStart(2,'0')}</span><div><div style={{fontSize:primary?27:24,fontWeight:800}}>{title}</div><div style={{fontSize:16,color:C.mute,marginTop:4}}>{primary?'LEADING HYPOTHESIS':'ALTERNATIVE HYPOTHESIS'}</div></div></div>
              <div style={{textAlign:'right',flex:'none'}}><div style={{fontSize:30,fontWeight:850,color:primary?C.cyan:C.mute}}>{score}%</div><div style={{fontSize:15,color:C.mute}}>relative score</div></div>
            </div>
            <div style={{height:8,borderRadius:8,background:C.line,margin:'14px 0 16px',overflow:'hidden'}}><div style={{height:'100%',width:`${score*p}%`,background:primary?`linear-gradient(90deg,${C.cyan},${C.violet})`:C.mute,borderRadius:8}}/></div>
            <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>{evidence.map(([source,label])=><span key={label} style={{display:'flex',alignItems:'center',gap:8,border:`1px solid ${C.line}`,background:'#0b1728',borderRadius:10,padding:'7px 11px',fontSize:17}}>{source==='opensearch-mark'?<OpenSearchMark size={22}/>:<LogoImg n={source} h={22}/>} {label}</span>)}</div>
            {primary&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:18}}>
              <div style={{background:'#0b1728',borderRadius:12,padding:13}}><div style={{fontSize:15,color:C.mute,letterSpacing:1}}>CORRELATED WINDOW</div><div style={{fontSize:19,fontWeight:700,marginTop:5}}>00:01–00:11 · 5 min metrics</div></div>
              <div style={{background:C.cyan+'0c',border:`1px solid ${C.cyan}44`,borderRadius:12,padding:13}}><div style={{fontSize:15,color:C.cyan,letterSpacing:1}}>NEXT VALIDATION</div><div style={{fontSize:18,fontWeight:650,marginTop:5}}>Check connection-acquire wait and active/max pool counts.</div></div>
            </div>}
          </Rev>;
        })}
      </Panel>
      <Panel x={1226} y={124} w={630} h={924} style={{padding:26}}>
        <div style={{fontSize:30,fontWeight:800}}>Evidence sources</div><div style={{fontSize:17,color:C.mute,marginTop:5}}>Queried for INC-2041 · read-only</div>
        {SOURCES.map(([asset,name,at], index)=>{
          const active=s>=at&&s<at+1.05;
          const landed=s>=at+1.04;
          const highlighted=active;
          const tileX = index % 2 === 0 ? 34 : 329;
          const tileY = index < 2 ? 108 : 398;
          return <At key={name} x={tileX} y={tileY} w={270} h={238} style={{boxSizing:'border-box',borderRadius:17,border:`1.5px solid ${highlighted?C.cyan+'77':C.line}`,background:highlighted?C.cyan+'08':C.panel2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,opacity:1,transform:active?'translateY(-3px) scale(1.015)':'translateY(0) scale(1)',transition:'none',filter:active?'drop-shadow(0 0 14px '+C.cyan+'66)':'none'}}>
            <div style={{display:'grid',placeItems:'center',height:76}}>
              {asset==='opensearch-mark'?<OpenSearchMark size={76}/>:<LogoImg n={asset} h={76}/>}
            </div><div style={{fontSize:21,fontWeight:750,textAlign:'center'}}>{name}</div><div style={{fontSize:15,color:active?C.cyan:C.mute}}>{active?'QUERY COMPLETE':landed?'Queried · read-only':'Source connector'}</div>
          </At>;
        })}
        <div style={{position:'absolute',left:26,right:26,bottom:26,borderTop:`1px solid ${C.line}`,paddingTop:18,fontSize:19,color:C.mute,lineHeight:1.45}}>Evidence is linked to each hypothesis. Scores guide investigation; they are not calibrated probabilities.</div>
      </Panel>
      {SOURCES.map(([asset,name,at])=><LogoPop key={name} src={asset==='opensearch-mark'?undefined:logo(asset)} node={asset==='opensearch-mark'?<OpenSearchMark size={230}/>:undefined} label={name} at={at} x={960} y={540} size={230} hold={0.34} stay returnTo={name==='Prometheus'?[1395,316]:name==='Grafana'?[1690,316]:name==='Kubernetes'?[1395,606]:[1690,606]}/>)}
      <Cursor pts={[[71.8,1400,900],[CUE.evClick,640,350,1]]}/>
      <Pop at={CUE.evClick+0.1} until={75.7} from={[640,350]} w={940}>
        <div style={{fontSize:38,fontWeight:850}}>Evidence review · payments-db pool saturation</div>
        {[['prometheus-logo','pool_in_use reached 92% in the incident window'],['grafana-logo','p99 and pool pressure rise together'],['kubernetes-logo','pod restarts correlate with the incident'],['opensearch-mark','412 timeout events in the sampled interval']].map(([l,t])=><div key={t} style={{display:'flex',alignItems:'center',gap:18,fontSize:24,marginTop:17}}>{l==='opensearch-mark'?<OpenSearchMark size={34}/>:<LogoImg n={l} h={34}/>} {t}</div>)}
        <div style={{marginTop:24}}><Tag c={C.yellow}>Validate against live telemetry before action</Tag></div>
      </Pop>
    </AppFrame>
  );
};
