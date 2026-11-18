# Hassan’s house — implementation frames

Open **[index.html](index.html)** in a browser. It works directly from disk: no server or internet connection is needed to browse the images. Search by page name, switch between desktop and mobile, and click a frame to inspect it. Use Fit width, 50%, 100%, 150%, or 200% zoom; the arrow buttons move through the filtered frames. Escape closes the viewer.

## What is included

- **84 PNG frames:** 42 page/state views at each of two widths, including all 21 indexed templates, all four project details, all six book details, day/night Home, four open-door peeks, Library list/filter states, paper reading, search results/empty state, preferences, room navigation, and checked recipe ingredients.
- **Desktop:** 1440 CSS pixels wide. **Mobile:** 390 CSS pixels wide. Images are exported at 1×, so image pixels correspond to CSS pixels. Regular pages are full height; dialog/menu frames show a 1000px desktop or 844px mobile viewport.
- **One JSON measurement file per frame:** page dimensions, semantic colors, and bounding boxes / computed typography for key headings, lead paragraphs, buttons, and layout regions. These are useful reference measurements, not a full DOM/layout reconstruction.
- **JPG thumbnails:** lightweight viewport previews used by the gallery. Use PNGs for implementation, not thumbnails.
- **manifest.json:** inventory, route, export time, dimensions, file paths, and measurements.
- **palette.json:** a snapshot of the canonical RGB/HSL/OKLCH palette.

The preview’s review toolbar is removed from the frames. Audio is off and motion is paused for stable captures. Content labels identifying illustrative writing remain visible deliberately; they should not be mistaken for final personal copy.

## Use this like a design file

1. Open the gallery and choose a room. Compare its desktop and mobile frames.
2. Open its PNG at 100% to inspect spacing and proportions. Full-page images scroll vertically.
3. Open **Measurements** for exact captured type sizes, line heights, weights, letter spacing, colors, and positions. Font-family aliases `HDSLora` and `HDSBody` correspond to Fraunces and Instrument Sans.
4. Consult [the design system](../DESIGN_SYSTEM.md), [the palette](../design-system/PALETTE.md), and [the preview guide/refinements](../DESIGN_PREVIEW.md) for responsive rules, reasons, sound credits, and behavior.
5. Use **Live interaction** when implementing motion, hover, focus, navigation, or sound. Those links require the local preview server on port 5175.

These are faithful raster reference frames, **not editable vector layers or a `.fig` file**. They can be dragged into Figma, Penpot, or another design tool as reference images, but individual text and shapes will not become editable. React/CSS and the design documentation remain the source for implementing reusable components. Desktop and mobile are reference widths; interpolate responsively rather than copying absolute positions into every viewport.

## Folder structure

```text
design-frames/
  index.html            offline searchable frame gallery
  README.md             this guide
  manifest.json         full export inventory
  palette.json          color token snapshot
  desktop/
    about.png           full-page implementation frame
    about.jpg           viewport thumbnail
    about.json          computed measurements
    ...
  mobile/
    about.png
    about.jpg
    about.json
    ...
```

## Refresh the export after changing the design

From the project root, run the preview in one terminal:

```sh
npm run dev -- --host 127.0.0.1 --port 5175
```

In another terminal:

```sh
node scripts/export-design.mjs
```

Requires Node 24 (for the content module’s native TypeScript loading), the project dependencies, and installed Google Chrome. The exporter captures the current preview, rebuilds the gallery and manifest, and overwrites matching generated frames. Its HTML template is `scripts/design-board.html`. A different preview address can be supplied through the `DESIGN_PREVIEW_URL` environment variable.

Generated frames and the gallery remain local and ignored by Git. This guide, the exporter, and the canonical design-system documents are tracked so the export can be recreated from a fresh checkout.
