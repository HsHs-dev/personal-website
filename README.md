# Hassan’s Digital Space

A React/TypeScript personal website and an interactive design preview of its four rooms: About, Work, Library, and Garden. The preview includes reusable Three.js doors, responsive room layouts, local fonts, optional audio, and a live design-system reference.

## Development

Use Node 24 and npm:

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5175
```

- `/` — current portfolio application.
- `/door-preview.html` — complete house design preview. Use **All pages** to browse templates and **Design system** to inspect tokens and controls.

The two entries are separate so the design can be implemented gradually in the portfolio. Sample biography and Garden writing are labelled in the preview.

## Checks and production build

```sh
npm run lint
npm test
npm run test:doors
npm run build
```

Browser tests use installed Google Chrome and start an isolated Vite server on port 5176. They cover page templates, responsive layouts, preferences, audio opt-in, and door navigation. Unit tests cover entry-transition behavior. Production files are generated in `dist/`; `npm run preview` serves that build locally.

The lazy-loaded Three.js chunk exceeds Vite’s 500 kB advisory threshold. The build succeeds, but this remains a production performance consideration.

## Design and implementation references

- [Design system](docs/DESIGN_SYSTEM.md) — identity, page specifications, and research.
- [Preview guide](docs/DESIGN_PREVIEW.md) — routes, file map, interaction refinements, and sources.
- [Door integration](docs/DOOR_COMPONENTS.md) — reusable React door components and callbacks.
- [Design-frame guide](docs/design-frames/README.md) — offline PNG gallery and measurements.
- `src/design-preview/` — room layouts, illustrations, typography, and sound handling.
- `src/components/doors/` — Three.js artwork and accessible entrance controls.
- `docs/design-reset/` — retained earlier design exploration.

To regenerate the image reference, keep the development server running on port 5175, then run:

```sh
npm run design:export
```

Open `docs/design-frames/index.html` for the offline gallery. Generated PNGs, thumbnails, and measurements remain local and can be regenerated; the exporter and guide are tracked. Journals under `docs/STORY.md` and `docs/JOURNEY.md` remain ignored.

Font licenses live beside their assets. Recording credits and source URLs are in `src/design-preview/assets/audio-manifest.json`. Audio is opt-in; local recordings are audition assets rather than final mastered loops.
