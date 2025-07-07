import React, { useState, useEffect, useCallback } from 'react';
import Window from '../os/Window';
import colors from '../../constants/colors';

export interface MusicAppProps extends WindowAppProps {}

interface LastFmTrack {
    name: string;
    artist: {
        '#text': string;
    };
    image: Array<{
        '#text': string;
        size: string;
    }>;
    playcount?: string;
    url?: string;
}

interface LastFmRecentTrack {
    name: string;
    artist: {
        '#text': string;
    };
    image: Array<{
        '#text': string;
        size: string;
    }>;
    date?: {
        '#text': string;
    };
    '@attr'?: {
        nowplaying: string;
    };
}

const MusicApp: React.FC<MusicAppProps> = (props) => {
    const [width, setWidth] = useState(720);
    const [height, setHeight] = useState(540);
    const [topTracks, setTopTracks] = useState<LastFmTrack[]>([]);
    const [recentTracks, setRecentTracks] = useState<LastFmRecentTrack[]>([]);
    const [nowPlaying, setNowPlaying] = useState<LastFmRecentTrack | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Responsive layout calculations based on window size
    const isSmall = width < 600;
    const isMedium = width < 800;
    const showSideBySide = !isSmall && height > 400;
    const itemsToShow = isSmall ? 4 : isMedium ? 5 : 6;

    // Load API key and username from environment variables
    const API_KEY = process.env.REACT_APP_LASTFM_API_KEY;
    const USERNAME = process.env.REACT_APP_LASTFM_USERNAME;

    const fetchLastFmData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if environment variables are configured
            if (!API_KEY || !USERNAME) {
                throw new Error('Last.fm API key and username must be configured in .env file');
            }

            // Fetch top tracks
            const topTracksResponse = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=10&period=7day`
            );
            
            if (!topTracksResponse.ok) {
                throw new Error('Failed to fetch top tracks');
            }
            
            const topTracksData = await topTracksResponse.json();
            setTopTracks(topTracksData.toptracks?.track || []);

            // Fetch recent tracks
            const recentTracksResponse = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=20`
            );
            
            if (!recentTracksResponse.ok) {
                throw new Error('Failed to fetch recent tracks');
            }
            
            const recentTracksData = await recentTracksResponse.json();
            const tracks = recentTracksData.recenttracks?.track || [];
            setRecentTracks(tracks);

            // Find now playing track
            const nowPlayingTrack = tracks.find((track: LastFmRecentTrack) => 
                track['@attr']?.nowplaying === 'true'
            );
            setNowPlaying(nowPlayingTrack || null);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [API_KEY, USERNAME]);

    useEffect(() => {
        fetchLastFmData();
    }, [fetchLastFmData]);

    const getImageUrl = (images: Array<{ '#text': string; size: string }>) => {
        const largeImage = images.find(img => img.size === 'large');
        const mediumImage = images.find(img => img.size === 'medium');
        return largeImage?.['#text'] || mediumImage?.['#text'] || '';
    };

    const renderNowPlaying = () => {
        const albumArtSize = isSmall ? 56 : 72;

        return (
            <div style={styles.nowPlayingSection}>
                <div style={styles.sectionTitleBar}>
                    <span style={styles.sectionTitleText}>♪ Now Playing</span>
                </div>
                <div style={{
                    ...styles.nowPlayingCard,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isSmall ? 10 : 12,
                    minHeight: isSmall ? 60 : 70,
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        flex: 1,
                        minWidth: 0,
                    }}>
                        <div style={{
                            ...styles.albumArt,
                            width: albumArtSize,
                            height: albumArtSize,
                        }}>
                            {nowPlaying && getImageUrl(nowPlaying.image) ? (
                                <img 
                                    src={getImageUrl(nowPlaying.image)} 
                                    alt="Album Art"
                                    style={styles.albumImage}
                                />
                            ) : (
                                <div style={styles.noAlbumArt}>♪</div>
                            )}
                        </div>
                        <div style={{
                            ...styles.trackInfo,
                            flex: 1,
                            minWidth: 0,
                        }}>
                            {nowPlaying ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                }}>
                                    <h4 style={{
                                        ...styles.trackTitle,
                                        fontSize: isSmall ? 18 : 22,
                                        margin: 0,
                                        fontWeight: 'bold',
                                    }}>{nowPlaying.name}</h4>
                                    <p style={{
                                        ...styles.artistName,
                                        fontSize: isSmall ? 15 : 18,
                                        margin: 0,
                                    }}>{nowPlaying.artist['#text']}</p>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                }}>
                                    <h4 style={{
                                        ...styles.trackTitle,
                                        fontSize: isSmall ? 18 : 22,
                                        margin: 0,
                                        color: colors.darkGray,
                                        fontWeight: 'bold',
                                    }}>Nothing Playing</h4>
                                    <p style={{
                                        ...styles.artistName,
                                        fontSize: isSmall ? 15 : 18,
                                        margin: 0,
                                    }}>No track currently playing</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        backgroundColor: nowPlaying ? colors.lightGray : colors.white,
                        border: nowPlaying ? `1px outset ${colors.lightGray}` : `1px inset ${colors.lightGray}`,
                        padding: '10px 14px',
                        borderRadius: 0,
                        flexShrink: 0,
                        minWidth: 'fit-content',
                        fontFamily: 'MSSerif, sans-serif',
                    }}>
                        <span style={{
                            color: nowPlaying ? colors.red : colors.darkGray,
                            fontSize: 16,
                            animation: nowPlaying ? 'blink 1s infinite' : 'none',
                        }}>●</span>
                        <span style={{
                            color: nowPlaying ? colors.black : colors.darkGray,
                            fontWeight: 'bold',
                            fontSize: isSmall ? 12 : 14,
                        }}>{nowPlaying ? 'LIVE' : 'OFFLINE'}</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderTopTracks = () => (
        <div style={styles.section}>
            <div style={styles.sectionTitleBar}>
                <span style={styles.sectionTitleText}>Top Tracks (7 Days)</span>
            </div>
            <div style={styles.tracksList}>
                {topTracks.slice(0, itemsToShow).map((track, index) => (
                    <div 
                        key={index} 
                        style={{
                            ...styles.trackItem,
                            padding: isSmall ? 8 : 10,
                            minHeight: isSmall ? 50 : 55,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.darkBlue;
                            e.currentTarget.style.color = colors.white;
                            const trackName = e.currentTarget.querySelector('.track-name') as HTMLElement;
                            const artistName = e.currentTarget.querySelector('.artist-name') as HTMLElement;
                            const playCount = e.currentTarget.querySelector('.play-count') as HTMLElement;
                            if (trackName) trackName.style.color = colors.white;
                            if (artistName) artistName.style.color = colors.white;
                            if (playCount) playCount.style.color = colors.white;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.white;
                            e.currentTarget.style.color = colors.black;
                            const trackName = e.currentTarget.querySelector('.track-name') as HTMLElement;
                            const artistName = e.currentTarget.querySelector('.artist-name') as HTMLElement;
                            const playCount = e.currentTarget.querySelector('.play-count') as HTMLElement;
                            if (trackName) trackName.style.color = colors.black;
                            if (artistName) artistName.style.color = colors.darkGray;
                            if (playCount) playCount.style.color = colors.darkBlue;
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            flex: 1,
                            minWidth: 0,
                        }}>
                            <div style={{...styles.trackRank, fontSize: isSmall ? 10 : 12}}>#{index + 1}</div>
                            <div style={{...styles.trackAlbumArt, width: isSmall ? 32 : 40, height: isSmall ? 32 : 40}}>
                                {getImageUrl(track.image) ? (
                                    <img 
                                        src={getImageUrl(track.image)} 
                                        alt="Album Art"
                                        style={styles.smallAlbumImage}
                                    />
                                ) : (
                                    <div style={{
                                        ...styles.smallNoAlbumArt,
                                        fontSize: isSmall ? 12 : 14,
                                    }}>♪</div>
                                )}
                            </div>
                            <div style={{
                                ...styles.trackDetails,
                                flex: 1,
                                minWidth: 0,
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4,
                                }}>
                                    <div 
                                        className="track-name"
                                        style={{
                                            ...styles.trackName,
                                            fontSize: isSmall ? 13 : 15,
                                            margin: 0,
                                            fontWeight: 'bold',
                                        }}
                                    >{track.name}</div>
                                    <div 
                                        className="artist-name"
                                        style={{
                                            ...styles.artistName,
                                            fontSize: isSmall ? 12 : 14,
                                            margin: 0,
                                        }}
                                    >{track.artist['#text']}</div>
                                </div>
                            </div>
                        </div>
                        <div 
                            className="play-count"
                            style={{
                                ...styles.playCount,
                                fontSize: isSmall ? 11 : 12,
                                margin: 0,
                                padding: '6px 10px',
                                backgroundColor: colors.lightGray,
                                border: `1px inset ${colors.lightGray}`,
                                borderRadius: 0,
                                flexShrink: 0,
                                minWidth: 'fit-content',
                                fontWeight: 'bold',
                            }}
                        >
                            {track.playcount}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderRecentTracks = () => (
        <div style={styles.section}>
            <div style={styles.sectionTitleBar}>
                <span style={styles.sectionTitleText}>Recent Tracks</span>
            </div>
            <div style={styles.tracksList}>
                {recentTracks.filter(track => !track['@attr']?.nowplaying).slice(0, itemsToShow).map((track, index) => (
                    <div 
                        key={index} 
                        style={{
                            ...styles.trackItem,
                            padding: isSmall ? 8 : 10,
                            minHeight: isSmall ? 50 : 55,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.darkBlue;
                            e.currentTarget.style.color = colors.white;
                            const trackName = e.currentTarget.querySelector('.track-name') as HTMLElement;
                            const artistName = e.currentTarget.querySelector('.artist-name') as HTMLElement;
                            const trackTime = e.currentTarget.querySelector('.track-time') as HTMLElement;
                            if (trackName) trackName.style.color = colors.white;
                            if (artistName) artistName.style.color = colors.white;
                            if (trackTime) trackTime.style.color = colors.white;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.white;
                            e.currentTarget.style.color = colors.black;
                            const trackName = e.currentTarget.querySelector('.track-name') as HTMLElement;
                            const artistName = e.currentTarget.querySelector('.artist-name') as HTMLElement;
                            const trackTime = e.currentTarget.querySelector('.track-time') as HTMLElement;
                            if (trackName) trackName.style.color = colors.black;
                            if (artistName) artistName.style.color = colors.darkGray;
                            if (trackTime) trackTime.style.color = colors.darkGray;
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            flex: 1,
                            minWidth: 0,
                        }}>
                            <div style={{...styles.trackAlbumArt, width: isSmall ? 32 : 40, height: isSmall ? 32 : 40}}>
                                {getImageUrl(track.image) ? (
                                    <img 
                                        src={getImageUrl(track.image)} 
                                        alt="Album Art"
                                        style={styles.smallAlbumImage}
                                    />
                                ) : (
                                    <div style={{
                                        ...styles.smallNoAlbumArt,
                                        fontSize: isSmall ? 12 : 14,
                                    }}>♪</div>
                                )}
                            </div>
                            <div style={{
                                ...styles.trackDetails,
                                flex: 1,
                                minWidth: 0,
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4,
                                }}>
                                    <div 
                                        className="track-name"
                                        style={{
                                            ...styles.trackName,
                                            fontSize: isSmall ? 13 : 15,
                                            margin: 0,
                                            fontWeight: 'bold',
                                        }}
                                    >{track.name}</div>
                                    <div 
                                        className="artist-name"
                                        style={{
                                            ...styles.artistName,
                                            fontSize: isSmall ? 12 : 14,
                                            margin: 0,
                                        }}
                                    >{track.artist['#text']}</div>
                                </div>
                            </div>
                        </div>
                        {track.date && (
                            <div 
                                className="track-time"
                                style={{
                                    ...styles.trackTime,
                                    fontSize: isSmall ? 11 : 12,
                                    margin: 0,
                                    padding: '6px 10px',
                                    backgroundColor: colors.lightGray,
                                    border: `1px inset ${colors.lightGray}`,
                                    borderRadius: 0,
                                    flexShrink: 0,
                                    minWidth: 'fit-content',
                                    fontWeight: 'bold',
                                }}
                            >
                                {new Date(track.date['#text']).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <Window
            top={50}
            left={50}
            width={width}
            height={height}
            windowTitle="Last.fm Music"
            windowBarColor="#C21807"
            windowBarIcon="cd"
            bottomLeftText={`Connected to Last.fm`}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
        >
            <div style={styles.container}>
                {loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.loadingText}>Loading Last.fm data...</div>
                        <div style={styles.loadingSpinner}>♪ ♫ ♪ ♫</div>
                    </div>
                ) : error ? (
                    <div style={styles.errorContainer}>
                        <h3>Connection Error</h3>
                        <p>{error}</p>
                        <p style={styles.errorHint}>
                            Please add your Last.fm API key and username to the .env file:
                            <br />
                            REACT_APP_LASTFM_API_KEY=your_api_key_here
                            <br />
                            REACT_APP_LASTFM_USERNAME=your_username_here
                        </p>
                        <button 
                            style={styles.retryButton}
                            className="site-button"
                            onClick={fetchLastFmData}
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div style={styles.content}>
                        {renderNowPlaying()}
                        <div style={{
                            ...styles.sectionsContainer,
                            flexDirection: showSideBySide ? 'row' : 'column',
                            gap: isSmall ? 4 : 8,
                        }}>
                            {renderTopTracks()}
                            {renderRecentTracks()}
                        </div>
                    </div>
                )}
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
        padding: 4,
        boxSizing: 'border-box',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 16,
        padding: 20,
        border: `2px inset ${colors.lightGray}`,
        backgroundColor: colors.white,
        margin: 4,
    },
    loadingText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'MSSerif, sans-serif',
        color: colors.black,
    },
    loadingSpinner: {
        fontSize: 18,
        animation: 'pulse 1.5s ease-in-out infinite',
        color: colors.darkBlue,
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 12,
        textAlign: 'center',
        padding: 20,
        fontFamily: 'MSSerif, sans-serif',
        border: `2px inset ${colors.lightGray}`,
        backgroundColor: colors.white,
        margin: 4,
    },
    errorHint: {
        fontSize: 11,
        color: colors.black,
        fontStyle: 'normal',
        fontFamily: 'MSSerif, sans-serif',
        backgroundColor: colors.lightGray,
        padding: 8,
        border: `1px inset ${colors.lightGray}`,
    },
    retryButton: {
        marginTop: 12,
        padding: '6px 16px',
        border: `2px outset ${colors.lightGray}`,
        backgroundColor: colors.lightGray,
        cursor: 'pointer',
        fontSize: 11,
        fontFamily: 'MSSerif, sans-serif',
        color: colors.black,
        boxShadow: `1px 1px 0px ${colors.darkGray}`,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        height: '100%',
        boxSizing: 'border-box',
    },
    nowPlayingSection: {
        border: `2px outset ${colors.lightGray}`,
        backgroundColor: colors.lightGray,
        marginBottom: 6,
    },
    sectionTitleBar: {
        background: `linear-gradient(90deg, ${colors.darkBlue} 0%, ${colors.blue} 100%)`,
        color: colors.white,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: 'MSSerif, sans-serif',
        borderBottom: `1px solid ${colors.darkGray}`,
    },
    sectionTitleText: {
        textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
    },
    nowPlayingCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 12,
        border: `2px inset ${colors.lightGray}`,
        backgroundColor: colors.white,
        margin: 4,
        minHeight: 80,
    },
    albumArt: {
        width: 64,
        height: 64,
        border: `2px inset ${colors.lightGray}`,
        overflow: 'hidden',
        backgroundColor: colors.white,
        boxShadow: `inset 1px 1px 0px ${colors.darkGray}`,
        flexShrink: 0,
    },
    albumImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    noAlbumArt: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
        fontSize: 24,
        color: colors.darkGray,
        fontFamily: 'MSSerif, sans-serif',
    },
    trackInfo: {
        flex: 1,
        fontFamily: 'MSSerif, sans-serif',
        minWidth: 0,
    },
    trackTitle: {
        margin: '0 0 12px 0',
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        fontFamily: 'MSSerif, sans-serif',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: 1.3,
    },
    artistName: {
        margin: '0 0 12px 0',
        fontSize: 15,
        color: colors.darkGray,
        fontFamily: 'MSSerif, sans-serif',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: 1.3,
    },
    playingIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.black,
        fontFamily: 'MSSerif, sans-serif',
        padding: '4px 8px',
        backgroundColor: colors.lightGray,
        border: `1px inset ${colors.lightGray}`,
        width: 'fit-content',
    },
    playingDot: {
        color: colors.red,
        animation: 'blink 1s infinite',
        fontSize: 14,
    },
    sectionsContainer: {
        display: 'flex',
        gap: 6,
        flex: 1,
        overflow: 'hidden',
        minHeight: 200,
    },
    section: {
        flex: 1,
        border: `2px outset ${colors.lightGray}`,
        backgroundColor: colors.lightGray,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 200,
    },
    sectionTitle: {
        margin: 0,
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.black,
        backgroundColor: colors.lightGray,
        padding: '4px 8px',
        borderBottom: `1px solid ${colors.darkGray}`,
        fontFamily: 'MSSerif, sans-serif',
    },
    tracksList: {
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
    trackItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        backgroundColor: colors.white,
        border: 'none',
        fontSize: 12,
        fontFamily: 'MSSerif, sans-serif',
        cursor: 'pointer',
        borderRadius: 0,
        transition: 'background-color 0.1s ease',
        minHeight: 50,
    },
    trackRank: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.darkBlue,
        minWidth: 24,
        textAlign: 'right',
        fontFamily: 'MSSerif, sans-serif',
    },
    trackAlbumArt: {
        width: 40,
        height: 40,
        border: `1px inset ${colors.lightGray}`,
        overflow: 'hidden',
        backgroundColor: colors.white,
        boxShadow: `inset 1px 1px 0px ${colors.darkGray}`,
        flexShrink: 0,
    },
    smallAlbumImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    smallNoAlbumArt: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
        fontSize: 14,
        color: colors.darkGray,
        fontFamily: 'MSSerif, sans-serif',
    },
    trackDetails: {
        flex: 1,
        overflow: 'hidden',
        fontFamily: 'MSSerif, sans-serif',
        minWidth: 0,
    },
    trackName: {
        fontSize: 12,
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: colors.black,
        margin: '0 0 8px 0', // increased bottom margin
        fontFamily: 'MSSerif, sans-serif',
        lineHeight: 1.3,
    },
    trackTime: {
        fontSize: 11,
        color: colors.darkGray,
        marginTop: 8, // increased top margin
        fontFamily: 'MSSerif, sans-serif',
        lineHeight: 1.2,
    },
    playCount: {
        fontSize: 11,
        color: colors.darkBlue,
        fontWeight: 'bold',
        minWidth: 50,
        textAlign: 'right',
        fontFamily: 'MSSerif, sans-serif',
        backgroundColor: colors.lightGray,
        padding: '4px 6px',
        border: `1px inset ${colors.lightGray}`,
    },
};

export default MusicApp;
