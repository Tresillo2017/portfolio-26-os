import React from 'react';
import ResumeDownload from './ResumeDownload';

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = (props) => {
    return (
        <div className="site-page-content">
            <ResumeDownload />
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>SpainRP</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://spainrp.me/'}
                        >
                            <h4>spainrp.me</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>FullStack Engineer</h3>
                        <b>
                            <p>Summer 2021 - Fall 2025</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    A minecraft server focused on roleplay and community. 
                    I developed the Webpage using PHP and MySQL. 
                    Used C# to create a custom launcher using WinUI 3. 
                    And Github Actions to automate the deployment of the launcher.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Developed and maintained the server website using PHP and MySQL, 
                            providing players with server information, news updates, and 
                            community features.
                        </p>
                    </li>
                    <li>
                        <p>
                            Created a custom game launcher application using C# and WinUI 3, 
                            streamlining the player onboarding process and improving user 
                            accessibility to the server.
                        </p>
                    </li>
                    <li>
                        <p>
                            Implemented automated deployment pipelines using GitHub Actions, 
                            ensuring reliable and efficient distribution of launcher updates 
                            to the player base.
                        </p>
                    </li>
                    <li>
                        <p>
                            Built server-side modifications and plugins to enhance the 
                            roleplay experience, focusing on community engagement and 
                            immersive gameplay mechanics.
                        </p>
                    </li>
                    <li>
                        <p>
                            Managed database operations and server infrastructure to 
                            support a growing community of active players and maintain 
                            optimal server performance.
                        </p>
                    </li>
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>SafeCircle</h1>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={'https://safecircle.tech/'}
                        >
                            <h4>safecircle.tech</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Founder & Full Stack Engineer</h3>
                        <b>
                            <p>2025 - Present</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Founded SafeCircle, an AI to detect child predators in online conversations.
                    Developed a demo using NextJS, and Vercel AI SDK.
                    Then finetuned a LLM using Unsloth to detect child predators in online conversations.
                    Learned SysAdmin to support multiple users and handle server management.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Founded and developed SafeCircle, an AI-powered platform 
                            designed to detect and prevent child predatory behavior 
                            in online conversations.
                        </p>
                    </li>
                    <li>
                        <p>
                            Built a functional demo application using NextJS and 
                            Vercel AI SDK, showcasing real-time conversation analysis 
                            and threat detection capabilities.
                        </p>
                    </li>
                    <li>
                        <p>
                            Fine-tuned a Large Language Model using Unsloth framework 
                            to accurately identify predatory patterns and behaviors 
                            in text-based communications.
                        </p>
                    </li>
                    <li>
                        <p>
                            Acquired system administration skills to manage multi-user 
                            environments and maintain server infrastructure supporting 
                            the AI detection platform.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    header: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    skillRow: {
        flex: 1,
        justifyContent: 'space-between',
    },
    skillName: {
        minWidth: 56,
    },
    skill: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        background: 'red',
        marginLeft: 8,
        height: 8,
    },
    hoverLogo: {
        height: 32,
        marginBottom: 16,
    },
    headerContainer: {
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'center',
    },
    hoverText: {
        marginBottom: 8,
    },
    indent: {
        marginLeft: 24,
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default Experience;
