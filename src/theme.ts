import {loadFont as inter} from '@remotion/google-fonts/Inter';
import {loadFont as mono} from '@remotion/google-fonts/JetBrainsMono';

export const sans = inter('normal', {weights: ['400', '500', '600', '700', '800'], subsets: ['latin']}).fontFamily;
export const monoF = mono('normal', {weights: ['400', '500'], subsets: ['latin']}).fontFamily;

// Palette taken from reference image 4 (dark navy incident console) + VelAI brand gradient
export const C = {
  bg: '#0a1322', panel: '#111d33', panel2: '#16263f', line: '#243653',
  text: '#e8eef8', mute: '#8da2c0',
  cyan: '#22c3ee', violet: '#9b72ff', pink: '#f0607a',
  green: '#22c55e', red: '#ef4444', orange: '#f97316', yellow: '#eab308', blue: '#3b82f6',
};
export const grad = `linear-gradient(120deg, ${C.cyan}, ${C.violet} 60%, ${C.pink})`;
