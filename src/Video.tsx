import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Camera, SecCtx} from './kit';
import {CAMS} from './camera';
import {C, sans} from './theme';
import {FPS, SCENES} from './timing';
import {Intro} from './scenes/Intro';
import {Signal} from './scenes/Signal';
import {Correlate} from './scenes/Correlate';
import {WarRoom} from './scenes/WarRoom';
import {Investigate} from './scenes/Investigate';
import {Assistant} from './scenes/Assistant';
import {Trust} from './scenes/Trust';
import {Postmortem} from './scenes/Postmortem';
import {Outcomes} from './scenes/Outcomes';
import {Cta} from './scenes/Cta';

const LIST: [keyof typeof SCENES, React.FC][] = [
  ['intro', Intro], ['signal', Signal], ['correlate', Correlate], ['warroom', WarRoom], ['investigate', Investigate],
  ['assistant', Assistant], ['trust', Trust], ['postmortem', Postmortem], ['outcomes', Outcomes], ['cta', Cta],
];

const SceneFade = ({dur, children}: {dur: number; children?: React.ReactNode}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{children}</AbsoluteFill>;
};

export const VelAIDemo: React.FC = () => {
  const demoFrom = Math.round(SCENES.signal[0] * FPS);
  const demoTo = Math.round(SCENES.postmortem[1] * FPS);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Audio src={staticFile('voiceover.wav')} />
      {LIST.map(([k, Comp]) => {
        const from = Math.round(SCENES[k][0] * FPS);
        const dur = Math.round(SCENES[k][1] * FPS) - from;
        return (
          <Sequence key={k} from={from} durationInFrames={dur}>
            <SecCtx.Provider value={from / FPS}><SceneFade dur={dur}>{CAMS[k] ? <Camera keys={CAMS[k]!}><Comp /></Camera> : <Comp />}</SceneFade></SecCtx.Provider>
          </Sequence>
        );
      })}
      <Sequence from={demoFrom} durationInFrames={demoTo - demoFrom}>
        <div style={{position: 'absolute', right: 48, bottom: 20, fontFamily: sans, fontSize: 18, color: C.mute, opacity: 0.75, zIndex: 200}}>Illustrative demo data</div>
      </Sequence>
    </AbsoluteFill>
  );
};
