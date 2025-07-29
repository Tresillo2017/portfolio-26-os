const fs = require('fs');

// Read the changelog file
const content = fs.readFileSync('./public/CHANGELOG.md', 'utf8');

console.log('Changelog file content preview:');
console.log(content.substring(0, 500));
console.log('\n--- End of preview ---\n');

// Simple parsing test
const lines = content.split('\n');
const versionLines = lines.filter(line => line.match(/^##\s*\[([^\]]+)\]\s*-\s*(.+)$/));

console.log('Found versions:');
versionLines.forEach(line => {
    const match = line.match(/^##\s*\[([^\]]+)\]\s*-\s*(.+)$/);
    if (match) {
        console.log(`- Version ${match[1]} (${match[2]})`);
    }
});
