# Settings / Control Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Windows 95-style Control Panel with Wallpaper, Appearance (color scheme), and Cursor settings that apply live to the desktop and persist across sessions.

**Architecture:** A `SettingsContext` holds global settings state persisted to localStorage. A `ControlPanel` folder-window renders 3 icons that each open independent sub-panel windows via `addWindow` on the Desktop. `Window.tsx` and `Desktop.tsx` consume the context to apply the active theme.

**Tech Stack:** React, TypeScript, CSS-in-JS (inline styles matching project conventions), localStorage, CSS custom cursor via injected `<style>` tag.

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `src/context/SettingsContext.tsx` | Settings state, localStorage persistence, context + provider |
| `src/hooks/useSettings.ts` | Convenience hook for consuming SettingsContext |
| `src/components/applications/ControlPanel.tsx` | Win95 folder-style window showing Display / Appearance / Mouse icons |
| `src/components/applications/settings/WallpaperSettings.tsx` | Wallpaper picker (monitor preview + list + tile/center/stretch) |
| `src/components/applications/settings/AppearanceSettings.tsx` | Color scheme picker (preview pane + scheme dropdown) |
| `src/components/applications/settings/CursorSettings.tsx` | Cursor scheme picker (scheme dropdown + role list with previews) |
| `src/components/os/CursorStyleInjector.tsx` | Injects global `<style>` tag to apply cursor scheme to document |
| `src/constants/settings.ts` | WALLPAPERS, COLOR_SCHEMES, CURSOR_SCHEMES data constants |

### Modified files
| File | Change |
|---|---|
| `src/index.tsx` | Wrap `<App>` with `<SettingsProvider>` |
| `src/App.tsx` | Render `<CursorStyleInjector />` |
| `src/components/os/Desktop.tsx` | Register `controlPanel` app; pass `addWindow` to ControlPanel; read wallpaper + colorScheme from settings |
| `src/components/os/Window.tsx` | Read `colorScheme` from settings context for title bar gradient |
| `src/assets/icons/index.ts` | Add `controlPanel`, `display`, `appearance`, `mouse` icons |

### New assets
| Path | Content |
|---|---|
| `src/assets/pictures/wallpapers/` | ~10 Win95 wallpaper PNGs |
| `src/assets/cursors/standard/` | `.cur` files for Standard scheme |
| `src/assets/cursors/3d-white/` | `.cur` files for 3D White scheme |
| `src/assets/cursors/3d-black/` | `.cur` files for 3D Black scheme |
| `src/assets/cursors/dinosaur/` | `.cur` files for Dinosaur scheme |
| `src/assets/cursors/jungle/` | `.cur` files for Jungle scheme |

---

## Task 1: Settings constants

**Files:**
- Create: `src/constants/settings.ts`

- [ ] **Step 1: Create the constants file**

```typescript
// src/constants/settings.ts

export interface WallpaperOption {
    name: string;
    url: string;
}

export interface ColorScheme {
    name: string;
    titleBarStart: string;
    titleBarEnd: string;
    titleBarText: string;
    buttonFace: string;
    buttonText: string;
    desktop: string;
}

export interface CursorScheme {
    name: string;
    key: string;
    cursors: {
        normal: string;
        help: string;
        working: string;
        busy: string;
        precision: string;
        text: string;
        unavailable: string;
    };
}

// Wallpapers will be imported and wired up in Task 3 after assets are downloaded.
// Placeholder until assets exist:
export const WALLPAPERS: WallpaperOption[] = [];

export const COLOR_SCHEMES: ColorScheme[] = [
    {
        name: 'Windows Standard',
        titleBarStart: '#000080',
        titleBarEnd: '#1084d0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#008080',
    },
    {
        name: 'Desert',
        titleBarStart: '#808040',
        titleBarEnd: '#c0c040',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#808000',
    },
    {
        name: 'Rainy Day',
        titleBarStart: '#808080',
        titleBarEnd: '#a0a0a0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#404040',
    },
    {
        name: 'Rose',
        titleBarStart: '#804040',
        titleBarEnd: '#d08080',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#804040',
    },
    {
        name: 'Teal',
        titleBarStart: '#007070',
        titleBarEnd: '#00a0a0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#006060',
    },
    {
        name: 'Slate',
        titleBarStart: '#404060',
        titleBarEnd: '#6060a0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#303050',
    },
    {
        name: 'Wheat',
        titleBarStart: '#a08040',
        titleBarEnd: '#d0b060',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#806020',
    },
    {
        name: 'Lilac',
        titleBarStart: '#806080',
        titleBarEnd: '#c090c0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#604060',
    },
    {
        name: 'Storm',
        titleBarStart: '#204060',
        titleBarEnd: '#4080c0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#102040',
    },
    {
        name: 'Plum',
        titleBarStart: '#400040',
        titleBarEnd: '#800080',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#200020',
    },
    {
        name: 'Spruce',
        titleBarStart: '#204020',
        titleBarEnd: '#408040',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#102010',
    },
];

// Cursor file paths will be filled in Task 4 after assets are downloaded.
export const CURSOR_SCHEMES: CursorScheme[] = [
    {
        name: 'Standard',
        key: 'standard',
        cursors: {
            normal: '',
            help: '',
            working: '',
            busy: '',
            precision: '',
            text: '',
            unavailable: '',
        },
    },
    {
        name: '3D White',
        key: '3d-white',
        cursors: {
            normal: '',
            help: '',
            working: '',
            busy: '',
            precision: '',
            text: '',
            unavailable: '',
        },
    },
    {
        name: '3D Black',
        key: '3d-black',
        cursors: {
            normal: '',
            help: '',
            working: '',
            busy: '',
            precision: '',
            text: '',
            unavailable: '',
        },
    },
    {
        name: 'Dinosaur',
        key: 'dinosaur',
        cursors: {
            normal: '',
            help: '',
            working: '',
            busy: '',
            precision: '',
            text: '',
            unavailable: '',
        },
    },
    {
        name: 'Jungle',
        key: 'jungle',
        cursors: {
            normal: '',
            help: '',
            working: '',
            busy: '',
            precision: '',
            text: '',
            unavailable: '',
        },
    },
];

export const DEFAULT_SETTINGS = {
    wallpaper: {
        name: 'None',
        url: '',
        display: 'stretch' as const,
    },
    colorScheme: COLOR_SCHEMES[0],
    cursor: {
        scheme: 'Standard',
    },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/constants/settings.ts
git commit -m "feat: add settings constants for wallpapers, color schemes, and cursors"
```

---

## Task 2: SettingsContext and useSettings hook

**Files:**
- Create: `src/context/SettingsContext.tsx`
- Create: `src/hooks/useSettings.ts`
- Modify: `src/index.tsx`

- [ ] **Step 1: Create SettingsContext**

```tsx
// src/context/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ColorScheme, DEFAULT_SETTINGS, COLOR_SCHEMES } from '../constants/settings';

const STORAGE_KEY = 'portfolio-settings';

export interface WallpaperState {
    name: string;
    url: string;
    display: 'tile' | 'center' | 'stretch';
}

export interface CursorState {
    scheme: string;
}

export interface SettingsState {
    wallpaper: WallpaperState;
    colorScheme: ColorScheme;
    cursor: CursorState;
}

interface SettingsContextValue {
    settings: SettingsState;
    setWallpaper: (wallpaper: WallpaperState) => void;
    setColorScheme: (scheme: ColorScheme) => void;
    setCursor: (cursor: CursorState) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function loadSettings(): SettingsState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_SETTINGS;
        const parsed = JSON.parse(raw);
        const colorScheme = COLOR_SCHEMES.find(s => s.name === parsed.colorScheme?.name) ?? DEFAULT_SETTINGS.colorScheme;
        return { ...DEFAULT_SETTINGS, ...parsed, colorScheme };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SettingsState>(loadSettings);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    const setWallpaper = useCallback((wallpaper: WallpaperState) => {
        setSettings(prev => ({ ...prev, wallpaper }));
    }, []);

    const setColorScheme = useCallback((colorScheme: ColorScheme) => {
        setSettings(prev => ({ ...prev, colorScheme }));
    }, []);

    const setCursor = useCallback((cursor: CursorState) => {
        setSettings(prev => ({ ...prev, cursor }));
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, setWallpaper, setColorScheme, setCursor }}>
            {children}
        </SettingsContext.Provider>
    );
};

export function useSettingsContext(): SettingsContextValue {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('useSettingsContext must be used inside SettingsProvider');
    return ctx;
}
```

- [ ] **Step 2: Create useSettings hook**

```typescript
// src/hooks/useSettings.ts
export { useSettingsContext as useSettings } from '../context/SettingsContext';
```

- [ ] **Step 3: Wrap App with SettingsProvider in index.tsx**

Replace the contents of `src/index.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SettingsProvider } from './context/SettingsContext';

ReactDOM.render(
    <React.StrictMode>
        <SettingsProvider>
            <App />
        </SettingsProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
```

- [ ] **Step 4: Verify the app still compiles and runs**

```bash
npm start
```

Expected: App loads normally, no console errors.

- [ ] **Step 5: Commit**

```bash
git add src/context/SettingsContext.tsx src/hooks/useSettings.ts src/index.tsx
git commit -m "feat: add SettingsContext with localStorage persistence"
```

---

## Task 3: Download Win95 wallpaper assets

**Files:**
- Create: `src/assets/pictures/wallpapers/` (directory + image files)
- Modify: `src/constants/settings.ts` (populate WALLPAPERS array)

- [ ] **Step 1: Download Win95 wallpapers**

Search for Win95 stock wallpapers from the Internet Archive or win95.gg. Download and save these to `src/assets/pictures/wallpapers/`:

```
clouds.jpg        (Clouds)
forest.jpg        (Forest)
gold-weave.jpg    (Gold Weave)
rivets.jpg        (Rivets)
sandstone.jpg     (Sandstone)
squares.jpg       (Squares)
teal-triangle.jpg (Teal Triangles)
winlogo.jpg       (Windows Logo)
pinstripe.jpg     (Pinstripe)
red-blocks.jpg    (Red Blocks)
```

Search: "windows 95 wallpapers site:archive.org" or "win95 default wallpapers download"

- [ ] **Step 2: Update WALLPAPERS constant in settings.ts**

Add imports at the top of `src/constants/settings.ts` (before the interface definitions):

```typescript
import clouds from '../assets/pictures/wallpapers/clouds.jpg';
import forest from '../assets/pictures/wallpapers/forest.jpg';
import goldWeave from '../assets/pictures/wallpapers/gold-weave.jpg';
import rivets from '../assets/pictures/wallpapers/rivets.jpg';
import sandstone from '../assets/pictures/wallpapers/sandstone.jpg';
import squares from '../assets/pictures/wallpapers/squares.jpg';
import tealTriangle from '../assets/pictures/wallpapers/teal-triangle.jpg';
import winlogo from '../assets/pictures/wallpapers/winlogo.jpg';
import pinstripe from '../assets/pictures/wallpapers/pinstripe.jpg';
import redBlocks from '../assets/pictures/wallpapers/red-blocks.jpg';
```

Replace `export const WALLPAPERS: WallpaperOption[] = [];` with:

```typescript
export const WALLPAPERS: WallpaperOption[] = [
    { name: 'None', url: '' },
    { name: 'Clouds', url: clouds },
    { name: 'Forest', url: forest },
    { name: 'Gold Weave', url: goldWeave },
    { name: 'Rivets', url: rivets },
    { name: 'Sandstone', url: sandstone },
    { name: 'Squares', url: squares },
    { name: 'Teal Triangles', url: tealTriangle },
    { name: 'Windows Logo', url: winlogo },
    { name: 'Pinstripe', url: pinstripe },
    { name: 'Red Blocks', url: redBlocks },
];
```

Also update `DEFAULT_SETTINGS.wallpaper` to use Clouds:

```typescript
export const DEFAULT_SETTINGS = {
    wallpaper: {
        name: 'Clouds',
        url: clouds,
        display: 'stretch' as const,
    },
    colorScheme: COLOR_SCHEMES[0],
    cursor: { scheme: 'Standard' },
};
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Compiles without errors. Image imports resolve.

- [ ] **Step 4: Commit**

```bash
git add src/assets/pictures/wallpapers/ src/constants/settings.ts
git commit -m "feat: add Win95 wallpaper assets and populate WALLPAPERS constant"
```

---

## Task 4: Download Win95 cursor assets

**Files:**
- Create: `src/assets/cursors/<scheme>/` directories + `.cur` files
- Create: `src/declarations.d.ts`
- Modify: `src/constants/settings.ts` (populate cursor URLs in CURSOR_SCHEMES)

- [ ] **Step 1: Download Win95 cursor sets**

Search for Win95 cursor packs at:
- https://www.rw-designer.com/cursor-set/windows-95-3d-white
- https://www.rw-designer.com/cursor-set/windows-95
- Search: "windows 95 cursor pack download site:rw-designer.com"

For each scheme, save 7 files:

```
src/assets/cursors/standard/normal.cur
src/assets/cursors/standard/help.cur
src/assets/cursors/standard/working.cur
src/assets/cursors/standard/busy.cur
src/assets/cursors/standard/precision.cur
src/assets/cursors/standard/text.cur
src/assets/cursors/standard/unavailable.cur

src/assets/cursors/3d-white/  (same 7 files)
src/assets/cursors/3d-black/  (same 7 files)
src/assets/cursors/dinosaur/  (same 7 files)
src/assets/cursors/jungle/    (same 7 files)
```

- [ ] **Step 2: Add cursor type declarations**

Create `src/declarations.d.ts`:

```typescript
declare module '*.cur' {
    const src: string;
    export default src;
}
```

- [ ] **Step 3: Update CURSOR_SCHEMES in settings.ts**

Add imports at the top of `src/constants/settings.ts`:

```typescript
import standardNormal from '../assets/cursors/standard/normal.cur';
import standardHelp from '../assets/cursors/standard/help.cur';
import standardWorking from '../assets/cursors/standard/working.cur';
import standardBusy from '../assets/cursors/standard/busy.cur';
import standardPrecision from '../assets/cursors/standard/precision.cur';
import standardText from '../assets/cursors/standard/text.cur';
import standardUnavailable from '../assets/cursors/standard/unavailable.cur';

import whiteNormal from '../assets/cursors/3d-white/normal.cur';
import whiteHelp from '../assets/cursors/3d-white/help.cur';
import whiteWorking from '../assets/cursors/3d-white/working.cur';
import whiteBusy from '../assets/cursors/3d-white/busy.cur';
import whitePrecision from '../assets/cursors/3d-white/precision.cur';
import whiteText from '../assets/cursors/3d-white/text.cur';
import whiteUnavailable from '../assets/cursors/3d-white/unavailable.cur';

import blackNormal from '../assets/cursors/3d-black/normal.cur';
import blackHelp from '../assets/cursors/3d-black/help.cur';
import blackWorking from '../assets/cursors/3d-black/working.cur';
import blackBusy from '../assets/cursors/3d-black/busy.cur';
import blackPrecision from '../assets/cursors/3d-black/precision.cur';
import blackText from '../assets/cursors/3d-black/text.cur';
import blackUnavailable from '../assets/cursors/3d-black/unavailable.cur';

import dinoNormal from '../assets/cursors/dinosaur/normal.cur';
import dinoHelp from '../assets/cursors/dinosaur/help.cur';
import dinoWorking from '../assets/cursors/dinosaur/working.cur';
import dinoBusy from '../assets/cursors/dinosaur/busy.cur';
import dinoPrecision from '../assets/cursors/dinosaur/precision.cur';
import dinoText from '../assets/cursors/dinosaur/text.cur';
import dinoUnavailable from '../assets/cursors/dinosaur/unavailable.cur';

import jungleNormal from '../assets/cursors/jungle/normal.cur';
import jungleHelp from '../assets/cursors/jungle/help.cur';
import jungleWorking from '../assets/cursors/jungle/working.cur';
import jungleBusy from '../assets/cursors/jungle/busy.cur';
import junglePrecision from '../assets/cursors/jungle/precision.cur';
import jungleText from '../assets/cursors/jungle/text.cur';
import jungleUnavailable from '../assets/cursors/jungle/unavailable.cur';
```

Replace the `export const CURSOR_SCHEMES` array with:

```typescript
export const CURSOR_SCHEMES: CursorScheme[] = [
    {
        name: 'Standard',
        key: 'standard',
        cursors: {
            normal: standardNormal,
            help: standardHelp,
            working: standardWorking,
            busy: standardBusy,
            precision: standardPrecision,
            text: standardText,
            unavailable: standardUnavailable,
        },
    },
    {
        name: '3D White',
        key: '3d-white',
        cursors: {
            normal: whiteNormal,
            help: whiteHelp,
            working: whiteWorking,
            busy: whiteBusy,
            precision: whitePrecision,
            text: whiteText,
            unavailable: whiteUnavailable,
        },
    },
    {
        name: '3D Black',
        key: '3d-black',
        cursors: {
            normal: blackNormal,
            help: blackHelp,
            working: blackWorking,
            busy: blackBusy,
            precision: blackPrecision,
            text: blackText,
            unavailable: blackUnavailable,
        },
    },
    {
        name: 'Dinosaur',
        key: 'dinosaur',
        cursors: {
            normal: dinoNormal,
            help: dinoHelp,
            working: dinoWorking,
            busy: dinoBusy,
            precision: dinoPrecision,
            text: dinoText,
            unavailable: dinoUnavailable,
        },
    },
    {
        name: 'Jungle',
        key: 'jungle',
        cursors: {
            normal: jungleNormal,
            help: jungleHelp,
            working: jungleWorking,
            busy: jungleBusy,
            precision: junglePrecision,
            text: jungleText,
            unavailable: jungleUnavailable,
        },
    },
];
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: No errors. `.cur` imports resolve.

- [ ] **Step 5: Commit**

```bash
git add src/assets/cursors/ src/declarations.d.ts src/constants/settings.ts
git commit -m "feat: add Win95 cursor assets and populate CURSOR_SCHEMES"
```

---

## Task 5: Apply settings to Desktop and Window chrome

**Files:**
- Modify: `src/components/os/Desktop.tsx`
- Modify: `src/components/os/Window.tsx`
- Create: `src/components/os/CursorStyleInjector.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Update Window.tsx to read color scheme from settings**

In `src/components/os/Window.tsx`, add this import after the existing imports:

```tsx
import { useSettingsContext } from '../../context/SettingsContext';
```

Inside the `Window` component function, add after the existing `useState` declarations:

```tsx
const { settings } = useSettingsContext();
const { titleBarStart, titleBarEnd } = settings.colorScheme;
```

Find the `topBar` style block in the JSX (the `style={Object.assign(..., styles.topBar, ...)}` expression) and replace it:

```tsx
style={Object.assign(
    {},
    styles.topBar,
    {
        background: `linear-gradient(to right, ${titleBarStart}, ${titleBarEnd})`,
    },
    props.windowBarColor && {
        background: props.windowBarColor,
    },
    !windowActive && {
        background: Colors.darkGray,
    }
)}
```

- [ ] **Step 2: Update Desktop.tsx to read wallpaper from settings**

In `src/components/os/Desktop.tsx`, add import:

```tsx
import { useSettings } from '../../hooks/useSettings';
```

Remove the existing `backgroundImage` import line:
```tsx
import backgroundImage from '../../assets/pictures/background.png';
```

Inside the `Desktop` component, after the existing `useState` declarations, add:

```tsx
const { settings } = useSettings();
const { wallpaper, colorScheme } = settings;
```

In the JSX return, replace `<div style={styles.desktop}>` with:

```tsx
<div style={Object.assign({}, styles.desktop, {
    backgroundColor: colorScheme.desktop,
    backgroundImage: wallpaper.url ? `url(${wallpaper.url})` : 'none',
    backgroundSize: wallpaper.display === 'stretch' ? 'cover'
        : wallpaper.display === 'tile' ? 'auto'
        : 'auto',
    backgroundRepeat: wallpaper.display === 'tile' ? 'repeat' : 'no-repeat',
    backgroundPosition: wallpaper.display === 'center' ? 'center' : 'top left',
})}>
```

In `styles.desktop` at the bottom, remove the `backgroundImage`, `backgroundSize`, `backgroundPosition`, and `backgroundRepeat` lines.

- [ ] **Step 3: Create CursorStyleInjector**

```tsx
// src/components/os/CursorStyleInjector.tsx
import React, { useEffect, useRef } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { CURSOR_SCHEMES } from '../../constants/settings';

const STYLE_TAG_ID = 'win95-cursor-style';

const CursorStyleInjector: React.FC = () => {
    const { settings } = useSettings();
    const styleRef = useRef<HTMLStyleElement | null>(null);

    useEffect(() => {
        const scheme = CURSOR_SCHEMES.find(s => s.name === settings.cursor.scheme);
        if (!scheme) return;

        let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = STYLE_TAG_ID;
            document.head.appendChild(styleTag);
        }
        styleRef.current = styleTag;

        const { cursors } = scheme;
        if (cursors.normal) {
            styleTag.textContent = `
                * { cursor: url(${cursors.normal}), auto !important; }
                a, button, [role="button"] { cursor: url(${cursors.normal}), pointer !important; }
                input, textarea { cursor: url(${cursors.text}), text !important; }
            `;
        } else {
            styleTag.textContent = '';
        }
    }, [settings.cursor.scheme]);

    return null;
};

export default CursorStyleInjector;
```

- [ ] **Step 4: Add CursorStyleInjector to App.tsx**

Replace `src/App.tsx`:

```tsx
import './App.css';
import Desktop from './components/os/Desktop';
import CursorStyleInjector from './components/os/CursorStyleInjector';

function App() {
    return (
        <div className="App">
            <CursorStyleInjector />
            <Desktop />
        </div>
    );
}

export default App;
```

- [ ] **Step 5: Start the app and verify**

```bash
npm start
```

Expected: Desktop shows teal `#008080` background (Windows Standard default). Title bar shows blue gradient. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/os/Window.tsx src/components/os/Desktop.tsx src/components/os/CursorStyleInjector.tsx src/App.tsx
git commit -m "feat: apply settings context to Desktop wallpaper and Window title bar"
```

---

## Task 6: Wallpaper settings panel

**Files:**
- Create: `src/components/applications/settings/WallpaperSettings.tsx`

- [ ] **Step 1: Create WallpaperSettings component**

```tsx
// src/components/applications/settings/WallpaperSettings.tsx
import React, { useState } from 'react';
import Window from '../../os/Window';
import Button from '../../os/Button';
import { useSettings } from '../../../hooks/useSettings';
import { WALLPAPERS, WallpaperOption } from '../../../constants/settings';
import Colors from '../../../constants/colors';

export interface WallpaperSettingsProps extends WindowAppProps {}

const WallpaperSettings: React.FC<WallpaperSettingsProps> = (props) => {
    const { settings, setWallpaper } = useSettings();
    const [draft, setDraft] = useState(settings.wallpaper);

    const handleSelect = (w: WallpaperOption) => {
        setDraft(prev => ({ ...prev, name: w.name, url: w.url }));
    };

    const handleDisplayChange = (display: 'tile' | 'center' | 'stretch') => {
        setDraft(prev => ({ ...prev, display }));
    };

    const handleApply = () => setWallpaper(draft);
    const handleOk = () => { setWallpaper(draft); props.onClose(); };
    const handleCancel = () => props.onClose();

    return (
        <Window
            top={120}
            left={200}
            width={420}
            height={480}
            windowTitle="Display Properties"
            windowBarIcon="computerSmall"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div style={styles.container}>
                <div style={styles.tabStrip}>
                    <div style={styles.activeTab}><p style={styles.tabText}>Background</p></div>
                </div>
                <div style={styles.body}>
                    {/* Monitor preview */}
                    <div style={styles.monitorOuter}>
                        <div style={styles.monitorScreen}>
                            <div style={Object.assign({}, styles.monitorPreview, {
                                backgroundImage: draft.url ? `url(${draft.url})` : 'none',
                                backgroundColor: '#008080',
                                backgroundSize: draft.display === 'stretch' ? 'cover'
                                    : draft.display === 'tile' ? 'auto' : 'auto',
                                backgroundRepeat: draft.display === 'tile' ? 'repeat' : 'no-repeat',
                                backgroundPosition: draft.display === 'center' ? 'center' : 'top left',
                            })} />
                        </div>
                        <div style={styles.monitorStand} />
                        <div style={styles.monitorBase} />
                    </div>

                    {/* Wallpaper list */}
                    <div style={styles.section}>
                        <p style={styles.label}>Wallpaper:</p>
                        <div style={styles.listBox}>
                            {WALLPAPERS.map(w => (
                                <div
                                    key={w.name}
                                    style={Object.assign({}, styles.listItem,
                                        draft.name === w.name && styles.listItemSelected
                                    )}
                                    onMouseDown={() => handleSelect(w)}
                                >
                                    <p style={styles.listItemText}>{w.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Display options */}
                    <div style={styles.section}>
                        <p style={styles.label}>Display:</p>
                        <div style={styles.radioGroup}>
                            {(['tile', 'center', 'stretch'] as const).map(opt => (
                                <label key={opt} style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="display"
                                        value={opt}
                                        checked={draft.display === opt}
                                        onChange={() => handleDisplayChange(opt)}
                                    />
                                    <p style={styles.radioText}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</p>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={styles.buttonRow}>
                    <Button text="OK" onClick={handleOk} />
                    <Button text="Cancel" onClick={handleCancel} />
                    <Button text="Apply" onClick={handleApply} />
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: { flexDirection: 'column', flex: 1, backgroundColor: Colors.lightGray, padding: 8 },
    tabStrip: { flexDirection: 'row', marginBottom: -1 },
    activeTab: {
        border: `1px solid ${Colors.darkGray}`,
        borderBottomColor: Colors.lightGray,
        borderTopColor: Colors.white,
        borderLeftColor: Colors.white,
        backgroundColor: Colors.lightGray,
        padding: '2px 12px',
        marginRight: 2,
    },
    tabText: { fontSize: 12, fontFamily: 'MSSerif' },
    body: {
        flexDirection: 'column',
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: Colors.white,
        borderLeftColor: Colors.white,
        padding: 12,
        flex: 1,
        backgroundColor: Colors.lightGray,
    },
    monitorOuter: { alignItems: 'center', flexDirection: 'column', marginBottom: 12 },
    monitorScreen: { width: 160, height: 120, border: `4px solid ${Colors.darkGray}`, backgroundColor: Colors.black, padding: 4 },
    monitorPreview: { flex: 1, width: '100%', height: '100%' },
    monitorStand: { width: 20, height: 16, backgroundColor: Colors.darkGray },
    monitorBase: { width: 60, height: 8, backgroundColor: Colors.darkGray },
    section: { flexDirection: 'column', marginBottom: 8 },
    label: { fontSize: 12, fontFamily: 'MSSerif', marginBottom: 4 },
    listBox: {
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: Colors.black,
        borderLeftColor: Colors.black,
        backgroundColor: Colors.white,
        height: 100,
        overflowY: 'scroll',
        flexDirection: 'column',
    },
    listItem: { padding: '2px 4px', cursor: 'default' },
    listItemSelected: { backgroundColor: Colors.blue, color: Colors.white },
    listItemText: { fontSize: 12, fontFamily: 'MSSerif' },
    radioGroup: { flexDirection: 'row', gap: 16 },
    radioLabel: { flexDirection: 'row', alignItems: 'center', cursor: 'default' },
    radioText: { fontSize: 12, fontFamily: 'MSSerif' },
    buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 4, marginTop: 8 },
};

export default WallpaperSettings;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/applications/settings/WallpaperSettings.tsx
git commit -m "feat: add WallpaperSettings panel with monitor preview and wallpaper list"
```

---

## Task 7: Appearance settings panel

**Files:**
- Create: `src/components/applications/settings/AppearanceSettings.tsx`

- [ ] **Step 1: Create AppearanceSettings component**

```tsx
// src/components/applications/settings/AppearanceSettings.tsx
import React, { useState } from 'react';
import Window from '../../os/Window';
import Button from '../../os/Button';
import { useSettings } from '../../../hooks/useSettings';
import { COLOR_SCHEMES, ColorScheme } from '../../../constants/settings';
import Colors from '../../../constants/colors';

export interface AppearanceSettingsProps extends WindowAppProps {}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = (props) => {
    const { settings, setColorScheme } = useSettings();
    const [draft, setDraft] = useState<ColorScheme>(settings.colorScheme);

    const handleSchemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const found = COLOR_SCHEMES.find(s => s.name === e.target.value);
        if (found) setDraft(found);
    };

    const handleApply = () => setColorScheme(draft);
    const handleOk = () => { setColorScheme(draft); props.onClose(); };
    const handleCancel = () => props.onClose();

    return (
        <Window
            top={140}
            left={240}
            width={440}
            height={400}
            windowTitle="Display Properties"
            windowBarIcon="computerSmall"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div style={styles.container}>
                <div style={styles.tabStrip}>
                    <div style={styles.activeTab}><p style={styles.tabText}>Appearance</p></div>
                </div>
                <div style={styles.body}>
                    <p style={styles.label}>Preview:</p>
                    <div style={Object.assign({}, styles.previewPane, { backgroundColor: draft.desktop })}>
                        <div style={styles.sampleWindow}>
                            <div style={Object.assign({}, styles.sampleTitleBar, {
                                background: `linear-gradient(to right, ${draft.titleBarStart}, ${draft.titleBarEnd})`,
                            })}>
                                <p style={Object.assign({}, styles.sampleTitleText, { color: draft.titleBarText })}>
                                    Active Window
                                </p>
                            </div>
                            <div style={Object.assign({}, styles.sampleBody, { backgroundColor: draft.buttonFace })}>
                                <div style={styles.sampleButton}>
                                    <p style={Object.assign({}, styles.sampleButtonText, { color: draft.buttonText })}>Normal</p>
                                </div>
                                <div style={Object.assign({}, styles.sampleButton, { opacity: 0.5 })}>
                                    <p style={Object.assign({}, styles.sampleButtonText, { color: draft.buttonText })}>Disabled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.section}>
                        <p style={styles.label}>Scheme:</p>
                        <select value={draft.name} onChange={handleSchemeChange} style={styles.select}>
                            {COLOR_SCHEMES.map(s => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={styles.buttonRow}>
                    <Button text="OK" onClick={handleOk} />
                    <Button text="Cancel" onClick={handleCancel} />
                    <Button text="Apply" onClick={handleApply} />
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: { flexDirection: 'column', flex: 1, backgroundColor: Colors.lightGray, padding: 8 },
    tabStrip: { flexDirection: 'row', marginBottom: -1 },
    activeTab: {
        border: `1px solid ${Colors.darkGray}`,
        borderBottomColor: Colors.lightGray,
        borderTopColor: Colors.white,
        borderLeftColor: Colors.white,
        backgroundColor: Colors.lightGray,
        padding: '2px 12px',
        marginRight: 2,
    },
    tabText: { fontSize: 12, fontFamily: 'MSSerif' },
    body: {
        flexDirection: 'column',
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: Colors.white,
        borderLeftColor: Colors.white,
        padding: 12,
        flex: 1,
        backgroundColor: Colors.lightGray,
    },
    previewPane: { height: 120, marginBottom: 16, padding: 8, alignItems: 'center', justifyContent: 'center' },
    sampleWindow: { width: 240, border: `2px solid #000`, flexDirection: 'column' },
    sampleTitleBar: { height: 18, alignItems: 'center', paddingLeft: 4 },
    sampleTitleText: { fontSize: 10, fontFamily: 'MSSerif' },
    sampleBody: { padding: 8, flexDirection: 'row', gap: 8 },
    sampleButton: { border: `1px solid #000`, padding: '2px 8px', backgroundColor: '#c3c6ca' },
    sampleButtonText: { fontSize: 10, fontFamily: 'MSSerif' },
    section: { flexDirection: 'column', marginBottom: 8 },
    label: { fontSize: 12, fontFamily: 'MSSerif', marginBottom: 4 },
    select: {
        fontFamily: 'MSSerif',
        fontSize: 12,
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: Colors.black,
        borderLeftColor: Colors.black,
        backgroundColor: Colors.white,
        padding: '2px 4px',
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 4, marginTop: 8 },
};

export default AppearanceSettings;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/applications/settings/AppearanceSettings.tsx
git commit -m "feat: add AppearanceSettings panel with live color scheme preview"
```

---

## Task 8: Cursor settings panel

**Files:**
- Create: `src/components/applications/settings/CursorSettings.tsx`

- [ ] **Step 1: Create CursorSettings component**

```tsx
// src/components/applications/settings/CursorSettings.tsx
import React, { useState } from 'react';
import Window from '../../os/Window';
import Button from '../../os/Button';
import { useSettings } from '../../../hooks/useSettings';
import { CURSOR_SCHEMES, CursorScheme } from '../../../constants/settings';
import Colors from '../../../constants/colors';

export interface CursorSettingsProps extends WindowAppProps {}

const CURSOR_ROLES: { label: string; key: keyof CursorScheme['cursors'] }[] = [
    { label: 'Normal Select', key: 'normal' },
    { label: 'Help Select', key: 'help' },
    { label: 'Working in Background', key: 'working' },
    { label: 'Busy', key: 'busy' },
    { label: 'Precision Select', key: 'precision' },
    { label: 'Text Select', key: 'text' },
    { label: 'Unavailable', key: 'unavailable' },
];

const CursorSettings: React.FC<CursorSettingsProps> = (props) => {
    const { settings, setCursor } = useSettings();
    const [draftScheme, setDraftScheme] = useState(settings.cursor.scheme);

    const activeScheme = CURSOR_SCHEMES.find(s => s.name === draftScheme) ?? CURSOR_SCHEMES[0];

    const handleSchemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDraftScheme(e.target.value);
    };

    const handleApply = () => setCursor({ scheme: draftScheme });
    const handleOk = () => { setCursor({ scheme: draftScheme }); props.onClose(); };
    const handleCancel = () => props.onClose();

    return (
        <Window
            top={160}
            left={280}
            width={420}
            height={420}
            windowTitle="Mouse Properties"
            windowBarIcon="computerSmall"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div style={styles.container}>
                <div style={styles.tabStrip}>
                    <div style={styles.activeTab}><p style={styles.tabText}>Pointers</p></div>
                </div>
                <div style={styles.body}>
                    <div style={styles.section}>
                        <p style={styles.label}>Scheme:</p>
                        <select value={draftScheme} onChange={handleSchemeChange} style={styles.select}>
                            {CURSOR_SCHEMES.map(s => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={styles.listBox}>
                        {CURSOR_ROLES.map(role => (
                            <div key={role.key} style={styles.roleRow}>
                                <p style={styles.roleLabel}>{role.label}</p>
                                <div style={styles.cursorPreview}>
                                    {activeScheme.cursors[role.key] ? (
                                        <img
                                            src={activeScheme.cursors[role.key]}
                                            alt={role.label}
                                            style={styles.cursorImage}
                                        />
                                    ) : (
                                        <p style={styles.cursorPlaceholder}>—</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={styles.buttonRow}>
                    <Button text="OK" onClick={handleOk} />
                    <Button text="Cancel" onClick={handleCancel} />
                    <Button text="Apply" onClick={handleApply} />
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: { flexDirection: 'column', flex: 1, backgroundColor: Colors.lightGray, padding: 8 },
    tabStrip: { flexDirection: 'row', marginBottom: -1 },
    activeTab: {
        border: `1px solid ${Colors.darkGray}`,
        borderBottomColor: Colors.lightGray,
        borderTopColor: Colors.white,
        borderLeftColor: Colors.white,
        backgroundColor: Colors.lightGray,
        padding: '2px 12px',
    },
    tabText: { fontSize: 12, fontFamily: 'MSSerif' },
    body: {
        flexDirection: 'column',
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: Colors.white,
        borderLeftColor: Colors.white,
        padding: 12,
        flex: 1,
        backgroundColor: Colors.lightGray,
    },
    section: { flexDirection: 'column', marginBottom: 12 },
    label: { fontSize: 12, fontFamily: 'MSSerif', marginBottom: 4 },
    select: {
        fontFamily: 'MSSerif',
        fontSize: 12,
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: Colors.black,
        borderLeftColor: Colors.black,
        backgroundColor: Colors.white,
        padding: '2px 4px',
    },
    listBox: {
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: Colors.black,
        borderLeftColor: Colors.black,
        backgroundColor: Colors.white,
        flexDirection: 'column',
        overflowY: 'scroll',
        flex: 1,
    },
    roleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 8px',
        borderBottom: `1px solid ${Colors.lightGray}`,
    },
    roleLabel: { fontSize: 12, fontFamily: 'MSSerif', flex: 1 },
    cursorPreview: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    cursorImage: { width: 24, height: 24, objectFit: 'contain' },
    cursorPlaceholder: { fontSize: 12, color: Colors.darkGray },
    buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 4, marginTop: 8 },
};

export default CursorSettings;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/applications/settings/CursorSettings.tsx
git commit -m "feat: add CursorSettings panel with scheme dropdown and cursor role previews"
```

---

## Task 9: Control Panel folder window

**Files:**
- Create: `src/components/applications/ControlPanel.tsx`

- [ ] **Step 1: Create ControlPanel component**

```tsx
// src/components/applications/ControlPanel.tsx
import React from 'react';
import Window from '../os/Window';
import Colors from '../../constants/colors';
import WallpaperSettings from './settings/WallpaperSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import CursorSettings from './settings/CursorSettings';

export interface ControlPanelProps extends WindowAppProps {
    addWindow: (key: string, element: JSX.Element) => void;
}

interface PanelIcon {
    key: string;
    label: string;
    emoji: string;
    component: (props: WindowAppProps) => JSX.Element;
}

const PANEL_ICONS: PanelIcon[] = [
    {
        key: 'display',
        label: 'Display',
        emoji: '🖥️',
        component: (p) => <WallpaperSettings {...p} />,
    },
    {
        key: 'appearance',
        label: 'Appearance',
        emoji: '🎨',
        component: (p) => <AppearanceSettings {...p} />,
    },
    {
        key: 'mouse',
        label: 'Mouse',
        emoji: '🖱️',
        component: (p) => <CursorSettings {...p} />,
    },
];

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const openPanel = (panel: PanelIcon) => {
        props.addWindow(`settings-${panel.key}`, panel.component({
            onClose: () => {},
            onInteract: () => {},
            onMinimize: () => {},
        }));
    };

    return (
        <Window
            top={80}
            left={160}
            width={380}
            height={280}
            windowTitle="Control Panel"
            windowBarIcon="computerSmall"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText="3 object(s)"
        >
            <div style={styles.container}>
                <div style={styles.toolbar}>
                    <p style={styles.toolbarText}>File  Edit  View  Help</p>
                </div>
                <div style={styles.iconGrid}>
                    {PANEL_ICONS.map(panel => (
                        <div
                            key={panel.key}
                            style={styles.iconItem}
                            onDoubleClick={() => openPanel(panel)}
                            title={`Open ${panel.label}`}
                        >
                            <div style={styles.iconEmoji}>
                                <span style={{ fontSize: 32 }}>{panel.emoji}</span>
                            </div>
                            <p style={styles.iconLabel}>{panel.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: { flexDirection: 'column', flex: 1, backgroundColor: Colors.white },
    toolbar: {
        backgroundColor: Colors.lightGray,
        borderBottom: `1px solid ${Colors.darkGray}`,
        padding: '2px 8px',
        flexShrink: 0,
    },
    toolbarText: { fontSize: 12, fontFamily: 'MSSerif' },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 24,
        flex: 1,
        alignContent: 'flex-start',
    },
    iconItem: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 72,
        cursor: 'default',
        padding: 4,
    },
    iconEmoji: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    iconLabel: { fontSize: 11, fontFamily: 'MSSerif', textAlign: 'center' },
};

export default ControlPanel;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/applications/ControlPanel.tsx
git commit -m "feat: add ControlPanel folder window with Display, Appearance, Mouse icons"
```

---

## Task 10: Wire ControlPanel into Desktop

**Files:**
- Modify: `src/components/os/Desktop.tsx`

- [ ] **Step 1: Add imports to Desktop.tsx**

Add at the top of `src/components/os/Desktop.tsx`:

```tsx
import ControlPanel from '../applications/ControlPanel';
import WallpaperSettings from '../applications/settings/WallpaperSettings';
import AppearanceSettings from '../applications/settings/AppearanceSettings';
import CursorSettings from '../applications/settings/CursorSettings';
```

- [ ] **Step 2: Add controlPanel and settings entries to APPLICATIONS**

Add to the `APPLICATIONS` object:

```tsx
controlPanel: {
    key: 'controlPanel',
    name: 'Control Panel',
    shortcutIcon: 'computerSmall',
    component: ControlPanel,
},
'settings-display': {
    key: 'settings-display',
    name: 'Display',
    shortcutIcon: 'computerSmall',
    component: WallpaperSettings,
},
'settings-appearance': {
    key: 'settings-appearance',
    name: 'Appearance',
    shortcutIcon: 'computerSmall',
    component: AppearanceSettings,
},
'settings-mouse': {
    key: 'settings-mouse',
    name: 'Mouse',
    shortcutIcon: 'computerSmall',
    component: CursorSettings,
},
```

- [ ] **Step 3: Add addWindowForSettings inside Desktop component**

Inside the `Desktop` component, after the existing `addWindow` definition, add:

```tsx
const addWindowForSettings = useCallback(
    (key: string, element: JSX.Element) => {
        const settingsComponents: Record<string, React.FC<ExtendedWindowAppProps<any>>> = {
            'settings-display': WallpaperSettings,
            'settings-appearance': AppearanceSettings,
            'settings-mouse': CursorSettings,
        };
        const Component = settingsComponents[key];
        if (!Component) return;
        addWindow(
            key,
            <Component
                onInteract={() => onWindowInteract(key)}
                onMinimize={() => minimizeWindow(key)}
                onClose={() => removeWindow(key)}
                key={key}
            />
        );
    },
    [addWindow, onWindowInteract, minimizeWindow, removeWindow]
);
```

- [ ] **Step 4: Pass addWindowForSettings to ControlPanel**

In the `useEffect` that builds shortcuts, find where `<app.component ... />` is rendered and update it to pass `addWindow` when the key is `controlPanel`:

```tsx
<app.component
    onInteract={() => onWindowInteract(app.key)}
    onMinimize={() => minimizeWindow(app.key)}
    onClose={() => removeWindow(app.key)}
    key={app.key}
    {...(app.key === 'controlPanel' && { addWindow: addWindowForSettings })}
/>
```

Note: The settings sub-panel entries (`settings-display`, etc.) should NOT get desktop shortcuts. In the shortcut-building `useEffect`, skip them:

```tsx
Object.keys(APPLICATIONS).forEach((key) => {
    if (key.startsWith('settings-')) return;  // add this line
    const app = APPLICATIONS[key];
    // ... rest of shortcut creation
});
```

- [ ] **Step 5: Verify TypeScript and test**

```bash
npx tsc --noEmit
npm start
```

Expected:
- "Control Panel" desktop shortcut appears
- Opening it shows 3 icons: Display, Appearance, Mouse
- Double-clicking each opens the corresponding panel as a separate draggable window
- All panels have working OK / Cancel / Apply buttons

- [ ] **Step 6: Commit**

```bash
git add src/components/os/Desktop.tsx
git commit -m "feat: register ControlPanel in Desktop and wire addWindow for sub-panels"
```

---

## Task 11: Final smoke test

- [ ] **Step 1: Test wallpaper**
  1. Open Control Panel → Display
  2. Click a wallpaper name — monitor preview updates
  3. Change display mode — preview updates
  4. Click Apply — desktop background updates live
  5. Reload page — wallpaper persists

- [ ] **Step 2: Test color scheme**
  1. Open Control Panel → Appearance
  2. Select "Desert" from dropdown — preview pane shows new colors
  3. Click Apply — all window title bars update to new gradient
  4. Reload — scheme persists

- [ ] **Step 3: Test cursor (requires assets)**
  1. Open Control Panel → Mouse
  2. Select "3D White" — cursor images update in list
  3. Click Apply — cursor changes site-wide
  4. Reload — cursor persists

- [ ] **Step 4: Test Cancel discards**
  1. Open any panel, change a setting, click Cancel
  2. Verify desktop did NOT change

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Win95 Settings / Control Panel with wallpaper, appearance, and cursor panels"
```
