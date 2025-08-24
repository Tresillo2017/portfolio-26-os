import React from 'react';

export interface PhotographyProjectsProps {}

const PhotographyProjects: React.FC<PhotographyProjectsProps> = () => {
    return (
        <div className="site-page-content">
            <h1>Photography</h1>
            <h3>Ventures</h3>
            <br />
            
            <div className="text-block" style={styles.notificationBlock}>
                <h4>📱 Content Moved to Desktop App</h4>
                <p>
                    <strong>Notice:</strong> The photography gallery and all related content has been moved to a standalone desktop application 
                    for a better viewing experience. This section is now deprecated.
                </p>
                <p>
                    Please check the desktop app for the most up-to-date photography portfolio with enhanced features 
                    and better image quality.
                </p>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    notificationBlock: {
        backgroundColor: 'var(--surface)',
        border: '2px solid var(--window-frame)',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        padding: '16px',
        marginBottom: '24px',
        borderLeft: '4px solid #ff6b6b',
    },
};

export default PhotographyProjects;
