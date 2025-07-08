import React from 'react';

export interface VersionInfoProps {}

const VersionInfo: React.FC<VersionInfoProps> = () => {
    // Hardcoded version information - update manually for each release
    const versionInfo = {
        version: '0.1.1',
        build: '1013',
        releaseDate: '2025-07-08'
    };

    return (
        <div style={styles.container}>
            <div style={styles.infoLine}>
                Portfolio OS {versionInfo.version}
            </div>
            <div style={styles.infoLine}>
                Build {versionInfo.build}
            </div>
            <div style={styles.infoLine}>
                {versionInfo.releaseDate}
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    container: {
        position: 'absolute',
        bottom: 50, // Position above toolbar (toolbar is typically ~40px high)
        right: 8,
        fontFamily: 'MS Sans Serif, sans-serif',
        fontSize: '11px',
        color: '#000000',
        textAlign: 'right',
        lineHeight: 1.3,
        userSelect: 'none',
        cursor: 'default',
        zIndex: 9999, // High z-index to appear above toolbar and windows
        textShadow: '1px 1px 0px rgba(255, 255, 255, 0.8)', // Subtle embossed effect
        fontWeight: 'normal',
        display: 'block', // Ensure block display
        width: 'auto',
    },
    infoLine: {
        marginBottom: '4px',
        whiteSpace: 'nowrap',
        display: 'block', // Force each line to be a block element
        clear: 'both',
    },
    versionText: {
        fontWeight: 'bold',
        marginBottom: '1px',
    },
    buildText: {
        fontSize: '10px',
        color: '#404040',
    },
};

export default VersionInfo;
