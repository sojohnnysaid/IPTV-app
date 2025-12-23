# IPTV Live TV App

A web-based IPTV player with an Apple TV-style interface. Browse channels by category and stream live TV in your browser.

## Features

- Category-based channel browsing (Sports, News, Movies, etc.)
- Apple TV-inspired dark UI with smooth animations
- HLS and MPEG-TS stream support
- Fullscreen mode with auto-hiding cursor
- Keyboard shortcuts (Arrow keys, Enter, Space, F, Escape)
- Search within categories
- Responsive design

## Quick Start (Local)

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open browser to http://localhost:6502
```

## Deploying on Unraid

### Option 1: Node.js (Simplest)

1. Copy this folder to your Unraid share (e.g., `/mnt/user/personal_data/iptv-app/`)

2. SSH into Unraid or use the terminal

3. Install Node.js if not already available (via Nerd Tools plugin or Docker)

4. Run the server:
   ```bash
   cd /mnt/user/personal_data/iptv-app
   npm install
   node server.js
   ```

5. Access at `http://YOUR_UNRAID_IP:6502`

### Option 2: Docker with Node.js (Recommended)

Create a simple Docker container:

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

### Option 3: Nginx (Static + Proxy)

If you prefer Nginx, you'll need to configure it to serve static files. Note: The app requires proper MIME types for `.m3u` files.

Example nginx config:
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
├── index.html      # Main application (self-contained)
├── server.js       # Simple Node.js static server
├── package.json    # Node dependencies
├── channels.m3u    # Your M3U playlist
└── README.md       # This file
```

## Updating Channels

Replace `channels.m3u` with your own M3U playlist. The app expects standard EXTINF format:

```
#EXTM3U
#EXTINF:-1 tvg-chno="101" tvg-name="Channel Name" group-title="Category",Channel Name
http://stream-url-here
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ↑/↓ | Navigate channels |
| Enter | Play selected channel |
| Space | Play/Pause |
| F | Toggle fullscreen |
| Escape | Exit fullscreen / Go back |

## Ports

- Default: `6502`
- Change in `server.js` if needed

## Troubleshooting

**Streams not playing:**
- Check browser console for CORS errors
- Some streams may require the source server to allow cross-origin requests

**App not loading:**
- Ensure port 6502 is not blocked by firewall
- Check that Node.js is running: `ps aux | grep node`

**Channels not showing:**
- Verify `channels.m3u` exists and is valid M3U format
