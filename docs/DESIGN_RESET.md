# Hassan's Digital Space — design reset

Research and proposed blueprint · 15 November 2026

## Status and source of intent

Hassan requested a redesign from scratch using personal-website-design-vision.md. This blueprint treats that file as the new product vision. Its suggestions are distinguished below from research findings and proposed implementation choices.

The earlier uniform Paper/Slate mockups are a superseded draft. Hassan has selected illustrated rooms with clickable objects and subtle depth, realistic materials and warm lighting, made as original vector illustrations drawn in code/Figma. The first cottage composition study now covers Home, all four rooms, and mobile Home. The Figma connector remains at its Starter call limit, but the board was successfully imported through Figma's interface as editable vectors on the Foundations page, positioned separately from the old draft. [Open the composition board](https://www.figma.com/design/Xhx6ynR93muwTvtXGSkz7s?node-id=17-2)

This is a composition and navigation review, not the finished realistic rendering or complete website design. The interactive conversation preview demonstrates door transitions and object selection; the imported Figma board is static. Source drawings and review notes are in `docs/design-reset/`.

## What the new vision establishes

- The site is a home with four primary entrances: About, Work, Library, Garden.
- Arrival includes an “Entering the Home” loading treatment, followed by the title and an invitation to choose a door.
- Each door communicates its destination before it opens.
- Each room has its own palette, typography, sound, interaction character, and atmosphere.
- About tells Hassan's biography and communicates playfulness, curiosity, chaos, and growth.
- Work gives recruiters clear evidence of skills and projects quickly.
- Library contains books read, currently being read, and planned, with a dimensional bookshelf and warm winter atmosphere.
- Garden holds developing thoughts and interests, including recipes, films, and games.
- Research and discussion precede the new visual build.

The previous single-serif rule, uniform two-theme system, and ban on real-time 3D are not carried forward as settled constraints. They conflict with the new direction and need fresh decisions.

## Agreed experience and proposed composition

Hassan chose illustrated rooms with clickable objects and subtle depth. The materials and light should feel realistic and warm. The connecting home should be a small, cozy countryside hut from a children's story: a home with warmth and belongings. The proposed composition is a fixed-camera cottage hall: visitors select a door, see a short transition, and arrive in a room built around a few meaningful objects. Original layered vector drawing is the chosen production method. No generated raster art or stock imagery is planned.

Free walking is outside the selected experience. Depth should support the room composition and object interactions. No particular rendering library has been chosen.

Keep a small shared set of controls across the house: Home, room switcher, sound, and motion preferences. Work, CV, and Contact should also be reachable directly. A shared control position and consistent object feedback can make the rooms feel related even when their fonts and colors differ.

## Room blueprint

| Place | Entrance and first impression | Main experience | Proposed interaction character |
|---|---|---|---|
| Home | Four different doors under the title and “Choose a door to enter” | Choose by curiosity; direct Work route for visitors with a specific purpose | Handle responds to hover/focus; tap/click opens; the destination is labeled |
| About | Old painted wood, growth marks, crayon lettering | Biography through meaningful belongings and chapters, with an easy reading order | Slightly playful object responses; deliberate discoveries; optional soft toy/pencil cues |
| Work | Office door, clear nameplate, orderly lighting | Strong projects, contribution and evidence, technologies used, CV and contact | Crisp selection, restrained transitions, minimal audio |
| Library | A bookcase serving as the door, warm light around its edge | Dimensional shelves, reading states, book selection and personal reading notes | Pull forward a book, reveal its cover, open details, return it to its place |
| Garden | Glass and leaves framing a garden entrance | A clearing with labeled topic trails and connected evolving entries | Gentle leaves/water around navigation; reading areas settle and stay legible |

These are proposed compositions. Exact materials, colors, font families, room viewpoints, and props remain open.

### Home and arrival

1. Show the loading treatment only while needed for the entry scene. Do not add an artificial wait after the interface is ready.
2. Reveal the title and four entrances together on desktop.
3. Keep door names visible, including the bookshelf entrance.
4. On mobile, preserve four readily discoverable destinations. Choose between a compact two-by-two composition or stacked room entrances after testing legibility in the selected art style.
5. A shared room menu allows direct navigation without repeatedly returning through the hallway.
6. Returning visitors and deep links should reach their destination without replaying a long opening sequence.

A door's visual reaction should give equivalent feedback to pointer, keyboard focus, and touch. Do not make hover a prerequisite for learning its name.

### About: biography through objects

The growth marks and worn paint are established ideas from Hassan. The actual years, names, childhood references, possessions, photographs, and milestones must come from him.

Proposed structure:
- A room overview that conveys his energy and interests.
- A small set of objects tied to biography chapters.
- A readable chronological route through the same material.
- A “what I'm up to now” corner if Hassan wants Now absorbed into About.
- A route to Work for readers interested in his engineering.

Environmental storytelling can reveal a life through possessions; the official Unpacking description is a useful reference. This is an inspiration for structure, not permission to invent Hassan's history. [Unpacking](https://www.unpackinggame.com/)

### Work: professional evidence immediately available

The office scene should introduce the content without requiring visitors to solve a puzzle. Put selected work and its evidence in the first useful view.

Use the existing project decisions as content inputs:
- Memory Sequence Game: story.
- Brutal Tomato: short write-up.
- Frontend Mentor gallery: shelf item.

Each featured project should establish what it does, Hassan's contribution, the technologies actually used, a challenge or decision, and links or other proof. Unknown claims stay empty until supplied.

A proposed desk or project board can frame these items. Project details should open as a readable page or panel with a stable URL. Skills should connect to evidence, rather than invented proficiency percentages.

### Library: a collection people can browse

Separate reading status from genre or personal recommendation:
- Reading.
- Read.
- Want to read.
- Optional “paused/abandoned” only if Hassan wants it.

Selecting a book can reveal its cover and a readable detail panel: title, author, status, optional dates, and Hassan's note. A catalogue view and title/author search provide access when a shelf becomes crowded. On mobile, use larger covers or short shelves with tap targets; avoid requiring tiny spine selection or free camera orbit.

Room composition proposal: shelves as the focal point, armchair and mug at the edge, warm lamp inside, cool winter light beyond a window. Actual cover assets and titles must come from Hassan's collection.

Useful references:
- The Dream Library documents real covers, book proportions and spine colors, sorting, and a hidden hall of doors. Borrow its material clarity and spatial transitions; keep the four primary entrances explicit. [Creator's case study](https://www.izgiuygur.com/projects/dream-library)
- The Visible Shelf describes dimensional books that can be pulled out and flipped, with personal opinions and collections. [Creator's press kit](https://thevisibleshelf.com/press.html)
- Kyle Johnston explains the spine-inspired design of his personal reading history. [Bookshelf design notes](https://books.kyleio.com/about)
- Rainy Study documents warm lighting, rain, preset viewpoints, touch controls, and manually activated sound. [Creator's repository](https://github.com/andyhuo520/rainy-study/blob/main/README.en.md)

### Garden: a living body of ideas

Research finding: a digital garden is an evolving collection connected through topics and relationships. Publication time need not be its primary structure. Mixed formats and unfinished ideas belong in it. [Maggie Appleton's history and ethos](https://maggieappleton.com/garden-history)

Ben Cuan's Garden includes recipes and reading notes, along with search, featured content, growth stages, and recently modified entries. Hassan's proposed mix fits this practice. [Ben's Garden](https://garden.bencuan.me/) · [Note stages](https://garden.bencuan.me/about/Note-Stages)

Proposed experience:
- A forest clearing with clearly labeled trails: Thoughts, Recipes, Films, Games.
- “Start here,” “Recently tended,” and “Explore all” near the entrance.
- Contextual related links connecting topics.
- Growth stages such as Seedling, Growing, Evergreen, explained as maturity rather than truth or certainty.
- Reading surfaces with title, context, dates, body, sources, and related notes.
- Search and a simple index accessible from every garden view.

Library owns book inventory and reading status. Garden can hold ideas arising from books and link back to their records.

Andy Matuschak notes the challenge of public notes written mainly for their author's own thinking. Give new visitors an inviting entry point. [About these notes](https://notes.andymatuschak.org/About_these_notes)

Keep tending easy: adding a paragraph should not require editing a scene. [Tom Critchlow's garden-building notes](https://tomcritchlow.com/2019/02/17/building-digital-garden/)

## Atmosphere and interaction rules — proposed

- Give each room a distinct expressive title treatment. Decide whether body typography is shared or also room-specific after comparing readable samples.
- Retain control placement, labels, back behavior, and focus visibility across all rooms.
- Sound is optional. Interaction sounds and ongoing ambience should have separate controls.
- The entry loader is silent; audio starts only through a permitted interaction. Browsers may block unrequested audible playback. [MDN autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)
- Respect reduced-motion preferences and offer a static or short-fade transition. W3C recommends enabling visitors to disable nonessential interaction-triggered movement. [W3C motion guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)
- Avoid continual movement beside long text. Keep atmosphere in the surroundings and provide pause controls for ongoing effects.
- Use room-specific sound families: playful soft object cues for About, sparse restrained clicks for Work, page/wood sounds for Library, gentle leaf/water cues for Garden. These are art-direction proposals, not audio assets already produced.
- Judge loading by whether content is useful and controls respond, not merely whether a loading event fired. [web.dev performance guidance](https://web.dev/articles/user-centric-performance-metrics)

Josh Comeau's documented interaction work is a useful reference for small reactive details and distinct on/off cues. [Whimsical interaction breakdown](https://www.joshwcomeau.com/blog/whimsical-animations/)

Bruno Simon's portfolio demonstrates an explorable world and explicitly provides controls, quality options, mute, and recovery. It is a reminder that spatial navigation brings interface responsibilities. [Creator's portfolio](https://www.bruno-simon.com/)

## Confirmed art direction — Hassan's answers

- Experience: illustrated rooms, clickable objects, subtle depth.
- Rendering character: realistic interiors, warm lighting.
- About: Diary of a Wimpy Kid **and BioShock**. Hassan clarified that both belong to About.
- Work: Dieter Rams.
- Library: the atmosphere of Arnold's bedroom in Hey Arnold!
- Garden: Grave of the Fireflies.
- About / BioShock: objects and surroundings that tell a life story. This does not establish Rapture or Infinite as the visual setting.
- Garden: a quiet summer night, warm fireflies, bittersweet calm, and water.
- Connecting home: a small, cozy, warm countryside hut from children's stories, which feels like a home.
- Artwork: original vector illustrations drawn in code/Figma.

These references guide different aspects of each room. They do not mean the entire site should use cartoon rendering or that the rooms should reproduce fictional locations exactly.

### Initial translation into design — proposals for discussion

| Room | Physical environment | Graphic language | Interaction and reading |
|---|---|---|---|
| About | A lived-in room with a history; meaningful objects, worn materials, warm pools of light | Notebook pages, graphite drawings, handwritten asides and crayon marks layered over a tangible room | Objects reveal real biography chapters; a journal provides a readable route through the same story |
| Work | A carefully arranged study; an uncluttered desk, precise shelving, honest wood and metal materials | Clear sans-serif type, disciplined alignment, restrained neutral surfaces and one functional accent | Projects and proof are immediately legible; every control has an evident purpose |
| Library | A private cottage loft; roof window, shelving, reading seat and warm lamp against cooler winter light | Bookish serif typography, quiet labels, covers and spines as the main color variety | Selecting a book reveals its personal record; reading surfaces stay calm |
| Garden | A quiet summer night beside water, warm fireflies and bittersweet calm | Organic edges, botanical structure, readable text surfaces, restrained points of light | Labeled topic paths and connected notes; gentle water responses that settle for reading |

About's physical setting and notebook layer can coexist: wood, paper and warm lighting carry the room, while diary-like drawings carry the voice. The BioShock influence is environmental storytelling through meaningful possessions. Specific life events and possessions must come from Hassan.

For Work, Rams's principles prioritize usefulness, understandability, restraint, and attention to detail. Applying those principles to project evidence is the main direction; a retro equipment skin alone would not fulfill them. [Vitsœ: Rams's principles](https://www.vitsoe.com/gb/about/good-design) · [Braun's design history](https://secure-us.braun.com/en-us/design/design-and-innovation)

Garden's film reference is Isao Takahata's Grave of the Fireflies. Hassan chose quiet, bittersweet summer calm with fireflies and water. The first composition proposes a shallow pond with reeds and a low timber bank; the exact water shape remains a reversible design choice. [Studio Ghibli's official film page](https://www.ghibli.jp/works/hotarunohaka/)

## First composition study

The first study uses exposed roof beams, warm plaster, a worn timber floor, a woven rug, and a few domestic details. The four entrances share one small cottage rather than four separate architectural styles. The materials and silhouettes distinguish the rooms: weathered painted childhood door, precise office door, hinged bookshelf, and leafy glass garden door.

Desktop shows all four entrances together. Mobile uses a two-by-two doorway composition with full readable labels. Whole doors are targets. Room navigation remains visible after entering, so Work is always one action away.

The transition study has three states: closed doorway, a brief opening, then a room composition. Reduced motion skips the opening. The original vectors use solid colors and layered translucent shapes for illumination and depth. The first study establishes composition, navigation and mood; it is not yet a finished realistic interior illustration or a complete content design.

## Next discovery round

Ask these in small groups after the first answers:

- What real objects and life chapters belong in About? How should Hassan appear?
- Should Now and Contact become areas within rooms or remain supporting pages?
- How many books will Library contain initially? Are covers and reading statuses available?
- Are film/game entries reviews, memories, recommendations, or ideas? Are recipes tried, planned, or both?
- Should unfinished garden entries be public?
- What interactions should visitors remember most?
- Should there be time-of-day variants, or one deliberate lighting scheme per room?
- How much camera motion feels right? Which sounds feel warm versus irritating?

## New design sequence

1. Resolve the first spatial and visual decisions.
2. Prepare a reference board and one doorway composition; show a meaningful art-direction comparison if needed.
3. Design Home with four distinguishable doors, mobile and desktop.
4. Storyboard one door opening, a room arrival, and the return route.
5. Design Work first to prove the recruiter route.
6. Develop About, Library, and Garden with real content samples supplied by Hassan.
7. Build the shared controls and room-specific components from the agreed designs.
8. Review navigation, mobile/touch behavior, legibility, motion, and sound treatment.
9. Translate the chosen design into implementation tasks, one at a time.

Figma can specify scenes, layers, states, and transitions. A real-time 3D experience would additionally require an interactive implementation; static Figma frames alone cannot demonstrate its final camera and rendering behavior.

