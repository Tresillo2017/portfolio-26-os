const fs = require('fs');

// Read the changelog file
const content = fs.readFileSync('./public/CHANGELOG.md', 'utf8');

console.log('Testing regex patterns...');

const lines = content.split('\n');
console.log(`Total lines: ${lines.length}`);

// Test the version regex
const versionRegex = /^##\s*\[([^\]]+)\]\s*-\s*(.+)$/;

lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Check for version headers
    if (trimmedLine.startsWith('##')) {
        console.log(`Line ${index + 1}: "${trimmedLine}"`);
        const match = trimmedLine.match(versionRegex);
        if (match) {
            console.log(`  ✓ Matched: version=${match[1]}, date=${match[2]}`);
        } else {
            console.log(`  ✗ No match`);
        }
    }
    
    // Check for title headers
    if (trimmedLine.startsWith('###')) {
        console.log(`Line ${index + 1} (title): "${trimmedLine}"`);
    }
    
    // Check for change type headers
    if (trimmedLine.startsWith('####')) {
        console.log(`Line ${index + 1} (change type): "${trimmedLine}"`);
    }
});

// Test the parser
function parseChangelog(changelogContent) {
    const entries = [];
    const lines = changelogContent.split('\n');
    
    let currentEntry = null;
    let currentChangeType = null;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Match version headers: ## [0.1.3] - 2025-07-29
        const versionMatch = trimmedLine.match(/^##\s*\[([^\]]+)\]\s*-\s*(.+)$/);
        if (versionMatch) {
            console.log(`Found version: ${versionMatch[1]} - ${versionMatch[2]}`);
            
            // Save previous entry if exists
            if (currentEntry && currentEntry.version && currentEntry.date && currentEntry.title) {
                entries.push(currentEntry);
                console.log(`Saved entry for version ${currentEntry.version} with ${currentEntry.changes.length} changes`);
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
        
        // Match title headers: ### Changelog Application & GitHub Integration
        const titleMatch = trimmedLine.match(/^###\s*(.+)$/);
        if (titleMatch && currentEntry) {
            currentEntry.title = titleMatch[1];
            console.log(`Set title: ${titleMatch[1]}`);
            continue;
        }
        
        // Match change type headers: #### Added
        const changeTypeMatch = trimmedLine.match(/^####\s*(Added|Fixed|Changed|Removed)$/i);
        if (changeTypeMatch) {
            currentChangeType = changeTypeMatch[1].toLowerCase();
            console.log(`Set change type: ${currentChangeType}`);
            continue;
        }
        
        // Match list items: - Description of change
        const listItemMatch = trimmedLine.match(/^-\s*(.+)$/);
        if (listItemMatch && currentEntry && currentChangeType) {
            const validTypes = ['added', 'fixed', 'changed', 'removed'];
            if (validTypes.includes(currentChangeType)) {
                currentEntry.changes = currentEntry.changes || [];
                currentEntry.changes.push({
                    type: currentChangeType,
                    description: listItemMatch[1]
                });
                console.log(`Added change: ${currentChangeType} - ${listItemMatch[1]}`);
            }
        }
    }
    
    // Don't forget the last entry
    if (currentEntry && currentEntry.version && currentEntry.date && currentEntry.title) {
        entries.push(currentEntry);
        console.log(`Saved final entry for version ${currentEntry.version} with ${currentEntry.changes.length} changes`);
    }
    
    return entries;
}

console.log('\n=== Running parser ===');
const result = parseChangelog(content);
console.log(`\nParsed ${result.length} entries:`);
result.forEach(entry => {
    console.log(`- Version ${entry.version}: "${entry.title}" (${entry.changes.length} changes)`);
});
