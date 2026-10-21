import React from 'react';
import {Composition} from 'remotion';
import {VelAIDemo} from './Video';
import {FPS, TOTAL_FRAMES} from './timing';

export const Root: React.FC = () => (
  <Composition id="VelAIDemo" component={VelAIDemo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
);
