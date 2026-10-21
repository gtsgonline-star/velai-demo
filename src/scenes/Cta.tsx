import React from 'react';
import {Img} from 'remotion';
import {At, Fill, logo, ramp, useSec} from '../kit';
import {C, grad} from '../theme';
import {CUE} from '../timing';

export const Cta = () => {
  const s = useSec();
  const a = (at: number) => ramp(s, at, 0.7);
  return (
    <Fill>
      <At x={0} y={0} w={1920} h={1080} style={{background: `radial-gradient(1000px 700px at 50% 35%, ${C.blue}24, ${C.cyan}10 38%, transparent 72%)`}} />
      <At x={0} y={90} w={1920} style={{textAlign: 'center', opacity: a(CUE.velai), transform: `scale(${0.9 + 0.1 * a(CUE.velai)})`}}>
        <Img src={logo('velai-symbol')} style={{height: 230}} />
        <div style={{fontSize: 90, fontWeight: 800, letterSpacing: 8}}>VelAI</div>
      </At>
      <At x={0} y={470} w={1920} style={{textAlign: 'center', fontSize: 104, fontWeight: 800, opacity: a(CUE.runs), transform: `translateY(${(1 - a(CUE.runs)) * 30}px)`}}>Runs the incident.</At>
      <At x={0} y={600} w={1920} style={{textAlign: 'center', fontSize: 104, fontWeight: 800, opacity: a(CUE.never), transform: `translateY(${(1 - a(CUE.never)) * 30}px)`}}>
        <span style={{background: grad, WebkitBackgroundClip: 'text', color: 'transparent'}}>Never touches production.</span>
      </At>
      <At x={0} y={780} w={1920} style={{textAlign: 'center', opacity: a(CUE.see), fontSize: 36, color: C.mute}}>See how VelAI runs your next incident</At>
      <At x={0} y={840} w={1920} style={{textAlign: 'center', opacity: a(CUE.url), transform: `scale(${0.94 + 0.06 * a(CUE.url)})`}}>
        <span style={{display: 'inline-block', padding: '14px 44px', borderRadius: 22, border: `2px solid ${C.cyan}`, background: C.cyan + '1a', fontSize: 64, fontWeight: 700}}>guhatek.com/velai</span>
      </At>
    </Fill>
  );
};
