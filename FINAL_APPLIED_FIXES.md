# Applied visual corrections — current source bundle

## Focused fixes in this pass
- Investigation evidence panel now uses the four requested sources: Prometheus, Grafana, Kubernetes, and OpenSearch.
- Corrected evidence tile coordinates to be relative to the evidence panel; previously they were placed beyond the panel's bounds.
- Evidence marks remain rendered in their home tiles after the spotlight animation returns. The moving spotlight now fades only after landing, so it no longer leaves an empty evidence area.
- Spotlight destinations align with the logo wells (not the card text), and only the currently active tile receives the cyan focus treatment.
- Replaced stale Jupyter/Elasticsearch evidence labels and supporting investigation chips with Kubernetes/OpenSearch.
- Assistant incident-context chips now reference OpenSearch and Kubernetes as well.
- Scoped Jira action remains icon-only plus the single, aligned label “Tickets & chat”; the redundant Jira text is not repeated.
- Slowed the staged VelAI mark/word/tagline reveal and added a restrained blue/cyan starburst accent, keeping the existing audio and scene cue unchanged.
- Kept the opening telemetry trace as a smooth, rising Prometheus-style line (not an ECG/heartbeat); retained the existing blue/cyan camera bloom and the other prior layout refinements.

## Preserved
- `public/voiceover.wav` unchanged.
- Scene order, total duration, FPS, and cue timestamps unchanged (only cue identifiers were renamed to match Kubernetes/OpenSearch).
- Existing logo assets were not overwritten.

## Checks
- TypeScript `transpileModule` syntax pass: no syntax diagnostics across project TS/TSX sources.
- Static references to bundled PNG logos checked; no missing direct logo assets.
- A full `tsc --noEmit` / Remotion render could not be completed because this archive has no installed `node_modules` and the environment could not resolve package downloads. Run `npm install`, `npm run typecheck`, then preview/render locally before publishing.

## Outcomes scene — cinematic metric focus pass
- Updated the response-efficiency target to **1.5 h** in both the headline KPI and its supporting note.
- Reworked the three impact targets (≥25%, 1.5 h, ~10%) into sequential cinematic focus beats: each metric enlarges into a centered hero card, with a soft darkened/blurred dashboard behind it, then hands focus to the next metric.
- Added concise context to each hero moment while retaining the modeled/not-measured disclosure and the existing dashboard/chart design.
- The focus beats are keyed to the existing voiceover cue constants `CUE.n1`, `CUE.n2`, and `CUE.n3`; scene order, narration audio, and cue timestamps were not changed.
- Outcomes TSX syntax transpilation check: passed. Full Remotion render/typecheck still requires installing the project's dependencies locally.
