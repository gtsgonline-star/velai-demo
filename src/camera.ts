import type {CamKey} from './kit';
import {CUE, SCENES} from './timing';

const FLAT = {rx: 0, ry: 0, s: 1, x: 0, y: 0, fx: 960, fy: 540};

// Tilted fly-in, then (optionally) zoom toward the element that gets clicked, then pull back.
const fly = (name: keyof typeof SCENES, click?: [number, number, number]): CamKey[] => {
  const [a, b] = SCENES[name];
  const k: CamKey[] = [[a, {rx: 16, ry: -22, s: 0.82, x: -100, y: 50, fx: 960, fy: 540}], [a + 1.4, FLAT]];
  if (click) {
    const [t, fx, fy] = click;
    k.push([t - 1.3, FLAT], [t - 0.1, {...FLAT, s: 1.35, fx, fy}], [t + 0.5, {...FLAT, fx, fy}]);
  } else {
    k.push([b - 1.3, FLAT], [b, {rx: 8, ry: 16, s: 0.9, x: 60, y: 20, fx: 960, fy: 540}]);
  }
  return k;
};

export const CAMS: Partial<Record<keyof typeof SCENES, CamKey[]>> = {
  signal: fly('signal', [CUE.incClick, 1480, 300]),
  correlate: fly('correlate'),
  warroom: fly('warroom', [CUE.approveClick, 922, 972]),
  investigate: fly('investigate', [CUE.evClick, 640, 350]),
  assistant: fly('assistant'),
  postmortem: fly('postmortem', [CUE.publish, 1210, 986]),
};
