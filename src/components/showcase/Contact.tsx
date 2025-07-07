import React from 'react';
import twitterIcon from '../../assets/pictures/contact-twitter.png';
import ghIcon from '../../assets/pictures/contact-gh.png';
import inIcon from '../../assets/pictures/contact-in.png';
import ResumeDownload from './ResumeDownload';

export interface ContactProps {}

interface SocialBoxProps {
    icon: string;
    link: string;
}

const SocialBox: React.FC<SocialBoxProps> = ({ link, icon }) => {
    return (
        <a rel="noreferrer" target="_blank" href={link}>
            <div className="big-button-container" style={styles.social}>
                <img src={icon} alt="" style={styles.socialImage} />
            </div>
        </a>
    );
};

const Contact: React.FC<ContactProps> = (props) => {
    return (
        <div className="site-page-content">
            <div style={styles.header}>
                <h1>Contact</h1>
                <div style={styles.socials}>
                    <SocialBox
                        icon={ghIcon}
                        link={'https://github.com/tresillo2017'}
                    />
                    <SocialBox
                        icon={inIcon}
                        link={'https://www.linkedin.com/in/tomasps/'}
                    />
                    <SocialBox
                        icon={twitterIcon}
                        link={'https://twitter.com/toomas_ps'}
                    />
                </div>
            </div>
            <div className="text-block">
                <p>
                    I am currently studying, however if you have any
                    opportunities, feel free to reach out - I would love to
                    chat! You can reach me via my personal email below:
                </p>
                <br />
                <div style={styles.emailSection}>
                    <p>
                        <b>Email: </b>
                        <a href="mailto:contact@tomasps.com" style={styles.emailLink}>
                            contact@tomasps.com
                        </a>
                    </p>
                </div>
                <br />
                <p style={styles.note}>
                    <i>Contact form is temporarily unavailable. Please use the email above to get in touch!</i>
                </p>
            </div>
            <ResumeDownload altText="Need a copy of my Resume?" />
        </div>
    );
};

const styles: StyleSheetCSS = {
    emailSection: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 16,
    },
    emailLink: {
        color: '#0066cc',
        textDecoration: 'none',
        fontSize: 18,
    },
    note: {
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
    },
    socialImage: {
        width: 36,
        height: 36,
    },
    header: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    socials: {
        marginBottom: 16,
        justifyContent: 'flex-end',
    },
    social: {
        width: 4,
        height: 4,
        // borderRadius: 1000,

        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
};

export default Contact;
