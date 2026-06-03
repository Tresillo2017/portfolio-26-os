import React, { useState } from 'react';
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
    icon: React.ReactNode;
    renderPanel: (
        onClose: () => void,
        onInteract: () => void,
        onMinimize: () => void,
    ) => JSX.Element;
}

const MonitorIcon: React.FC = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{ imageRendering: 'pixelated', display: 'block' }}
    >
        {/* Monitor body */}
        <rect x="0" y="0" width="32" height="23" fill="#c3c6ca" />
        <rect x="0" y="0" width="32" height="1" fill="white" />
        <rect x="0" y="0" width="1" height="23" fill="white" />
        <rect x="0" y="22" width="32" height="1" fill="#86898d" />
        <rect x="31" y="0" width="1" height="23" fill="#86898d" />
        {/* Screen sunken border */}
        <rect x="2" y="2" width="28" height="18" fill="#86898d" />
        <rect x="2" y="2" width="28" height="1" fill="black" />
        <rect x="2" y="2" width="1" height="18" fill="black" />
        <rect x="29" y="2" width="1" height="18" fill="white" />
        <rect x="2" y="19" width="28" height="1" fill="white" />
        {/* Screen – teal desktop */}
        <rect x="3" y="3" width="26" height="16" fill="#008080" />
        {/* Tiny window on desktop */}
        <rect x="5" y="5" width="12" height="8" fill="#c3c6ca" />
        <rect x="5" y="5" width="12" height="2" fill="#0000a3" />
        <rect x="15" y="5" width="2" height="2" fill="#c3c6ca" />
        {/* Color bar */}
        <rect x="3" y="16" width="4" height="3" fill="#800000" />
        <rect x="7" y="16" width="4" height="3" fill="#008000" />
        <rect x="11" y="16" width="4" height="3" fill="#000080" />
        <rect x="15" y="16" width="4" height="3" fill="#808000" />
        <rect x="19" y="16" width="4" height="3" fill="#800080" />
        <rect x="23" y="16" width="6" height="3" fill="#c0c0c0" />
        {/* Stand neck */}
        <rect x="13" y="23" width="6" height="4" fill="#86898d" />
        <rect x="13" y="23" width="1" height="4" fill="white" />
        {/* Base */}
        <rect x="9" y="27" width="14" height="4" fill="#86898d" />
        <rect x="9" y="27" width="14" height="1" fill="white" />
        <rect x="9" y="27" width="1" height="4" fill="white" />
    </svg>
);

const ColorSwatchIcon: React.FC = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{ imageRendering: 'pixelated', display: 'block' }}
    >
        {/* Raised frame */}
        <rect x="0" y="0" width="32" height="32" fill="#c3c6ca" />
        <rect x="0" y="0" width="32" height="1" fill="white" />
        <rect x="0" y="0" width="1" height="32" fill="white" />
        <rect x="0" y="31" width="32" height="1" fill="#86898d" />
        <rect x="31" y="0" width="1" height="32" fill="#86898d" />
        {/* 4×4 system palette */}
        <rect x="2" y="2" width="6" height="6" fill="black" />
        <rect x="9" y="2" width="6" height="6" fill="#808080" />
        <rect x="16" y="2" width="6" height="6" fill="#800000" />
        <rect x="23" y="2" width="7" height="6" fill="#808000" />
        <rect x="2" y="9" width="6" height="6" fill="#008000" />
        <rect x="9" y="9" width="6" height="6" fill="#008080" />
        <rect x="16" y="9" width="6" height="6" fill="#000080" />
        <rect x="23" y="9" width="7" height="6" fill="#800080" />
        <rect x="2" y="16" width="6" height="6" fill="#c0c0c0" />
        <rect x="9" y="16" width="6" height="6" fill="white" />
        <rect x="16" y="16" width="6" height="6" fill="#ff0000" />
        <rect x="23" y="16" width="7" height="6" fill="#ffff00" />
        <rect x="2" y="23" width="6" height="7" fill="#00ff00" />
        <rect x="9" y="23" width="6" height="7" fill="#00ffff" />
        <rect x="16" y="23" width="6" height="7" fill="#0000ff" />
        <rect x="23" y="23" width="7" height="7" fill="#ff00ff" />
        {/* Selection highlight on bottom-right swatch */}
        <rect x="23" y="23" width="7" height="1" fill="white" />
        <rect x="23" y="23" width="1" height="7" fill="white" />
        <rect x="29" y="23" width="1" height="7" fill="#86898d" />
        <rect x="23" y="29" width="7" height="1" fill="#86898d" />
    </svg>
);

const PANEL_ICONS: PanelIcon[] = [
    {
        key: 'settings-display',
        label: 'Display',
        icon: <MonitorIcon />,
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
        icon: <ColorSwatchIcon />,
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
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const openPanel = (panel: PanelIcon) => {
        props.addWindow(
            panel.key,
            panel.renderPanel(
                () => {},
                () => {},
                () => {},
            ),
        );
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
            bottomLeftText={`${PANEL_ICONS.length} object(s)`}
        >
            <div
                style={styles.container}
                onMouseDown={(e) => {
                    if (e.target === e.currentTarget) setSelectedKey(null);
                }}
            >
                <div style={styles.menuBar}>
                    {['File', 'Edit', 'View', 'Help'].map((item) => (
                        <p key={item} style={styles.menuItem}>
                            {item}
                        </p>
                    ))}
                </div>
                <div
                    style={styles.iconGrid}
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setSelectedKey(null);
                    }}
                >
                    {PANEL_ICONS.map((panel) => {
                        const isSelected = selectedKey === panel.key;
                        return (
                            <div
                                key={panel.key}
                                style={styles.iconItem}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setSelectedKey(panel.key);
                                }}
                                onDoubleClick={() => openPanel(panel)}
                                title={`Open ${panel.label}`}
                            >
                                <div style={styles.iconImageWrap}>
                                    {panel.icon}
                                </div>
                                <p
                                    style={Object.assign(
                                        {},
                                        styles.iconLabel,
                                        isSelected && styles.iconLabelSelected,
                                    )}
                                >
                                    {panel.label}
                                </p>
                            </div>
                        );
                    })}
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
    menuBar: {
        backgroundColor: Colors.lightGray,
        borderBottom: `1px solid ${Colors.darkGray}`,
        padding: '1px 0',
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItem: {
        fontSize: 12,
        fontFamily: 'MSSerif',
        padding: '2px 8px',
        cursor: 'default',
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: '16px 12px',
        gap: 8,
        flex: 1,
        alignContent: 'flex-start',
        backgroundColor: Colors.white,
    },
    iconItem: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 72,
        cursor: 'default',
        padding: '4px 2px 2px',
    },
    iconImageWrap: {
        width: 32,
        height: 32,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLabel: {
        fontSize: 11,
        fontFamily: 'MSSerif',
        textAlign: 'center',
        padding: '1px 4px',
        lineHeight: 1.3,
        color: Colors.black,
    },
    iconLabelSelected: {
        backgroundColor: Colors.blue,
        color: Colors.white,
    },
};

export default ControlPanel;
