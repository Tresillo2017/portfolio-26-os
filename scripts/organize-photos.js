const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const PHOTOGRAPHY_DIR = path.join(__dirname, '..', 'public', 'photography');
const OUTPUT_JSON = path.join(PHOTOGRAPHY_DIR, 'photos.json');

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];

/**
 * Extract date from filename if it follows common patterns
 * @param {string} filename 
 * @returns {Date|null}
 */
function extractDateFromFilename(filename) {
    // Pattern: 20250726_232630.jpg (YYYYMMDD_HHMMSS)
    const dateTimePattern = /(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/;
    const match = filename.match(dateTimePattern);
    
    if (match) {
        const [, year, month, day, hour, minute, second] = match;
        return new Date(
            parseInt(year),
            parseInt(month) - 1, // Month is 0-indexed
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            parseInt(second)
        );
    }
    
    // Pattern: YYYY-MM-DD or YYYY_MM_DD
    const datePattern = /(\d{4})[-_](\d{2})[-_](\d{2})/;
    const dateMatch = filename.match(datePattern);
    
    if (dateMatch) {
        const [, year, month, day] = dateMatch;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    return null;
}

/**
 * Simple EXIF date extraction for JPEG files
 * @param {string} filePath 
 * @returns {Promise<Date|null>}
 */
async function extractExifDate(filePath) {
    try {
        const ext = path.extname(filePath).toLowerCase();
        if (!['.jpg', '.jpeg'].includes(ext)) {
            return null;
        }

        const buffer = await readFile(filePath);
        
        // Look for EXIF DateTime tag (0x0132)
        // This is a very basic EXIF parser - for production use a proper library
        const exifMarker = Buffer.from([0xFF, 0xE1]); // APP1 marker
        let offset = buffer.indexOf(exifMarker);
        
        if (offset === -1) return null;
        
        // Skip APP1 marker and length
        offset += 4;
        
        // Look for "Exif" identifier
        if (buffer.slice(offset, offset + 4).toString() !== 'Exif') return null;
        
        // Skip to TIFF header
        offset += 6;
        
        // Note: For this simplified implementation, we skip proper EXIF parsing
        // and just look for datetime patterns in the buffer
        
        // This is a simplified approach - look for datetime string pattern
        const dateTimePattern = /(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        const bufferString = buffer.toString('ascii');
        const match = bufferString.match(dateTimePattern);
        
        if (match) {
            const [, year, month, day, hour, minute, second] = match;
            return new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hour),
                parseInt(minute),
                parseInt(second)
            );
        }
        
        return null;
    } catch (error) {
        console.warn(`Could not extract EXIF from ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Get file stats and extract creation/modification date
 * @param {string} filePath 
 * @returns {Promise<Date>}
 */
async function getFileDate(filePath) {
    try {
        const stats = await stat(filePath);
        // Use the earlier of creation time or modification time
        return new Date(Math.min(stats.birthtime.getTime(), stats.mtime.getTime()));
    } catch (error) {
        console.warn(`Could not get file stats for ${filePath}:`, error.message);
        return new Date(0); // Fallback to epoch
    }
}

/**
 * Get the best available date for a photo
 * @param {string} filePath 
 * @param {string} filename 
 * @returns {Promise<{date: Date, source: string}>}
 */
async function getBestPhotoDate(filePath, filename) {
    // Priority order: EXIF > filename > file system
    
    // Try EXIF first
    const exifDate = await extractExifDate(filePath);
    if (exifDate && exifDate.getTime() > 0) {
        return { date: exifDate, source: 'EXIF' };
    }
    
    // Try filename pattern
    const filenameDate = extractDateFromFilename(filename);
    if (filenameDate) {
        return { date: filenameDate, source: 'filename' };
    }
    
    // Fallback to file system
    const fileDate = await getFileDate(filePath);
    return { date: fileDate, source: 'filesystem' };
}

/**
 * Process all photos in the directory
 * @returns {Promise<Array>}
 */
async function processPhotos() {
    try {
        console.log(`Reading photos from: ${PHOTOGRAPHY_DIR}`);
        
        // Read all files in the photography directory
        const files = await readdir(PHOTOGRAPHY_DIR);
        
        // Filter for image files only (exclude photos.json)
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return IMAGE_EXTENSIONS.includes(ext) && file !== 'photos.json';
        });
        
        console.log(`Found ${imageFiles.length} image files`);
        console.log('Processing photos for date information...\n');
        
        // Process each file to get date information
        const photoData = await Promise.all(
            imageFiles.map(async (filename) => {
                const filePath = path.join(PHOTOGRAPHY_DIR, filename);
                
                const { date, source } = await getBestPhotoDate(filePath, filename);
                
                console.log(`📸 ${filename} - ${date.toISOString()} (${source})`);
                
                return {
                    filename,
                    date,
                    timestamp: date.getTime(),
                    source
                };
            })
        );
        
        // Sort by date (newest first)
        photoData.sort((a, b) => b.timestamp - a.timestamp);
        
        console.log('\n📅 Final organization (newest to oldest):');
        photoData.forEach((photo, index) => {
            console.log(`${index + 1}. ${photo.filename} - ${photo.date.toLocaleDateString()} ${photo.date.toLocaleTimeString()}`);
        });
        
        // Show source statistics
        const sourceStats = photoData.reduce((acc, photo) => {
            acc[photo.source] = (acc[photo.source] || 0) + 1;
            return acc;
        }, {});
        
        console.log('\n📊 Date source statistics:');
        Object.entries(sourceStats).forEach(([source, count]) => {
            console.log(`  ${source}: ${count} photos`);
        });
        
        return photoData.map(photo => photo.filename);
        
    } catch (error) {
        console.error('Error processing photos:', error);
        throw error;
    }
}

/**
 * Generate and save the photos.json file
 */
async function generatePhotosJson() {
    try {
        console.log('🏞️  Photo Organization Script');
        console.log('==============================\n');
        
        const sortedFilenames = await processPhotos();
        
        // Write the JSON file
        await writeFile(OUTPUT_JSON, JSON.stringify(sortedFilenames, null, 4));
        
        console.log(`\n✅ Successfully generated ${OUTPUT_JSON}`);
        console.log(`📸 Organized ${sortedFilenames.length} photos by date`);
        console.log('📅 Photos are sorted from newest to oldest');
        console.log('\n💡 Tip: Run this script whenever you add new photos to keep them organized!');
        
    } catch (error) {
        console.error('❌ Error generating photos.json:', error);
        process.exit(1);
    }
}

// Run the script if called directly
if (require.main === module) {
    generatePhotosJson();
}

module.exports = {
    generatePhotosJson,
    processPhotos,
    extractDateFromFilename,
    extractExifDate,
    getBestPhotoDate
};