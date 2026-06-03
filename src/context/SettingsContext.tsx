import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { COLOR_SCHEMES, ColorScheme, DEFAULT_SETTINGS } from '../constants/settings';

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
        // Rehydrate colorScheme from name so stale stored objects use fresh palette
        const colorScheme =
            COLOR_SCHEMES.find((s) => s.name === parsed.colorScheme?.name) ??
            DEFAULT_SETTINGS.colorScheme;
        return { ...DEFAULT_SETTINGS, ...parsed, colorScheme };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [settings, setSettings] = useState<SettingsState>(loadSettings);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    const setWallpaper = useCallback((wallpaper: WallpaperState) => {
        setSettings((prev) => ({ ...prev, wallpaper }));
    }, []);

    const setColorScheme = useCallback((colorScheme: ColorScheme) => {
        setSettings((prev) => ({ ...prev, colorScheme }));
    }, []);

    const setCursor = useCallback((cursor: CursorState) => {
        setSettings((prev) => ({ ...prev, cursor }));
    }, []);

    return (
        <SettingsContext.Provider
            value={{ settings, setWallpaper, setColorScheme, setCursor }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export function useSettingsContext(): SettingsContextValue {
    const ctx = useContext(SettingsContext);
    if (!ctx)
        throw new Error('useSettingsContext must be used inside SettingsProvider');
    return ctx;
}
