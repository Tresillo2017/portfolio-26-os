import React from 'react';
import ResumeDownload from '../ResumeDownload';


export interface SoftwareProjectsProps {}

const SoftwareProjects: React.FC<SoftwareProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Software</h1>
            <h3>Projects</h3>
            <br />
            <p>
                Below are some of my favorite software projects I have worked on
                over the last few years.
            </p>
            <br />
            <ResumeDownload />
            <br />
            <div className="text-block">
                <h2>SafeCircle</h2>
                <br />
                <p>
                    SafeCircle is an AI-powered platform I founded in 2025 to detect and prevent child predatory behavior in online conversations. This project combines cutting-edge AI technology with real-world safety applications, representing a significant technical and social impact challenge. The platform uses fine-tuned Large Language Models to analyze text-based communications and identify predatory patterns in real-time.
                </p>
                <br />
                <p>
                    The technical implementation involved building a functional demo application using NextJS and Vercel AI SDK, showcasing real-time conversation analysis capabilities. I fine-tuned a Large Language Model using the Unsloth framework to accurately identify predatory behaviors, and acquired system administration skills to manage multi-user environments and server infrastructure supporting the AI detection platform.
                </p>
                <br />
                <h3>Links:</h3>
                <ul>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://safecircle.tech/"
                        >
                            <p>
                                <b>[Website]</b> - safecircle.tech
                            </p>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="text-block">
                <h2>SpainRP</h2>
                <br />
                <p>
                    SpainRP is a Minecraft server focused on roleplay and community that I've been developing and maintaining as a FullStack Engineer from Summer 2021 to Fall 2025. This project has been a comprehensive full-stack development experience, involving web development, desktop application creation, and server infrastructure management.
                </p>
                <br />
                <p>
                    I developed and maintained the server website using PHP and MySQL, providing players with server information, news updates, and community features. Additionally, I created a custom game launcher application using C# and WinUI 3 to streamline the player onboarding process. The project also involved implementing automated deployment pipelines using GitHub Actions for reliable launcher distribution, building server-side modifications for enhanced roleplay experiences, and managing database operations to support a growing community.
                </p>
                <br />
                <h3>Links:</h3>
                <ul>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://spainrp.me/"
                        >
                            <p>
                                <b>[Website]</b> - spainrp.me
                            </p>
                        </a>
                    </li>
                </ul>
            </div>
            <ResumeDownload />
        </div>
    );
};

export default SoftwareProjects;
