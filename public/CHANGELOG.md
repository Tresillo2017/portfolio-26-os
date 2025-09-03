# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.6] - 2025-09-03

### Updated Friends application and Resume 

#### Changed

- Updated Friends application to use the correct terminology
- Updated the resume 

## [0.1.5] - 2025-08-25

### Gallery Application & Photography System Refactor

#### Added

- New Gallery application for browsing photography collection
- Modal photo viewer with keyboard navigation (arrow keys, escape)
- Gallery icon and integration with desktop shortcuts
- Public photography folder structure for better asset management

#### Changed

- Moved photography assets from `src/assets/pictures/photography/` to `public/photography/`
- Updated Gallery component to load photos from public folder via manifest
- Improved photo organization and accessibility

## [0.1.4] - 2025-08-24

### Friends Application

#### Added

- New Friends (Webring) application using classic Netscape styling/icon

## [0.1.3] - 2025-07-29

### Changelog Application & GitHub Integration

#### Added

- New Changelog application to track portfolio updates from Git history
- Real-time version tracking integrated with Git commits

#### Changed

- Updated version info to reflect current development state

## [0.1.2] - 2025-07-08

### Version Control & Documentation Updates

#### Added

- VersionInfo component to display OS version details in bottom-right corner
- Build arguments for LastFM API key and username in deployment

#### Changed

- Updated version information and removed outdated fraternity details

#### Fixed

- Docker deployment configuration with LastFM API integration

## [0.1.1] - 2025-07-08

### Music Application & Last.fm Integration

#### Added

- Complete Music application with Last.fm API integration
- Real-time display of now playing, top tracks, and recent tracks
- Responsive layout with album art and hover effects
- Error handling for API requests and loading states
- Vinyl record animation for currently playing tracks

#### Removed

- Unused MUSIC_SETUP.md documentation file

## [0.1.0] - 2025-07-07

### Initial Portfolio OS Release

#### Added

- Complete Windows 95-style operating system interface
- Desktop environment with draggable windows and shortcuts
- Taskbar with start menu and window management system
- Multiple applications: Computer, Showcase, Games (Oregon Trail, Doom, Scrabble, Henordle)
- React-based architecture with TypeScript support
- Retro styling with MSSerif fonts and Windows 95 color scheme
- Responsive design for modern devices
- Credits system and shutdown sequence animations
