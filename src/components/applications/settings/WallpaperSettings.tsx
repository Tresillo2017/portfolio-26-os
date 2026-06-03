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
        setDraft((prev) => ({ ...prev, name: w.name, url: w.url }));
    };

    const handleDisplayChange = (display: 'tile' | 'center' | 'stretch') => {
        setDraft((prev) => ({ ...prev, display }));
    };

    const handleApply = () => setWallpaper(draft);
    const handleOk = () => {
        setWallpaper(draft);
        props.onClose();
    };
    const handleCancel = () => props.onClose();

    return (
        <Window
            top={120}
            left={200}
            width={420}
            height={500}
            windowTitle="Display Properties"
            windowBarIcon="computerSmall"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div style={styles.container}>
                <div style={styles.tabStrip}>
                    <div style={styles.activeTab}>
                        <p style={styles.tabText}>Background</p>
                    </div>
                </div>

                <div style={styles.body}>
                    {/* Monitor preview */}
                    <div style={styles.monitorOuter}>
                        <div style={styles.monitorScreen}>
                            <div
                                style={Object.assign({}, styles.monitorPreview, {
                                    backgroundImage: draft.url
                                        ? `url(${draft.url})`
                                        : 'none',
                                    backgroundColor: '#008080',
                                    backgroundSize:
                                        draft.display === 'stretch'
                                            ? 'cover'
                                            : 'auto',
                                    backgroundRepeat:
                                        draft.display === 'tile'
                                            ? 'repeat'
                                            : 'no-repeat',
                                    backgroundPosition:
                                        draft.display === 'center'
                                            ? 'center'
                                            : 'top left',
                                })}
                            />
                        </div>
                        <div style={styles.monitorStand} />
                        <div style={styles.monitorBase} />
                    </div>

                    {/* Wallpaper list */}
                    <div style={styles.section}>
                        <p style={styles.label}>Wallpaper:</p>
                        <div style={styles.listBox}>
                            {WALLPAPERS.map((w) => (
                                <div
                                    key={w.name}
                                    style={Object.assign(
                                        {},
                                        styles.listItem,
                                        draft.name === w.name &&
                                            styles.listItemSelected
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
                            {(
                                ['tile', 'center', 'stretch'] as const
                            ).map((opt) => (
                                <label key={opt} style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="display"
                                        value={opt}
                                        checked={draft.display === opt}
                                        onChange={() =>
                                            handleDisplayChange(opt)
                                        }
                                    />
                                    <p style={styles.radioText}>
                                        {opt.charAt(0).toUpperCase() +
                                            opt.slice(1)}
                                    </p>
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
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: Colors.lightGray,
        padding: 8,
    },
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
    monitorOuter: {
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 12,
    },
    monitorScreen: {
        width: 160,
        height: 120,
        border: `4px solid ${Colors.darkGray}`,
        backgroundColor: Colors.black,
        padding: 4,
        boxSizing: 'border-box',
    },
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
        height: 110,
        overflowY: 'scroll',
        flexDirection: 'column',
    },
    listItem: { padding: '2px 6px', cursor: 'default' },
    listItemSelected: { backgroundColor: Colors.blue, color: Colors.white },
    listItemText: { fontSize: 12, fontFamily: 'MSSerif' },
    radioGroup: { flexDirection: 'row', gap: 16 },
    radioLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'default',
    },
    radioText: { fontSize: 12, fontFamily: 'MSSerif', marginLeft: 4 },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 4,
        marginTop: 8,
    },
};

export default WallpaperSettings;
