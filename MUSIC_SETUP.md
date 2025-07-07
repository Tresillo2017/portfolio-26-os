# Last.fm Music Integration

This component integrates with the Last.fm API to display your music listening data, including:

- **Now Playing**: Currently playing track (if any)
- **Top Tracks**: Your most played tracks from the last 7 days
- **Recent Tracks**: Your recently played music

## Setup

To use this component, you need to:

1. **Get a Last.fm API key**:
   - Go to https://www.last.fm/api/account/create
   - Create an application and get your API key

2. **Configure environment variables**:
   - Open the `.env` file in the root of your project
   - Replace the placeholder values with your actual Last.fm credentials:
   ```env
   REACT_APP_LASTFM_API_KEY=your_actual_api_key_here
   REACT_APP_LASTFM_USERNAME=your_lastfm_username
   ```

3. **Restart your development server**:
   - After updating the `.env` file, restart your React development server for the changes to take effect

## Environment Variables

The component uses these environment variables:

- `REACT_APP_LASTFM_API_KEY`: Your Last.fm API key
- `REACT_APP_LASTFM_USERNAME`: Your Last.fm username

**Note**: Environment variables in React must be prefixed with `REACT_APP_` to be accessible in the browser.

## Features

- **Live Now Playing**: Shows currently playing track with a pulsing indicator
- **Top Tracks**: Displays your most played tracks with play counts
- **Recent History**: Shows your recent listening history with timestamps
- **Responsive Design**: Adapts to different window sizes
- **Error Handling**: Graceful error handling with retry functionality and helpful setup messages
- **Win95 Theme**: Styled to match the portfolio's retro aesthetic

## Security

- Environment variables are loaded at build time and are public (client-side)
- Last.fm API keys are safe to expose in frontend applications
- The API key only allows read access to public Last.fm data

## CORS Note

The Last.fm API supports CORS for browser requests. Make sure your API key is valid and active.

## API Endpoints Used

- `user.gettoptracks` - Gets top tracks for the specified user
- `user.getrecenttracks` - Gets recent tracks for the specified user

The component automatically determines the "now playing" track from the recent tracks response (tracks with the `nowplaying` attribute).
