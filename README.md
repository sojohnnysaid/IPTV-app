# IPTV Live TV App

A web-based IPTV player with an Apple TV-style interface. Browse channels by category and stream live TV in your browser.

## Features

- **M3U Playlist Import** - Upload file or load from URL directly in the app
- **Dynamic Categories** - Auto-detected from group-title, fully customizable
- **Category Editor** - Rename categories, assign emojis, manage channels
- **Multi-Select Channel Assignment** - Bulk assign channels to categories
- **Persistent Storage** - All settings saved to localStorage
- **Apple TV-inspired UI** - Dark theme with smooth animations
- **HLS and MPEG-TS Support** - Works with most IPTV streams
- **Fullscreen Mode** - Auto-hiding cursor for distraction-free viewing
- **Keyboard Navigation** - Full keyboard shortcut support
- **Search** - Filter channels within categories
- **Responsive Design** - Works on desktop and tablets

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open browser to http://localhost:6502
```

On first launch, you'll be prompted to upload your M3U playlist or enter a URL.

## Usage

### Initial Setup

1. Start the app and you'll see the upload screen
2. Either drag & drop your `.m3u` file or enter a playlist URL
3. Categories are automatically created from `group-title` attributes
4. Click a category card to start browsing channels

### Managing Categories

Click the **edit icon** (pencil) on the home screen to:
- Rename categories
- Assign custom emojis
- Delete categories
- Add new categories

### Assigning Channels to Categories

In the category editor, scroll to **Channel Assignments**:
- Click channels to select them (or use "Select All")
- Choose a category from the dropdown
- Click "Assign" to move all selected channels
- Use search to filter channels by name or number

### Replacing Your Playlist

Click the **settings icon** (gear) on the home screen:
- **Replace Playlist** - Upload a new M3U file
  - Enable "Keep existing categories" to preserve your customizations
  - Channels are auto-matched by group-title
- **Reset App** - Clear all data and start fresh

## Deploying on Unraid

### Option 1: Docker (Recommended)

```bash
docker run -d \
  --name iptv-app \
  --restart unless-stopped \
  -p 6502:6502 \
  -v /mnt/user/personal_data/iptv-app:/app \
  -w /app \
  node:20-alpine \
  sh -c "npm install && node server.js"
```

### Option 2: Node.js Direct

1. Copy this folder to your Unraid share (e.g., `/mnt/user/personal_data/iptv-app/`)
2. SSH into Unraid or use the terminal
3. Install Node.js (via Nerd Tools plugin or Docker)
4. Run the server:
   ```bash
   cd /mnt/user/personal_data/iptv-app
   npm install
   node server.js
   ```
5. Access at `http://YOUR_UNRAID_IP:6502`

### Option 3: Nginx (Static)

```nginx
server {
    listen 6502;
    root /mnt/user/personal_data/iptv-app;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    types {
        audio/x-mpegurl m3u;
        application/vnd.apple.mpegurl m3u8;
    }
}
```

## File Structure

```
iptv-app/
├── index.html          # Main application (self-contained)
├── server.js           # Node.js static server
├── package.json        # Node dependencies
├── channels.m3u.example # Example playlist format
└── README.md           # This file
```

## M3U Format

The app expects standard EXTINF format with `group-title` for categories:

```
#EXTM3U
#EXTINF:-1 tvg-chno="101" tvg-name="Channel Name" group-title="Sports",Channel Name
http://stream-url-here
#EXTINF:-1 tvg-chno="102" tvg-name="Another Channel" group-title="News",Another Channel
http://another-stream-url
```

Supported attributes:
- `tvg-chno` - Channel number
- `tvg-name` - Channel name
- `group-title` - Category (used for auto-grouping)
- `tvg-logo` - Channel logo URL (optional)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ↑/↓ | Navigate channels |
| Enter | Play selected channel |
| Space | Play/Pause |
| F | Toggle fullscreen |
| Escape | Exit fullscreen / Go back to home |

## Configuration

- **Port**: Default is `6502`, change in `server.js` if needed
- **Data Storage**: All user data (channels, categories) stored in browser localStorage

## Troubleshooting

**Streams not playing:**
- Check browser console for CORS errors
- Some streams require the source server to allow cross-origin requests
- Try a different browser (Chrome/Edge recommended for HLS)

**App not loading:**
- Ensure port 6502 is not blocked by firewall
- Check that Node.js is running: `ps aux | grep node`

**Categories not showing:**
- Ensure your M3U has `group-title` attributes
- Check the category editor to see all detected categories

**Lost my settings:**
- Settings are stored in browser localStorage
- Clearing browser data will reset the app
- Use the same browser to retain your configuration
