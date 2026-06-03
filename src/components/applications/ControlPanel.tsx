import React from 'react';
import Window from '../os/Window';
import Colors from '../../constants/colors';
import WallpaperSettings from './settings/WallpaperSettings';
import AppearanceSettings from './settings/AppearanceSettings';

export interface ControlPanelProps extends WindowAppProps {
    addWindow: (key: string, element: JSX.Element) => void;
}

interface PanelIcon {
    key: string;
    label: string;
    emoji: string;
    renderPanel: (onClose: () => void, onInteract: () => void, onMinimize: () => void) => JSX.Element;
}

const PANEL_ICONS: PanelIcon[] = [
    {
        key: 'settings-display',
        label: 'Display',
        emoji: '🖥️',
        renderPanel: (onClose, onInteract, onMinimize) => (
            <WallpaperSettings
                onClose={onClose}
                onInteract={onInteract}
                onMinimize={onMinimize}
            />
        ),
    },
    {
        key: 'settings-appearance',
        label: 'Appearance',
        emoji: '🎨',
        renderPanel: (onClose, onInteract, onMinimize) => (
            <AppearanceSettings
                onClose={onClose}
                onInteract={onInteract}
                onMinimize={onMinimize}
            />
        ),
    },
];

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const openPanel = (panel: PanelIcon) => {
        props.addWindow(
            panel.key,
            panel.renderPanel(() => {}, () => {}, () => {})
        );
    };

    return (
        <Window
            top={80}
            left={160}
            width={380}
            height={260}
            windowTitle="Control Panel"
            windowBarIcon="computerSmall"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText="2 object(s)"
        >
            <div style={styles.container}>
                <div style={styles.toolbar}>
                    <p style={styles.toolbarText}>File&nbsp;&nbsp;Edit&nbsp;&nbsp;View&nbsp;&nbsp;Help</p>
                </div>
                <div style={styles.iconGrid}>
                    {PANEL_ICONS.map((panel) => (
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
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: Colors.white,
    },
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
    iconEmoji: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    iconLabel: { fontSize: 11, fontFamily: 'MSSerif', textAlign: 'center' },
};

export default ControlPanel;
