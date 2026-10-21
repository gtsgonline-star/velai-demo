# VelAI demo video (Remotion)

    npm install
    npm run dev        # Remotion Studio: scrub and preview with audio
    npm run render     # -> out/velai-demo.mp4 (1920x1080, 30 fps)
    npm run typecheck

## Sync
All timing lives in `src/timing.ts` in absolute seconds on `public/voiceover.wav`.
`SCENES` sets scene boundaries; `CUE` sets when each logo pops, row appears or cursor clicks.
Edit a number, Studio hot-reloads. Cursor waypoints are `[seconds, x, y, 1?]` inside each scene file (`1` = click).

## Structure
    src/camera.ts   3D camera moves per scene (tilt fly-in, zoom to click, pull back)
    src/kit.tsx      shared: Camera, useSec clock, LogoPop, Cursor, Pop (click popup), AppFrame, Panel, Tag
    src/theme.ts     palette (from your reference image 4), fonts
    src/scenes/*     one file per scene, absolute 1920x1080 coordinates
    src/Video.tsx    audio + scene sequencing + crossfades

## Visual polish pass
- Tool/brand logo callouts use restrained blue/cyan lighting, with source marks landing in their dashboard wells when a persistent destination is specified.
- GuhaTek branding uses the supplied logo artwork in the existing `public/logos/guhatek-logo.png` slot, so scene timing and logo cues remain editable as before.
- Opening incident graph uses a smooth rising p99 telemetry trace (not an ECG) and progresses with the narration cues.
- Evidence-source set: Prometheus, Grafana, OpenSearch, Kubernetes; spotlight logos settle and remain visible.
- Jira scoped-action label is `Tickets & chat` beside a dedicated icon-only derivative.
- Outcomes layout has added breathing room and a narration-paced graph reveal.
- Audio and total composition duration are preserved.
