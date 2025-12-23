const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 6502;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.zip': 'application/zip',
    '.brs': 'text/plain',
    '.xml': 'application/xml',
    '.m3u': 'audio/x-mpegurl',
    '.m3u8': 'application/vnd.apple.mpegurl'
};

const server = http.createServer((req, res) => {
    // Strip query string from URL
    let urlPath = req.url.split('?')[0];
    let filePath = '.' + urlPath;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found: ' + filePath);
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            // Relaxed headers for external stream playback
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n  IPTV App Test Server running at:`);
    console.log(`  http://localhost:${PORT}\n`);
    console.log(`  Press Ctrl+C to stop\n`);
});
