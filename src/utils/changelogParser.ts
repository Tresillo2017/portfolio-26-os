export interface ChangelogEntry {
    version: string;
    date: string;
    title: string;
    changes: {
        type: 'added' | 'fixed' | 'changed' | 'removed';
        description: string;
    }[];
}

/**
 * Parses a markdown changelog file and returns structured changelog data
 * @param changelogContent The raw markdown content of the changelog
 * @returns Array of changelog entries
 */
export function parseChangelog(changelogContent: string): ChangelogEntry[] {
    const entries: ChangelogEntry[] = [];
    const lines = changelogContent.split('\n');
    
    let currentEntry: Partial<ChangelogEntry> | null = null;
    let currentChangeType: string | null = null;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Match version headers: ## [0.1.3] - 2025-07-29
        const versionMatch = trimmedLine.match(/^##\s*\[([^\]]+)\]\s*-\s*(.+)$/);
        if (versionMatch) {
            // Save previous entry if exists
            if (currentEntry && currentEntry.version && currentEntry.date && currentEntry.title) {
                entries.push(currentEntry as ChangelogEntry);
            }
            
            // Start new entry
            currentEntry = {
                version: versionMatch[1],
                date: versionMatch[2],
                title: '',
                changes: []
            };
            currentChangeType = null;
            continue;
        }
        
        // Match change type headers: #### Added
        const changeTypeMatch = trimmedLine.match(/^####\s*(Added|Fixed|Changed|Removed)$/i);
        if (changeTypeMatch) {
            currentChangeType = changeTypeMatch[1].toLowerCase();
            continue;
        }
        
        // Match title headers: ### Changelog Application & GitHub Integration
        const titleMatch = trimmedLine.match(/^###\s*(.+)$/);
        if (titleMatch && currentEntry) {
            currentEntry.title = titleMatch[1];
            continue;
        }
        
        // Match list items: - Description of change
        const listItemMatch = trimmedLine.match(/^-\s*(.+)$/);
        if (listItemMatch && currentEntry && currentChangeType) {
            const validTypes = ['added', 'fixed', 'changed', 'removed'];
            if (validTypes.includes(currentChangeType)) {
                currentEntry.changes = currentEntry.changes || [];
                currentEntry.changes.push({
                    type: currentChangeType as 'added' | 'fixed' | 'changed' | 'removed',
                    description: listItemMatch[1]
                });
            }
        }
    }
    
    // Don't forget the last entry
    if (currentEntry && currentEntry.version && currentEntry.date && currentEntry.title) {
        entries.push(currentEntry as ChangelogEntry);
    }
    
    return entries;
}

/**
 * Fetches and parses the changelog from the public folder
 * @returns Promise resolving to changelog entries
 */
export async function fetchChangelog(): Promise<ChangelogEntry[]> {
    try {
        // Try to fetch from public folder first (for built app)
        let response = await fetch('/CHANGELOG.md');
        
        // If not found, try relative path (for development)
        if (!response.ok) {
            response = await fetch('./CHANGELOG.md');
        }
        
        // If still not found, return fallback data
        if (!response.ok) {
            console.warn('Could not fetch CHANGELOG.md, using fallback data');
            return getFallbackChangelog();
        }
        
        const content = await response.text();
        return parseChangelog(content);
    } catch (error) {
        console.error('Error fetching changelog:', error);
        return getFallbackChangelog();
    }
}

/**
 * Fallback changelog data in case the markdown file can't be loaded
 */
function getFallbackChangelog(): ChangelogEntry[] {
    return [
        {
            version: '0.1.3',
            date: '2025-07-29',
            title: 'Changelog Application & GitHub Integration',
            changes: [
                {
                    type: 'added',
                    description: 'New Changelog application to track portfolio updates from Git history'
                },
                {
                    type: 'added',
                    description: 'Real-time version tracking integrated with Git commits'
                },
                {
                    type: 'changed',
                    description: 'Updated version info to reflect current development state'
                }
            ]
        },
        {
            version: '0.1.2',
            date: '2025-07-08',
            title: 'Version Control & Documentation Updates',
            changes: [
                {
                    type: 'added',
                    description: 'VersionInfo component to display OS version details in bottom-right corner'
                },
                {
                    type: 'changed',
                    description: 'Updated version information and removed outdated fraternity details'
                },
                {
                    type: 'fixed',
                    description: 'Docker deployment configuration with LastFM API integration'
                },
                {
                    type: 'added',
                    description: 'Build arguments for LastFM API key and username in deployment'
                }
            ]
        },
        {
            version: '0.1.1',
            date: '2025-07-08',
            title: 'Music Application & Last.fm Integration',
            changes: [
                {
                    type: 'added',
                    description: 'Complete Music application with Last.fm API integration'
                },
                {
                    type: 'added',
                    description: 'Real-time display of now playing, top tracks, and recent tracks'
                },
                {
                    type: 'added',
                    description: 'Responsive layout with album art and hover effects'
                },
                {
                    type: 'added',
                    description: 'Error handling for API requests and loading states'
                },
                {
                    type: 'added',
                    description: 'Vinyl record animation for currently playing tracks'
                },
                {
                    type: 'removed',
                    description: 'Unused MUSIC_SETUP.md documentation file'
                }
            ]
        },
        {
            version: '0.1.0',
            date: '2025-07-07',
            title: 'Initial Portfolio OS Release',
            changes: [
                {
                    type: 'added',
                    description: 'Complete Windows 95-style operating system interface'
                },
                {
                    type: 'added',
                    description: 'Desktop environment with draggable windows and shortcuts'
                },
                {
                    type: 'added',
                    description: 'Taskbar with start menu and window management system'
                },
                {
                    type: 'added',
                    description: 'Multiple applications: Computer, Showcase, Games (Oregon Trail, Doom, Scrabble, Henordle)'
                },
                {
                    type: 'added',
                    description: 'React-based architecture with TypeScript support'
                },
                {
                    type: 'added',
                    description: 'Retro styling with MSSerif fonts and Windows 95 color scheme'
                },
                {
                    type: 'added',
                    description: 'Responsive design for modern devices'
                },
                {
                    type: 'added',
                    description: 'Credits system and shutdown sequence animations'
                }
            ]
        }
    ];
}
