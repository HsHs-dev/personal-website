# Cottage composition study

Original vector drawings for Hassan's design reset, 15 November 2026.

This is a first review of room composition, doorway identity, mood, and navigation. It is deliberately still a composition study: realistic material detail, stronger light modelling, final typography, biography content, book records, complete project pages, and sound are future design passes. None of the blank keepsakes or generic book spines asserts a fact about Hassan.

## Files

- `assets/cottage-composition-board.svg`: five desktop views and the mobile entrance, arranged as one Figma import board.
- `assets/*-scene.svg`: original, layered scene drawings.
- `assets/*-door.svg`: individual doorway drawings for the mobile composition.
- `assets/*-desktop.svg` and `assets/home-mobile.svg`: static screen studies.
- `draw_scenes.py`: deterministic vector source; no network dependencies or generated raster assets.
- `assemble_figma_board.py`: builds the static review board from the screen studies.
- `assemble_preview.py`: assembles the interactive conversation preview from its literal HTML source and the SVG assets.
- `check_preview.py`: checks local preview navigation, mobile layout, reduced motion, and JavaScript errors with Playwright.

The conversation preview source is kept in the thread's visualization directory. Application code under `src` is unchanged.

## Interaction study

The hall shows four whole-door targets. Selecting a door gives a short opening cue and moves into a room. The shared room menu gives immediate access to Work and lets visitors return Home. Object markers and labeled controls select the same object; mobile uses the labels. Reduced motion skips the opening cue, and the transition preference is locally remembered. This study uses no audio or continuous ambient motion.

About uses diary handwriting and a journal/keepsake composition. Work uses a neutral study and sans-serif title. Library uses a warm loft, roof window, chair, and bookish serif. Garden uses a night palette, water, and sparse fireflies, with Thoughts, Recipes, Films, and Games as distinct destinations.

## Verified in the local preview

- All five destinations navigate without JavaScript errors.
- Object selection updates the corresponding caption and selected state.
- At 322 px of available width, all four door targets remain visible and there is no horizontal overflow.
- Reduced-motion preferences skip the opening transition.
- All SVG files parse, and the inline preview is below 1 MB.
- Desktop Home, all four room compositions, and mobile Home have been visually inspected.

The SVG was imported successfully through Figma's normal Place image action. It is an editable frame with vector and text layers on Foundations, at X=5000, Y=0, size 4160 × 2280. The superseded draft remains separate. [Open the imported board](https://www.figma.com/design/Xhx6ynR93muwTvtXGSkz7s?node-id=17-2).

The interactive behavior is demonstrated in the conversation preview; it is not yet wired as a Figma prototype.
