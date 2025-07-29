import React, { useState, useEffect } from 'react';
import Window from '../os/Window';
import colors from '../../constants/colors';
import { ChangelogEntry, fetchChangelog } from '../../utils/changelogParser';

export interface ChangelogProps extends WindowAppProps {}
const Changelog: React.FC<ChangelogProps> = (props) => {
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [changelogData, setChangelogData] = useState<ChangelogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load changelog data on component mount
    useEffect(() => {
        const loadChangelog = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchChangelog();
                setChangelogData(data);
            } catch (err) {
                setError('Failed to load changelog data');
                console.error('Error loading changelog:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadChangelog();
    }, []);    // Responsive layout calculations
    const isSmall = width < 700;

    const getChangeTypeColor = (type: string) => {
        switch (type) {
            case 'added':
                return colors.darkBlue;
            case 'fixed':
                return colors.turquoise;
            case 'changed':
                return colors.darkGray;
            case 'removed':
                return colors.red;
            default:
                return colors.black;
        }
    };

    const getChangeTypeIcon = (type: string) => {
        switch (type) {
            case 'added':
                return '+';
            case 'fixed':
                return '⚒';
            case 'changed':
                return '~';
            case 'removed':
                return '-';
            default:
                return '•';
        }
    };

    const renderVersionList = () => (
        <div style={styles.section}>
            <div style={styles.sectionTitleBar}>
                <span style={styles.sectionTitleText}>Version History</span>
            </div>
            <div style={styles.versionList}>
                {isLoading ? (
                    <div style={styles.loadingState}>
                        <div>📄 Loading changelog...</div>
                    </div>
                ) : error ? (
                    <div style={styles.errorState}>
                        <div>❌ {error}</div>
                    </div>
                ) : (
                    changelogData.map((entry) => (
                    <div
                        key={entry.version}
                        style={{
                            ...styles.versionItem,
                            backgroundColor: selectedVersion === entry.version ? colors.darkBlue : colors.lightGray,
                            color: selectedVersion === entry.version ? colors.white : colors.black,
                            padding: isSmall ? 8 : 12,
                            border: selectedVersion === entry.version 
                                ? `2px inset ${colors.darkBlue}` 
                                : `2px outset ${colors.lightGray}`,
                            boxShadow: selectedVersion === entry.version
                                ? `inset 1px 1px 2px rgba(0,0,0,0.5)`
                                : `inset 1px 1px 0px ${colors.white}, inset -1px -1px 0px ${colors.darkGray}`,
                        }}
                        onClick={() => setSelectedVersion(entry.version)}
                        onMouseEnter={(e) => {
                            if (selectedVersion !== entry.version) {
                                e.currentTarget.style.backgroundColor = colors.white;
                                e.currentTarget.style.border = `2px outset ${colors.white}`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedVersion !== entry.version) {
                                e.currentTarget.style.backgroundColor = colors.lightGray;
                                e.currentTarget.style.border = `2px outset ${colors.lightGray}`;
                            }
                        }}
                    >
                        <div style={styles.versionHeader}>
                            <div style={{
                                ...styles.versionNumber,
                                fontSize: isSmall ? 14 : 16,
                                flex: 1,
                            }}>
                                v{entry.version}
                            </div>
                            <div style={{
                                ...styles.versionDate,
                                fontSize: isSmall ? 11 : 12,
                                color: selectedVersion === entry.version ? colors.white : colors.darkGray,
                            }}>
                                {new Date(entry.date).toLocaleDateString()}
                            </div>
                        </div>
                        <div style={{
                            ...styles.versionTitle,
                            fontSize: isSmall ? 12 : 13,
                            color: selectedVersion === entry.version ? colors.white : colors.darkGray,
                        }}>
                            {entry.title}
                        </div>
                        <div style={{
                            ...styles.changeCount,
                            fontSize: isSmall ? 10 : 11,
                            color: selectedVersion === entry.version ? colors.white : colors.darkGray,
                        }}>
                            {entry.changes.length} change{entry.changes.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                ))
                )}
            </div>
        </div>
    );

    const renderChangeDetails = () => {
        const selectedEntry = changelogData.find((entry: ChangelogEntry) => entry.version === selectedVersion);
        
        if (!selectedEntry) {
            return (
                <div style={styles.section}>
                    <div style={styles.sectionTitleBar}>
                        <span style={styles.sectionTitleText}>Release Details</span>
                    </div>
                    <div style={styles.noSelection}>
                        <div style={styles.noSelectionIcon}>📋</div>
                        <div style={styles.noSelectionText}>
                            Select a version from the list to view detailed changes
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div style={styles.section}>
                <div style={styles.sectionTitleBar}>
                    <span style={styles.sectionTitleText}>
                        Release v{selectedEntry.version} - {selectedEntry.title}
                    </span>
                </div>
                <div style={styles.changeDetails}>
                    <div style={styles.releaseHeader}>
                        <div style={{
                            ...styles.releaseVersion,
                            fontSize: isSmall ? 18 : 22,
                        }}>
                            Version {selectedEntry.version}
                        </div>
                        <div style={{
                            ...styles.releaseDate,
                            fontSize: isSmall ? 12 : 14,
                        }}>
                            Released on {new Date(selectedEntry.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div style={{
                            ...styles.releaseTitle,
                            fontSize: isSmall ? 14 : 16,
                        }}>
                            {selectedEntry.title}
                        </div>
                    </div>
                    
                    <div style={styles.changesList}>
                        {selectedEntry.changes.map((change: any, index: number) => (
                            <div key={index} style={styles.changeItem}>
                                <div 
                                    style={{
                                        ...styles.changeType,
                                        backgroundColor: getChangeTypeColor(change.type),
                                        fontSize: isSmall ? 11 : 12,
                                    }}
                                >
                                    {getChangeTypeIcon(change.type)} {change.type.toUpperCase()}
                                </div>
                                <div style={{
                                    ...styles.changeDescription,
                                    fontSize: isSmall ? 12 : 14,
                                }}>
                                    {change.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Window
            top={50}
            left={50}
            width={width}
            height={height}
            windowTitle="Portfolio Changelog"
            windowBarColor="#2e8b57"
            windowBarIcon="windowExplorerIcon"
            bottomLeftText={`${changelogData.length} releases • Based on Git commit history • Last updated: ${new Date().toLocaleDateString()}`}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
        >
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={{
                        ...styles.headerTitle,
                        fontSize: isSmall ? 16 : 20,
                    }}>
                        � Portfolio Development History
                    </div>
                </div>
                
                <div style={{
                    ...styles.content,
                    flexDirection: isSmall ? 'column' : 'row',
                    gap: isSmall ? 8 : 12,
                }}>
                    <div style={{
                        ...styles.leftPanel,
                        width: isSmall ? '100%' : '35%',
                        minWidth: isSmall ? 'auto' : 280,
                    }}>
                        {renderVersionList()}
                    </div>
                    
                    <div style={{
                        ...styles.rightPanel,
                        width: isSmall ? '100%' : '65%',
                    }}>
                        {renderChangeDetails()}
                    </div>
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.lightGray,
        overflow: 'auto',
        fontFamily: 'MSSerif, sans-serif',
        padding: 8,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        border: `2px outset ${colors.lightGray}`,
        backgroundColor: colors.lightGray,
        padding: 12,
        marginBottom: 8,
        boxShadow: `2px 2px 4px rgba(0,0,0,0.2)`,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
        margin: 0,
        marginBottom: 8,
        fontFamily: 'MSSerif, sans-serif',
        lineHeight: 1.2,
        textShadow: '1px 1px 0px rgba(255,255,255,0.8)',
    },
    headerSubtitle: {
        fontSize: 12,
        color: colors.darkGray,
        margin: 0,
        fontFamily: 'MSSerif, sans-serif',
        fontStyle: 'italic',
        lineHeight: 1.2,
        paddingTop: 2,
    },
    content: {
        display: 'flex',
        gap: 12,
        flex: 1,
        overflow: 'hidden',
        minHeight: 0,
    },
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 280,
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
    },
    section: {
        border: `2px outset ${colors.lightGray}`,
        backgroundColor: colors.lightGray,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: `2px 2px 4px rgba(0,0,0,0.2)`,
        flex: 1,
    },
    sectionTitleBar: {
        background: `linear-gradient(90deg, ${colors.darkBlue} 0%, ${colors.blue} 50%, ${colors.darkBlue} 100%)`,
        color: colors.white,
        padding: '6px 12px',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'MSSerif, sans-serif',
        borderBottom: `1px solid ${colors.darkGray}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.3)`,
    },
    sectionTitleText: {
        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
    },
    versionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        padding: 4,
        flex: 1,
        overflow: 'auto',
        backgroundColor: colors.white,
        border: `2px inset ${colors.lightGray}`,
        margin: 4,
        boxShadow: `inset 1px 1px 0px ${colors.darkGray}`,
    },
    versionItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: 12,
        backgroundColor: colors.lightGray,
        border: `2px outset ${colors.lightGray}`,
        cursor: 'pointer',
        borderRadius: 0,
        transition: 'background-color 0.1s ease, border 0.1s ease',
        fontFamily: 'MSSerif, sans-serif',
        marginBottom: 2,
        boxShadow: `inset 1px 1px 0px ${colors.white}, inset -1px -1px 0px ${colors.darkGray}`,
    },
    versionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
        minHeight: 20,
    },
    versionNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
        fontFamily: 'MSSerif, sans-serif',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
    },
    versionDate: {
        fontSize: 12,
        color: colors.darkGray,
        fontFamily: 'MSSerif, sans-serif',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        textAlign: 'right',
        marginLeft: 8,
    },
    versionTitle: {
        fontSize: 13,
        color: colors.darkGray,
        fontFamily: 'MSSerif, sans-serif',
        marginTop: 2,
        lineHeight: 1.3,
        wordWrap: 'break-word',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
    changeCount: {
        fontSize: 11,
        color: colors.darkGray,
        fontFamily: 'MSSerif, sans-serif',
        marginTop: 4,
        fontStyle: 'italic',
        lineHeight: 1.2,
    },
    noSelection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 40,
        backgroundColor: colors.lightGray,
        margin: 4,
        border: `2px inset ${colors.lightGray}`,
        boxShadow: `inset 1px 1px 2px ${colors.darkGray}`,
    },
    noSelectionIcon: {
        fontSize: 48,
        marginBottom: 16,
        filter: 'grayscale(0.3)',
    },
    noSelectionText: {
        fontSize: 14,
        color: colors.darkGray,
        textAlign: 'center',
        fontFamily: 'MSSerif, sans-serif',
        lineHeight: 1.4,
        textShadow: '1px 1px 0px rgba(255,255,255,0.8)',
    },
    changeDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        padding: 4,
        flex: 1,
        overflow: 'auto',
        backgroundColor: colors.lightGray,
        border: `2px inset ${colors.lightGray}`,
        margin: 4,
        boxShadow: `inset 1px 1px 2px ${colors.darkGray}`,
        minHeight: 0,
        position: 'relative',
    },
    releaseHeader: {
        padding: 16,
        borderBottom: `2px inset ${colors.lightGray}`,
        backgroundColor: colors.lightGray,
        boxShadow: `inset 1px 1px 0px ${colors.white}`,
        marginBottom: 8,
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        minHeight: 'auto',
        width: '100%',
        boxSizing: 'border-box',
    },
    releaseVersion: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.darkBlue,
        margin: 0,
        marginBottom: 8,
        fontFamily: 'MSSerif, sans-serif',
        lineHeight: 1.2,
        textShadow: '1px 1px 0px rgba(255,255,255,0.8)',
        textAlign: 'left',
        alignSelf: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'block',
    },
    releaseDate: {
        fontSize: 14,
        color: colors.darkGray,
        margin: 0,
        marginBottom: 8,
        fontFamily: 'MSSerif, sans-serif',
        lineHeight: 1.2,
        textAlign: 'left',
        alignSelf: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'block',
    },
    releaseTitle: {
        fontSize: 16,
        color: colors.black,
        margin: 0,
        fontFamily: 'MSSerif, sans-serif',
        fontWeight: 'bold',
        lineHeight: 1.3,
        wordWrap: 'break-word',
        textAlign: 'left',
        alignSelf: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'block',
        overflowWrap: 'break-word',
    },
    changesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        backgroundColor: colors.lightGray,
    },
    changeItem: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        marginBottom: 4,
        padding: 8,
        backgroundColor: colors.lightGray,
        border: `1px outset ${colors.lightGray}`,
        boxShadow: `1px 1px 0px ${colors.darkGray}`,
    },
    changeType: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.white,
        padding: '4px 8px',
        borderRadius: 0,
        border: `2px outset ${colors.lightGray}`,
        fontFamily: 'MSSerif, sans-serif',
        textAlign: 'center',
        minWidth: 70,
        flexShrink: 0,
        boxShadow: `1px 1px 2px rgba(0,0,0,0.3)`,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
    },
    changeDescription: {
        fontSize: 14,
        color: colors.black,
        fontFamily: 'MSSerif, sans-serif',
        lineHeight: 1.4,
        flex: 1,
        marginTop: 2,
        wordWrap: 'break-word',
        minWidth: 0,
    },
    loadingState: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        fontSize: 14,
        color: colors.darkGray,
        fontFamily: 'MSSerif, sans-serif',
        textAlign: 'center',
    },
    errorState: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        fontSize: 14,
        color: colors.red,
        fontFamily: 'MSSerif, sans-serif',
        textAlign: 'center',
    },
};

export default Changelog;
