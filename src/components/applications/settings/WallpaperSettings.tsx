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
                    <div style={styles.inactiveTab}>
                        <p style={styles.tabText}>Screen Saver</p>
                    </div>
                    <div style={styles.inactiveTab}>
                        <p style={styles.tabText}>Appearance</p>
                    </div>
                    <div style={styles.inactiveTab}>
                        <p style={styles.tabText}>Settings</p>
                    </div>
                </div>

                <div style={styles.body}>
                    {/* Monitor preview */}
                    <div style={styles.monitorOuter}>
                        <div style={styles.monitorBody}>
                            <div style={styles.screenBezel}>
                                <div
                                    style={Object.assign(
                                        {},
                                        styles.screenInner,
                                        {
                                            backgroundImage: draft.url
                                                ? `url(${draft.url})`
                                                : 'none',
                                            backgroundColor: '#008080',
                                            backgroundSize:
                                                draft.display === 'stretch'
                                                    ? '100% 100%'
                                                    : 'auto',
                                            backgroundRepeat:
                                                draft.display === 'tile'
                                                    ? 'repeat'
                                                    : 'no-repeat',
                                            backgroundPosition:
                                                draft.display === 'center'
                                                    ? 'center'
                                                    : 'top left',
                                        },
                                    )}
                                />
                            </div>
                            <div style={styles.powerLight} />
                        </div>
                        <div style={styles.monitorNeck} />
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
                                            styles.listItemSelected,
                                    )}
                                    onMouseDown={() => handleSelect(w)}
                                >
                                    <p
                                        style={Object.assign(
                                            {},
                                            styles.listItemText,
                                            draft.name === w.name && {
                                                color: Colors.white,
                                            },
                                        )}
                                    >
                                        {w.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Display options */}
                    <div style={styles.section}>
                        <p style={styles.label}>Display:</p>
                        <div style={styles.radioGroup}>
                            {(['tile', 'center', 'stretch'] as const).map(
                                (opt) => (
                                    <label key={opt} style={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="display"
                                            value={opt}
                                            checked={draft.display === opt}
                                            onChange={() =>
                                                handleDisplayChange(opt)
                                            }
                                            style={{ marginRight: 4 }}
                                        />
                                        <p style={styles.radioText}>
                                            {opt.charAt(0).toUpperCase() +
                                                opt.slice(1)}
                                        </p>
                                    </label>
                                ),
                            )}
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
    tabStrip: {
        flexDirection: 'row',
        marginBottom: -1,
        alignItems: 'flex-end',
    },
    activeTab: {
        border: `1px solid ${Colors.darkGray}`,
        borderBottomColor: Colors.lightGray,
        borderTopColor: Colors.white,
        borderLeftColor: Colors.white,
        backgroundColor: Colors.lightGray,
        padding: '3px 12px',
        marginRight: 2,
        zIndex: 1,
    },
    inactiveTab: {
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: Colors.white,
        borderLeftColor: Colors.white,
        backgroundColor: '#b0b3b7',
        padding: '2px 12px',
        marginRight: 2,
        marginTop: 2,
    },
    tabText: { fontSize: 12, fontFamily: 'MSSerif' },
    body: {
        flexDirection: 'column',
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: Colors.white,
        borderLeftColor: Colors.white,
        padding: '12px 12px 8px',
        flex: 1,
        backgroundColor: Colors.lightGray,
    },
    monitorOuter: {
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 14,
    },
    monitorBody: {
        width: 180,
        height: 140,
        backgroundColor: Colors.lightGray,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: `2px solid ${Colors.white}`,
        borderLeft: `2px solid ${Colors.white}`,
        borderRight: `2px solid ${Colors.darkGray}`,
        borderBottom: `2px solid ${Colors.darkGray}`,
    },
    screenBezel: {
        width: 148,
        height: 108,
        borderTop: `2px solid ${Colors.darkGray}`,
        borderLeft: `2px solid ${Colors.darkGray}`,
        borderRight: `2px solid ${Colors.white}`,
        borderBottom: `2px solid ${Colors.white}`,
        padding: 2,
        backgroundColor: Colors.black,
        boxSizing: 'border-box' as const,
    },
    screenInner: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    powerLight: {
        width: 6,
        height: 6,
        backgroundColor: '#00cc00',
        borderRadius: '50%',
        marginTop: 4,
        alignSelf: 'flex-end',
        marginRight: 8,
    },
    monitorNeck: {
        width: 24,
        height: 10,
        backgroundColor: Colors.lightGray,
        borderLeft: `1px solid ${Colors.darkGray}`,
        borderRight: `1px solid ${Colors.white}`,
    },
    monitorBase: {
        width: 80,
        height: 10,
        backgroundColor: Colors.lightGray,
        borderTop: `2px solid ${Colors.white}`,
        borderLeft: `2px solid ${Colors.white}`,
        borderRight: `2px solid ${Colors.darkGray}`,
        borderBottom: `2px solid ${Colors.darkGray}`,
    },
    section: { flexDirection: 'column', marginBottom: 10 },
    label: { fontSize: 12, fontFamily: 'MSSerif', marginBottom: 4 },
    listBox: {
        borderTop: `1px solid ${Colors.black}`,
        borderLeft: `1px solid ${Colors.black}`,
        borderRight: `1px solid ${Colors.white}`,
        borderBottom: `1px solid ${Colors.white}`,
        outline: `1px solid ${Colors.darkGray}`,
        backgroundColor: Colors.white,
        height: 110,
        overflowY: 'scroll',
        flexDirection: 'column',
    },
    listItem: {
        padding: '2px 6px',
        cursor: 'default',
        flexShrink: 0,
    },
    listItemSelected: {
        backgroundColor: Colors.blue,
    },
    listItemText: { fontSize: 12, fontFamily: 'MSSerif', color: Colors.black },
    radioGroup: { flexDirection: 'row', gap: 20 },
    radioLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'default',
    },
    radioText: { fontSize: 12, fontFamily: 'MSSerif' },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 4,
        marginTop: 8,
    },
};

export default WallpaperSettings;
