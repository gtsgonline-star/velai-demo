// ALL times are absolute seconds on the voiceover track (public/voiceover.wav, 153.04 s).
// Derived from silence-detection on your WAV, then matched to VO_TIMESTAMPED.txt.
// Fine-tune any value here and the whole video re-syncs in Remotion Studio.
export const FPS = 30;
export const TOTAL_SEC = 155.5; // 153.04 s voiceover + ~2.5 s music/silence tail
export const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS);

export const SCENES = {
  intro: [0, 12.2],
  signal: [12.2, 23.46],
  correlate: [23.46, 38.1],
  warroom: [38.1, 59.9],
  investigate: [59.9, 75.98],
  assistant: [75.98, 88.3],
  trust: [88.3, 111.1],
  postmortem: [111.1, 123.65],
  outcomes: [123.65, 140.99],
  cta: [140.99, TOTAL_SEC],
} as const;

export const CUE = {
  // 1 intro
  alert: 1.7, storm: 3.76, meet: 10.54,
  // 2 signal
  guhatek: 13.7, signalProm: 17.4, building: 19.8, incClick: 21.8,
  // 3 correlation
  five: 23.92, fingerprint: 27.9, maintenance: 30.1, topology: 31.6, timing: 33.4, one: 34.5, paged: 36.1,
  // 4 war room
  joins: 38.42, transcribe: 41.4, summary: 44.0, jira: 49.0, approve: 51.0, approveClick: 54.0,
  // 5 investigation
  readonly: 62.3, invProm: 63.5, grafana: 64.5, kubernetes: 65.6, opensearch: 66.9, patterns: 68.1, evClick: 72.9,
  // 6 assistant
  ask: 76.4, slack: 80.2, teams: 81.3, console: 82.5, scoped: 83.8,
  // 7 trust
  kube: 93.0, azure: 95.4, bedrock: 97.2, noWrite: 103.6, writes: 107.6, guardrails: 108.5,
  // 8 postmortem
  taking: 111.56, impact: 115.0, cause: 116.0, resolution: 116.9, follow: 117.7, human: 120.8, publish: 122.3,
  // 9 outcomes
  modelled: 124.04, n1: 127.1, n2: 131.4, n3: 136.5,
  // 10 cta
  velai: 141.3, runs: 142.82, never: 144.6, see: 146.78, url: 149.6,
} as const;
