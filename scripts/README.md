# Scripts

This directory contains scripts. 

## `organize-photos.js`
An enhanced version that also attempts to extract EXIF metadata for more accurate dates.

**Features:**
- Basic EXIF date extraction for JPEG files
- Priority order: EXIF → filename → file system
- Detailed logging showing date sources
- Statistics on date extraction methods

### Usage

```bash
npm run organize-photos
```

### Output

Both scripts generate `public/photography/photos.json` with an array of photo filenames sorted by date (newest first):

```json
[
    "20250726_232630.jpg",
    "RUID00b1c7d8276d41499cbb96055fadc82f.jpg",
    "RUID079fbcd67b8e408d87204a5fb2539725.jpg"
]
```

### Supported Formats

- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`, `.tiff`
- **Date Patterns**: 
  - `YYYYMMDD_HHMMSS` (e.g., `20250726_232630.jpg`)
  - `YYYY-MM-DD` or `YYYY_MM_DD` (e.g., `2025-07-26.jpg`)

### When to Run

Run these scripts whenever you:
- Add new photos to the `public/photography/` directory
- Want to reorder existing photos by date
- Update photo filenames with date information

### Notes

- The advanced script includes a simplified EXIF parser for demonstration
- For production use with extensive EXIF needs, consider using libraries like `exif-js` or `piexifjs`
- Photos are automatically filtered to exclude the `photos.json` file itself
- File system dates are used as fallback when no other date information is available