import React from 'react';
import {AppFrame, At, Check, Cursor, LogoImg, LogoPop, Panel, Pop, Rev, Tag, logo, ramp, usePop, useSec} from '../kit';
import {C, grad} from '../theme';
import {CUE} from '../timing';

const PEOPLE: [string, string][] = [['AR', 'Incident lead'], ['MK', 'App SRE'], ['SL', 'Platform SRE'], ['JT', 'Support']];
const LINES: [string,string,number][] = [['AR','Latency on checkout started around midnight.',41.9],['MK','Pool metrics look saturated on payments-db.',43.25],['SL','No deploys in the last six hours.',44.6],['AR','Hold the rollback for now.',45.95],['MK','Retries are amplifying the load.',47.3]];
const BTN: [string, number, number][] = [['Approve', 26, CUE.approve], ['Edit', 186, CUE.approve + 0.9], ['Skip', 346, CUE.approve + 1.7]];

const Avatar = ({t, c = C.blue, active = false}: {t: string; c?: string; active?: boolean}) => (
  <div style={{position:'relative',width:56,height:56,borderRadius:'50%',background:`linear-gradient(145deg,${c},${C.panel2})`,display:'grid',placeItems:'center',fontSize:21,fontWeight:800,flex:'none',border:`1px solid ${active?C.green:C.line}`,boxShadow:active?`0 0 0 4px ${C.green}22`:undefined}}>
    {t}<span style={{position:'absolute',right:-2,bottom:-2,width:17,height:17,borderRadius:'50%',background:active?C.green:C.mute,border:`3px solid ${C.panel}`,display:'grid',placeItems:'center',fontSize:9,color:'#fff'}}>{active?'●':'·'}</span>
  </div>
);

export const WarRoom = () => {
  const s = useSec();
  const join = usePop(CUE.joins);
  const done = s >= CUE.approveClick;
  return (
    <AppFrame active="Incidents">
      {PEOPLE.map(([t, r], i) => (
        <Panel key={t} x={64 + i * 320} y={116} w={300} h={116} style={{display: 'flex', alignItems: 'center', gap: 16, padding: 20}}>
          <Avatar t={t} active={i===0 && s>=CUE.transcribe} /><div><div style={{fontSize:22,fontWeight:700}}>{r}</div><div style={{fontSize:17,color:C.mute,marginTop:4}}>{t} · {i===0?'Incident lead':'Responder'}</div></div>
        </Panel>
      ))}
      <At x={1344} y={116} w={512} h={116} style={{opacity: Math.min(1, join), transform: `scale(${0.85 + 0.15 * join})`, boxSizing: 'border-box', borderRadius: 18, padding: 3, background: grad}}>
        <div style={{height: '100%', borderRadius: 16, background: C.panel, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px'}}>
          <LogoImg n="velai-symbol" h={56} /><div><div style={{fontSize: 26, fontWeight: 700}}>VelAI</div><div style={{fontSize: 20, color: C.green}}>Joined the war room call</div></div>
        </div>
      </At>

      <Panel x={64} y={268} w={720} h={700}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><span style={{fontSize: 30, fontWeight: 700}}>Live transcript</span><Rev at={CUE.transcribe}><Tag c={C.green}>Transcribed in your cluster</Tag></Rev></div>
        {LINES.map(([a,t,at],i)=>{
          const n=Math.min(t.length,Math.max(0,Math.floor((s-at)*72)));
          return <Rev key={t} at={at} d={.2} style={{display:'flex',gap:14,alignItems:'flex-start',marginTop:19}}>
            <Avatar t={a} c={a==='AR'?C.violet:C.blue} active={s>=at && s<at+1.3}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:7}}><span style={{fontSize:19,fontWeight:750,color:a==='AR'?C.violet:C.cyan}}>{PEOPLE.find(([id])=>id===a)?.[1]||'Responder'}</span><span style={{fontSize:16,color:C.mute,fontFamily:'monospace'}}>{`00:${String(Math.floor(at)).padStart(2,'0')}`}</span><span style={{marginLeft:'auto',fontSize:16,color:s>=at&&s<at+1.3?C.green:C.mute}}>{s>=at&&s<at+1.3?'● SPEAKING':'✓ captured'}</span></div>
              <div style={{fontSize:23,lineHeight:1.4,background:i%2===0?C.panel2:'#0d192b',border:`1px solid ${C.line}`,borderRadius:'4px 16px 16px 16px',padding:'14px 18px',minHeight:34}}>{t.slice(0,n)}{n<t.length&&s>=at?<span style={{color:C.cyan,opacity:s%0.8<.4?0:1}}>▍</span>:null}</div>
            </div>
          </Rev>;
        })}
      </Panel>

      <Panel x={816} y={268} w={520} h={700}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><span style={{fontSize: 30, fontWeight: 700}}>Interval summary</span><Tag c={done ? C.green : C.yellow}>{done ? 'Approved' : 'AI draft'}</Tag></div>
        {['Checkout p99 above SLO since 00:02.', 'Likely cause under review: pool saturation on payments-db.', 'Rollback on hold. Retries amplify load.'].map((t, i) => (
          <Rev key={t} at={CUE.summary + i * 0.9} style={{fontSize: 26, lineHeight: 1.4, marginTop: 28}}>{t}</Rev>
        ))}
        <Rev at={CUE.approve} style={{position:'absolute',left:26,right:26,top:570,fontSize:17,color:C.mute,letterSpacing:1}}>HUMAN DECISION · APPROVE / EDIT / SKIP</Rev>
        {BTN.map(([t, x, at], i) => {
          const hot = ramp(s, at, 0.2) * (1 - ramp(s, at + 0.8, 0.2));
          const ok = i === 0 && done;
          return (
            <At key={t} x={x} y={616} w={148} h={64} style={{boxSizing: 'border-box', borderRadius: 14, display: 'grid', placeItems: 'center', fontSize: 23, fontWeight: 750, opacity:ramp(s,at,0.22), transform: `scale(${1 + 0.08 * hot})`, border: `2px solid ${ok ? C.green : hot > 0.4 ? C.cyan : C.line}`, background: ok ? C.green + '33' : hot > 0.4 ? C.cyan + '22' : C.panel2}}>{t}</At>
          );
        })}
      </Panel>

      <Panel x={1368} y={268} w={488} h={700} style={{background:'linear-gradient(155deg,#15213a,#0e1728)',padding:22}}>
        <Rev at={CUE.jira} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,transform:`translateY(${s<CUE.jira?12:0}px)`}}>
          <LogoImg n="jira-logo" h={42}/><Tag c={C.blue}>Issue created</Tag>
        </Rev>
        <div style={{fontSize:25,fontWeight:800,marginTop:18,lineHeight:1.25}}>OPS-1873</div>
        <div style={{fontSize:21,color:C.mute,marginTop:6}}>Checkout latency · incident follow-up</div><div style={{display:'flex',gap:12,marginTop:12,fontSize:17,color:C.mute}}><span>Project <b style={{color:C.text}}>OPS</b></span><span>·</span><span>Assignee <b style={{color:C.text}}>On-call SRE</b></span></div>
        <div style={{margin:'16px 0',display:'flex',gap:10,flexWrap:'wrap'}}><Tag c={C.blue}>In progress</Tag><Tag c={C.orange}>P2</Tag></div>
        <div style={{borderTop:`1px solid ${C.line}`,paddingTop:16,fontSize:19,color:C.mute}}>CREATED FROM</div>
        <div style={{fontSize:22,fontWeight:700,marginTop:6}}>INC-2041</div>
        <Rev at={CUE.jira+0.5} style={{marginTop:22,background:C.panel2,borderRadius:14,padding:16}}>
          <div style={{fontSize:17,color:C.mute,letterSpacing:1}}>AUTOMATED DRAFT</div>
          <div style={{fontSize:20,lineHeight:1.35,marginTop:7}}>Investigate checkout p99 and payments-db pool saturation.</div><div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}><Tag c={C.cyan}>Evidence linked</Tag><Tag c={C.yellow}>Needs human review</Tag></div>
        </Rev>
        <Rev at={CUE.approveClick+0.3} style={{marginTop:18,border:`1px solid ${C.green}66`,background:C.green+'12',borderRadius:14,padding:16,display:'flex',gap:12,alignItems:'center'}}>
          <Check/><div><div style={{fontSize:21,fontWeight:750}}>Summary posted</div><div style={{fontSize:17,color:C.mute}}>After human approval</div></div>
        </Rev>
      </Panel>

      <Cursor pts={[[52.9, 1120, 640], [CUE.approveClick, 942, 916, 1]]} />
      <Pop at={CUE.approveClick + 0.15} until={58.9} from={[942, 916]} w={880}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}><Check size={56} /><span style={{fontSize: 44, fontWeight: 800}}>Summary approved</span></div>
        <div style={{fontSize: 30, color: C.mute, margin: '22px 0', lineHeight: 1.45}}>Posted to the incident channel and added to OPS-1873. The incident lead decided. Nobody took notes.</div>
        <Tag c={C.green}>Human-approved</Tag>
      </Pop>
    </AppFrame>
  );
};
