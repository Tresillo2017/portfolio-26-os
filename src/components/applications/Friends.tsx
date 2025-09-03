import React from 'react';
import Window from '../os/Window';
import colors from '../../constants/colors';

export interface FriendsProps extends WindowAppProps {}

// Data model for friends; easy to extend later.
interface FriendLink {
    name: string;
    url: string;
    badgeImage?: string; // optional 88x31 style badge
    description?: string;
}

// NOTE: Your own site/badge is displayed separately; keep only external friends here.
const friends: FriendLink[] = [
    {
        name: 'arf20',
        url: 'https://arf20.com',
        badgeImage: 'https://arf20.com/88x31.gif',
        description: 'Personal site & webring pal',
    },
];

const Friends: React.FC<FriendsProps> = (props) => {
    // Webring snippet & copy logic removed – this component now only lists friends.

    return (
        <Window
            top={70}
            left={90}
            width={640}
            height={520}
            windowBarIcon="netscape"
            windowTitle="Friends"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'Friends'}
        >
            <div style={styles.container}>
                <header style={styles.headerArea}>
                    <h2 style={styles.heading}>Friends</h2>
                    <p style={styles.tagline}>Small-but-mighty corner of the web.</p>
                </header>
                <div style={styles.contentArea}>
                    <section style={styles.panel}>
                        <div style={styles.panelHeader}>My Button</div>
                        <div style={styles.myBadgeWrapper}>
                            <a
                                href="https://tomasps.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.badgeLink}
                                title="My site – add this button to join the mini-webring"
                            >
                                <img
                                    src="/webring.gif"
                                    alt="TomasPS Button"
                                    style={styles.badgeImage as React.CSSProperties}
                                    width={88}
                                    height={31}
                                />
                            </a>
                        </div>
                        <p style={styles.copyNote as React.CSSProperties}>
                            Save or copy this 88×31 button and link it to <strong>https://tomasps.com</strong>. Then
                            email me your site (and optional button) to be added below – tiny handmade webring vibes.
                        </p>
                    </section>
                    <section style={styles.panelFriends}>
                        <div style={styles.panelHeader}>Friends' Buttons</div>
                        <div style={styles.badgeGrid}>
                            {friends.map((f) => (
                                <a
                                    key={f.url}
                                    href={f.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.badgeLink}
                                    title={f.description || f.name}
                                >
                                    {f.badgeImage ? (
                                        <img
                                            src={f.badgeImage}
                                            alt={f.name + ' badge'}
                                            style={styles.badgeImage as React.CSSProperties}
                                            width={88}
                                            height={31}
                                        />
                                    ) : (
                                        <span style={styles.textBadge}>{f.name}</span>
                                    )}
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
                <div style={styles.footerNote}>Want to be listed here? Send your site & optional 88x31 badge: &nbsp;<a href={`mailto:contact@tomasps.com?subject=${encodeURIComponent('Friends List Addition')}`} style={styles.mailLink as React.CSSProperties}>email me</a>.</div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: 8,
        background: colors.lightGray,
        gap: 8,
        fontSize: 12,
        overflow: 'hidden',
    },
    section: {
        border: `2px inset ${colors.lightGray}`,
        background: colors.white,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        padding: '2px 4px',
        background: colors.lightGray,
        border: `2px outset ${colors.lightGray}`,
    },
    myBadgeWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    headerArea: {
        border: `2px outset ${colors.lightGray}`,
        padding: 6,
        background: colors.lightGray,
    },
    heading: {
        margin: 0,
        fontSize: 16,
    },
    tagline: {
        margin: '2px 0 0 0',
        fontSize: 11,
        color: colors.darkGray,
        fontStyle: 'italic',
    },
    badgeGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
        gap: 8,
        border: `2px inset ${colors.lightGray}`,
        padding: 8,
        background: colors.white,
        overflowY: 'auto',
        flex: 1,
    },
    badgeLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    background: 'transparent',
    border: 'none',
        width: '100%',
        height: 40,
        textDecoration: 'none',
        boxSizing: 'border-box',
        padding: 2,
    },
    badgeImage: {
        imageRendering: 'pixelated',
        display: 'block',
    },
    textBadge: {
        fontSize: 12,
        color: colors.black,
        fontWeight: 'bold',
    },
    footerNote: {
        textAlign: 'center',
        fontSize: 11,
        color: colors.darkGray,
        borderTop: `1px dashed ${colors.darkGray}`,
        paddingTop: 4,
    },
    mailLink: {
        color: colors.darkBlue,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    copyNote: {
        fontSize: 11,
        lineHeight: 1.3,
        margin: 0,
        color: colors.darkGray,
    },
    contentArea: {
        display: 'flex',
        gap: 8,
        flex: 1,
        minHeight: 0,
        flexWrap: 'wrap',
        alignContent: 'flex-start',
    },
    panel: {
        ...({} as React.CSSProperties),
        border: `2px inset ${colors.lightGray}`,
        background: colors.white,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: '1 1 260px',
        minWidth: 240,
        boxSizing: 'border-box',
        maxHeight: '100%',
    },
    panelFriends: {
        border: `2px inset ${colors.lightGray}`,
        background: colors.white,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: '2 1 320px',
        minWidth: 260,
        boxSizing: 'border-box',
        minHeight: 0,
        maxHeight: '100%',
    },
    panelHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        padding: '2px 4px',
        background: colors.lightGray,
        border: `2px outset ${colors.lightGray}`,
    },
    // Removed snippet styles no longer needed after separating webring feature.
};

export default Friends;
