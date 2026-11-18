# The house, as a working design preview

This is the browsable counterpart to [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). It uses real React components, local fonts, responsive layouts, the existing Three.js doors, and working interactions. Use it to review the design before integrating the rooms into the main website.

## Open it

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 5175
```

Visit **http://127.0.0.1:5175/door-preview.html**. The main portfolio entry at `/` remains separate. If that port is already serving this project, use the running preview.

The top review toolbar is part of the design workspace, not proposed public navigation:

- **All pages** opens the page index. Every page has a shareable hash URL and supports browser back/forward.
- **Design system** opens the live palette, typography, spacing, and component specimens. The palette lists RGB, HSL, and OKLCH from the canonical JSON under `docs/design-system`.
- **Inspect** outlines the content regions and reveals layout guidance.
- On Home, **Enter a page** walks through a door into its destination; **Peek inside** demonstrates the atmospheric opening/closing interaction.

Use the header to change Home between day and night, enable environmental audio, or open Preferences. Rooms keep their own atmosphere. Preferences include reduced motion, paused scenery, volume, and a paper reading background for Garden articles. Preferences persist locally; audio starts off on each reload.

## Pages to review

Append these hashes to `door-preview.html`:

| Hash | Design and behavior |
| --- | --- |
| `#` | Four freestanding doors, gentle opening hover, day/night, entry transition |
| `#about` | Notebook biography, illustrated personal objects, memory selectors, Now section |
| `#work` | Working desk, selected project rows, evidence and contribution |
| `#work/gitlet` | Project case study, architecture, code copy, limitations; each project has its own route |
| `#library` | Dimensional bookshelf, category filters, shelf/list switch |
| `#library/deep-work` | Book record and reading sheet; each book has its own route |
| `#garden` | Pond, fireflies, topic filters, maturity labels and connected reading |
| `#garden/learning-by-making` | Long-form essay |
| `#garden/small-software` | Unfinished seedling note |
| `#garden/tea-after-rain` | Recipe, ingredient checklist, reset and print |
| `#garden/quiet-in-film` | Film note with spoiler disclosure |
| `#garden/places-in-games` | Game note |
| `#garden/topics/learning` | Topic path connecting notes |
| `#contact` | Email, copy address, social links |
| `#search` | Searchable local content index, query URL, filters, empty state |
| `#colophon` | Materials, sources, font and sound credits |
| `#accessibility` | Navigation and accessibility guidance |
| `#loading` | Loading-state study |
| `#error` | Failure-state study with retry interaction |
| `#missing` | 404 and recovery navigation |
| `#system` | Live design-system reference |

## Editing and integration

| File | Responsibility |
| --- | --- |
| `src/design-preview/App.tsx` | Preview shell, hash navigation, dialogs, preferences, audio |
| `src/design-preview/Pages.tsx` | Page templates and reusable UI pieces |
| `src/design-preview/content.ts` | Books, selected projects, sample notes, page index |
| `src/design-preview/Scenes.tsx` | Original SVG room illustrations, line icons and project schematics |
| `src/design-preview/styles.css` | Room themes, typography, layouts, states and responsive rules |
| `src/design-preview/fonts.css` | Locally served font faces |
| `src/design-preview/assets/` | Font licenses, fonts and audio audition files |
| `src/components/doors/` | Reusable Three.js entrance; see [DOOR_COMPONENTS.md](DOOR_COMPONENTS.md) |

The existing door demo entry now mounts `DesignPreview`. To adopt a room in the main application, move its page and shared UI into the application's routing structure, replace hash links with that router's links, and move the preview CSS reset into an appropriately scoped application stylesheet. Keep the review toolbar and state-study pages out of public navigation. The main portfolio has not been replaced by this preview.

## Content and asset boundaries

- Biography chapters and Garden entries are explicitly labelled design samples. They demonstrate density, hierarchy, and interactions; they are not newly attributed personal facts or published opinions.
- Project summaries come from Hassan's supplied audit. Illustrations are original schematics, not screenshots of the applications. Case-study prose and evidence need editorial review before publication.
- The six requested book titles are present. Reading statuses, ratings, dates, and personal reviews remain unassigned rather than invented. Covers are original typographic interpretations.
- Room introductions use SVG scenes; the entrance is Three.js and the bookshelf uses CSS perspective. This is an interactive page-design reference, not a fully modeled 3D interior for every room.
- Environmental sounds are locally stored CC0 **audition previews**, enabled only by user action. Source links, authors, hashes and download URLs are recorded in `assets/audio-manifest.json`. They still need listening review and seamless-loop mastering before production. Work and utility pages are silent. No music is included.
- Search indexes the preview content locally. Loading and error routes are explicit state demonstrations, not a newly implemented remote-content backend.

## Verification

```sh
npm run lint
npm test
npm run build
npm run test:doors
```

The browser suite includes the original door interactions and the design-preview checks. It exercises all 21 indexed pages at 1440px, 390px, and 320px, checks horizontal overflow and runtime errors, and covers filters, reading views, dialogs, persistent preferences, search, recipe controls, clipboard interaction, and audio opt-in. It uses installed Google Chrome and starts an isolated Vite server on port 5176.

The Three.js bundle currently triggers Vite's advisory large-chunk warning. It is lazy loaded; this is a remaining production performance consideration, not a failed build.

## Interaction and type refinement — November 18, 2026

This revision supersedes the original About/Garden heading and Home/Library sound choices in the initial specification.

- **About:** Shantell Sans 600 for headings (36–52px, 1.18 line height, −.025em tracking), and 400 for short handwritten annotations (23px/1.5). Its marker construction makes the notebook feel drawn and playful without the thin, loosely spaced cursive of the previous annotations. Body copy remains Instrument Sans so a biography is comfortable to read. [Designer’s description and process](https://shantellsans.com/process).
- **Garden:** Bricolage Grotesque 600 for headings (36–52px/1.12, −.02em), with Literata retained for sustained reading. This gives the index a softer, open sans-serif voice and leaves Library with its distinct book typography. [Typeface project](https://github.com/ateliertriay/bricolage).
- **Home and utilities:** Fraunces remains the house sign. **Work:** Plex Sans remains the technical voice. **Library:** Literata remains the reading voice. Shared controls retain Instrument Sans. The live System page includes the revised specimens.
- **Icons:** search tilts and enlarges its lens; theme rotates; settings sliders exchange positions; sound waves pulse once; arrows move toward their destination. Hover and keyboard focus share feedback. Press compresses header icons. Reduced motion removes these transforms and animations.
- **Sounds:** original Web Audio noise transients give a soft hover tick, a lower press, a brighter release, and a deeper door cue. No music, copied Josh Comeau samples, or new runtime dependency. Sound is opt-in, follows the existing volume control, and stops when disabled. Navigation remains independent of audio availability. Inspired by [Josh Comeau’s use-sound examples](https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/), particularly timed press/release feedback and accessible mute behavior.
- **Home/About ambience:** [Outside gentle wind in trees — moreliketrees](https://freesound.org/people/moreliketrees/sounds/858679/), CC0. Replaces the dense dry-leaves recording.
- **Library ambience:** [Indoor fireplace — ceich93](https://freesound.org/people/ceich93/sounds/263864/), CC0. Replaces rain. Garden retains its stream recording. Recordings are local audition previews with reduced playback gain; the manifest tracks provenance.
- **Loading:** the loading study shows a hinged SVG door with light spreading across its threshold. The actual entrance loader also regains its opening animation. Reduced motion and Pause scenery keep the loading illustration still. No artificial loading delay is introduced.
