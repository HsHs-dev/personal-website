# Hassan's doors — setup guide

The finished 3D door artwork lives in **`src/components/doors/`**. Your existing `App.tsx`, content, and global CSS have not been replaced. This is a reusable component export, not the implementation of the four room pages.

## 1. Try the handoff

```sh
npm install
npm run dev
```

Open **`/door-preview.html`** on the URL printed by Vite. The preview starts in **Enter a page** mode: a door opens, the camera approaches the doorway, the scene fades, and the demo destination appears. Browser Back and the return link take you home. Choose **Peek inside** to inspect the miniature interiors without navigating.

The normal `/` URL still shows your existing application. The preview is a separate Vite entry and is also included in production builds. To omit the demo from deployment, remove only the `doors` entry in `vite.config.ts`.

## 2. Use the full entrance

```tsx
import { DoorEntrance } from './components/doors';

export default function Home() {
  return (
    <DoorEntrance
      initialMood="night"
      onEnter={(door) => {
        // Replace with your router's navigate(`/${door}`) when available.
        window.location.assign(`/${door}`);
      }}
    />
  );
}
```

The callback receives **`'about' | 'work' | 'library' | 'garden'`**. It runs **once, after the entrance animation finishes and the transition veil is opaque**. Implement those routes first; the example does not create them. Focus your destination page's heading after navigation.

With a router already installed, simply pass `onEnter={(door) => navigate('/' + door)}`. No router dependency is included in the components.

For a React-only prototype without routes:

```tsx
import { useState } from 'react';
import { DoorEntrance } from './components/doors';
import type { DoorId } from './components/doors';

export default function App() {
  const [room, setRoom] = useState<DoorId | null>(null);
  if (room) {
    return (
      <main>
        <h1>{room}</h1>
        {/* Render your real room component here. */}
        <button onClick={() => setRoom(null)}>Back home</button>
      </main>
    );
  }
  return <DoorEntrance onEnter={setRoom} />;
}
```

## 3. Use just the artwork

```tsx
import { DoorGallery, Door } from './components/doors';

// Four doors and accessible labels; no page heading or toolbar.
<DoorGallery mood="night" onEnter={(door) => navigate('/' + door)} />

// An individual reusable model with its label.
<Door door="garden" mood="day" interaction="preview" />

// A subset, sharing a single WebGL renderer.
<DoorGallery doors={['about', 'work']} interaction="preview" />
```

Prefer one gallery over four separate `Door` components on the same screen: the gallery shares the renderer and lighting. Give the component a normal full-width block container. It manages its own height; four doors become a two-by-two arrangement when its container is narrow.

## Behavior and useful props

| Prop | Purpose |
|---|---|
| `onEnter(door)` | Navigate or render your page after the transition. May return a promise; the veil remains while it resolves. |
| `onEnterStart(door)` | Optional synchronous hook to start preloading a route. Do not navigate here. |
| `interaction` | `enter` or `preview`. Defaults to `enter` when `onEnter` exists; otherwise `preview`. |
| `mood` | Controlled `day` or `night`. On `DoorEntrance`, pair with `onMoodChange` to keep the toggle functional. |
| `initialMood` | Initial uncontrolled mood on `DoorEntrance`; defaults to `night`. |
| `reducedMotion` | Omit to follow the OS preference. `true` replaces camera travel with a brief fade. |
| `sound` | Optional quiet door sound. Off by default. The entrance toolbar can enable it when uncontrolled. |
| `maxPixelRatio` | Resolution cap, default `1.8`; try `1.25` on constrained devices. |
| `resetKey` | Change this value to reset a gallery that stays mounted across navigation. |
| `onError(error)` | Optional reporting hook for graphics or navigation errors. |
| `showControls` | Entrance toolbar visibility, default `true`. |
| `title`, `subtitle` | Entrance copy. |

If `interaction="enter"` has no callback, the transition ends on a small “ready” state with a return button; it never invents a room page. If your navigation promise rejects, a recoverable error offers a return to the doors. Escape/cancel stops an unfinished camera transition. Returning home should either remount the component, change `resetKey`, or call `reset()` via a `DoorGalleryHandle` ref.

The components do not persist preferences or modify the document theme, global CSS, history, or routes. The host application owns those concerns. Sound only initializes after user interaction. Real button labels provide keyboard access and remain usable when WebGL fails.

## What is included

- `DoorEntrance.tsx`: entrance shell and single-door convenience component.
- `DoorGallery.tsx`: React lifecycle, accessible controls and navigation handoff.
- `scene.ts`: camera, lighting, picking, animations and resource cleanup.
- `transition.ts`: entrance timing.
- `art/models.ts`, `art/textures.ts`: editable procedural models, painted textures, stickers, and custom book spines.
- `doors.css`: scoped styles; imported automatically by the components.
- `assets/`: bundled fonts and their SIL Open Font License files. No runtime font CDN requests.
- `demo/`: isolated preview only; not imported by your app.

Dependencies `three` and `@types/three` have been added to this project's package manifest and lockfile. React was already present. No React Three Fiber, GSAP, external model service, API key, or image-generation service is required.

All geometry and drawings are created locally. The stickers are simplified original fan art of the requested childhood references. The six named book spines are custom interpretations, not scans of particular editions. The miniature interiors are decorative previews, not your actual content pages.

## Edit and verify

Treat this folder as your project's source going forward. Change the canvas drawings in `art/textures.ts`, geometry in `art/models.ts`, labels in `catalog.ts`, and light values in `scene.ts`. Font/material creation is inside the model factory, so importing the component does not access the DOM; the WebGL scene initializes after mount. In server-component frameworks, put the entrance behind a client boundary.

```sh
npm run build
node --test tests/doors-transition.test.mjs
```

The build type-checks the components. Tests cover entry ordering, the opaque navigation boundary, reduced motion, and monotonic progress. The preview mounts under React Strict Mode and has been checked for entering, returning, cancelling, day/night and mobile layout.

The earlier workshop's `scripts/export-door-models.mjs` is a snapshot exporter. Rerunning it overwrites `art/models.ts` and `art/textures.ts`; it is not needed to use or maintain these components.
