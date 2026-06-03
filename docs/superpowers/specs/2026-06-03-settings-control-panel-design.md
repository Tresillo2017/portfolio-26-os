# Settings / Control Panel — Design Spec
Date: 2026-06-03

## Overview

Add a Windows 95-style Control Panel to the portfolio. Opening it launches a folder-style window showing three icons. Double-clicking any icon opens that panel as its own independent draggable window. Changes are persisted to localStorage and applied live to the desktop.

---

## Architecture

### New files
- `src/components/applications/ControlPanel.tsx` — folder window with 3 icons
- `src/components/applications/settings/WallpaperSettings.tsx` — Display panel
- `src/components/applications/settings/AppearanceSettings.tsx` — Appearance panel
- `src/components/applications/settings/CursorSettings.tsx` — Cursors panel
- `src/context/SettingsContext.tsx` — global settings state + localStorage persistence
- `src/hooks/useSettings.ts` — convenience hook wrapping the context

### Modified files
- `src/components/os/Desktop.tsx` — register `controlPanel` in APPLICATIONS; pass `addWindow` to ControlPanel so it can spawn sub-panels; consume settings context for wallpaper + color scheme
- `src/components/os/Window.tsx` — consume active color scheme CSS variables for title bar gradient + button colors
- `src/assets/icons/index.ts` — add any new icon entries needed
- `src/index.tsx` — wrap with `SettingsProvider`

### Assets
- `src/assets/pictures/wallpapers/` — ~10 Win95 stock wallpaper PNGs (Clouds, Forest, Gold Weave, Rivets, Sandstone, Squares, Teal Triangles, Winlogo, etc.) sourced from a public Win95 archive
- `src/assets/cursors/<scheme>/` — `.cur` files for each cursor scheme (Standard, 3D White, 3D Black, Dinosaur, Jungle), one file per cursor role

---

## Settings State Shape

```typescript
interface SettingsState {
  wallpaper: {
    name: string;          // e.g. "Clouds"
    url: string;           // asset path
    display: 'tile' | 'center' | 'stretch';
  };
  colorScheme: {
    name: string;          // e.g. "Windows Standard"
    titleBarStart: string; // hex
    titleBarEnd: string;
    titleBarText: string;
    buttonFace: string;
    buttonText: string;
    desktop: string;       // fallback bg color when no wallpaper
  };
  cursor: {
    scheme: string;        // e.g. "3D White"
  };
}
```

Persisted to `localStorage` under key `portfolio-settings`. Defaults to the original Win95 "Windows Standard" scheme + Clouds wallpaper + Standard cursors.

---

## Control Panel Window (`ControlPanel.tsx`)

- Uses existing `Window` component, ~400×320px
- Title: "Control Panel", bar icon: `computerSmall`
- Body: grid of large icon buttons — Display, Appearance, Mouse (Cursors)
- Each icon is a 32×32 Win95-style image + label underneath
- Single click opens the sub-panel via an `onOpenPanel` prop passed from Desktop, which calls `addWindow` with the appropriate sub-panel component
- Sub-panels open at staggered offsets so they don't overlap perfectly

---

## Wallpaper Panel (`WallpaperSettings.tsx`)

Mimics Win95 Display Properties > Background tab.

**Layout (top to bottom):**
1. Monitor preview (~200×160px) showing selected wallpaper scaled/tiled/centered
2. Wallpaper name list (scrollable, single-select) — clicking a name updates preview
3. Display radio buttons: Tile | Center | Stretch
4. OK / Cancel / Apply buttons

**Behavior:**
- Selecting a wallpaper + display mode updates local draft state
- "Apply" or "OK" commits draft to SettingsContext → desktop background updates live
- "Cancel" discards draft

**Wallpapers (bundled assets):**
Clouds, Forest, Gold Weave, Rivets, Sandstone, Squares, Teal Triangles, Winlogo, Pinstripe, Red Blocks (~10 total)

---

## Appearance Panel (`AppearanceSettings.tsx`)

Mimics Win95 Appearance tab.

**Layout:**
1. Preview pane (~full width, ~120px tall) — a fake mini-desktop rendering a sample window using the draft scheme's colors (title bar gradient, button face, desktop bg)
2. Scheme dropdown (Win95-style select) — named presets
3. OK / Cancel / Apply buttons

**Schemes:**
| Name | titleBarStart | titleBarEnd | desktop |
|---|---|---|---|
| Windows Standard | #000080 | #1084d0 | #008080 |
| Desert | #808040 | #c0c040 | #808000 |
| Rainy Day | #808080 | #a0a0a0 | #404040 |
| Rose | #804040 | #d08080 | #804040 |
| Teal | #007070 | #00a0a0 | #006060 |
| Slate | #404060 | #6060a0 | #303050 |
| Wheat | #a08040 | #d0b060 | #806020 |
| Lilac | #806080 | #c090c0 | #604060 |
| Storm | #204060 | #4080c0 | #102040 |
| Plum | #400040 | #800080 | #200020 |
| Spruce | #204020 | #408040 | #102010 |

**Behavior:** same draft → apply pattern as Wallpaper panel.

---

## Cursor Panel (`CursorSettings.tsx`)

Mimics Win95 Mouse Properties > Pointers tab.

**Layout:**
1. Scheme dropdown — Standard, 3D White, 3D Black, Dinosaur, Jungle
2. Cursor role list — 7 rows, each: role name | preview of actual cursor image
   - Normal Select, Help Select, Working in Background, Busy, Precision Select, Text Select, Unavailable
3. OK / Cancel / Apply buttons

**Assets:** Real Win95 `.cur` files bundled under `src/assets/cursors/<scheme>/normal.cur` etc., sourced from a public Win95 cursor archive.

**Behavior:**
- Selecting scheme updates all previews
- Apply: injects a `<style>` tag on `document.body` setting `cursor: url(...) auto` globally

---

## Applying Theme to Existing UI

### Window title bar
`Window.tsx` reads `colorScheme.titleBarStart` / `titleBarEnd` from settings context and applies as `background: linear-gradient(...)` on the title bar div.

### Desktop background
`Desktop.tsx` reads `wallpaper.url` from settings context and applies `backgroundSize`/`backgroundRepeat` based on `wallpaper.display`.

### Cursors
A `<CursorStyleInjector />` component (rendered once in `App`) watches the cursor scheme and injects/replaces a `<style>` tag globally.

---

## Desktop Registration

```typescript
controlPanel: {
  key: 'controlPanel',
  name: 'Control Panel',
  shortcutIcon: 'computerSmall',
  component: ControlPanel,
}
```

`ControlPanel` receives an `addWindow` prop so it can spawn sub-panels directly.

---

## Out of Scope

- Uploading custom wallpapers
- Custom color picker (only named schemes)
- Animated cursors (`.ani`) — static `.cur` only
- Font size / DPI settings
