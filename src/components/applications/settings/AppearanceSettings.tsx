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
        const found = COLOR_SCHEMES.find((s) => s.name === e.target.value);
        if (found) setDraft(found);
    };

    const handleApply = () => setColorScheme(draft);
    const handleOk = () => {
        setColorScheme(draft);
        props.onClose();
    };
    const handleCancel = () => props.onClose();

    return (
        <Window
            top={140}
            left={240}
            width={440}
            height={380}
            windowTitle="Display Properties"
            windowBarIcon="computerSmall"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div style={styles.container}>
                <div style={styles.tabStrip}>
                    <div style={styles.activeTab}>
                        <p style={styles.tabText}>Appearance</p>
                    </div>
                </div>

                <div style={styles.body}>
                    <p style={styles.label}>Preview:</p>
                    <div
                        style={Object.assign({}, styles.previewPane, {
                            backgroundColor: draft.desktop,
                        })}
                    >
                        <div style={styles.sampleWindow}>
                            <div
                                style={Object.assign(
                                    {},
                                    styles.sampleTitleBar,
                                    {
                                        background: `linear-gradient(to right, ${draft.titleBarStart}, ${draft.titleBarEnd})`,
                                    }
                                )}
                            >
                                <p
                                    style={Object.assign(
                                        {},
                                        styles.sampleTitleText,
                                        { color: draft.titleBarText }
                                    )}
                                >
                                    Active Window
                                </p>
                            </div>
                            <div
                                style={Object.assign({}, styles.sampleBody, {
                                    backgroundColor: draft.buttonFace,
                                })}
                            >
                                <div style={styles.sampleButton}>
                                    <p
                                        style={Object.assign(
                                            {},
                                            styles.sampleButtonText,
                                            { color: draft.buttonText }
                                        )}
                                    >
                                        Normal
                                    </p>
                                </div>
                                <div
                                    style={Object.assign(
                                        {},
                                        styles.sampleButton,
                                        { opacity: 0.5 }
                                    )}
                                >
                                    <p
                                        style={Object.assign(
                                            {},
                                            styles.sampleButtonText,
                                            { color: draft.buttonText }
                                        )}
                                    >
                                        Disabled
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <p style={styles.label}>Scheme:</p>
                        <select
                            value={draft.name}
                            onChange={handleSchemeChange}
                            style={styles.select}
                        >
                            {COLOR_SCHEMES.map((s) => (
                                <option key={s.name} value={s.name}>
                                    {s.name}
                                </option>
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
    previewPane: {
        height: 120,
        marginBottom: 16,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sampleWindow: {
        width: 240,
        border: `2px solid ${Colors.black}`,
        flexDirection: 'column',
    },
    sampleTitleBar: { height: 18, alignItems: 'center', paddingLeft: 4 },
    sampleTitleText: { fontSize: 10, fontFamily: 'MSSerif' },
    sampleBody: { padding: 8, flexDirection: 'row', gap: 8 },
    sampleButton: {
        border: `1px solid ${Colors.black}`,
        padding: '2px 8px',
        backgroundColor: '#c3c6ca',
    },
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 4,
        marginTop: 8,
    },
};

export default AppearanceSettings;
