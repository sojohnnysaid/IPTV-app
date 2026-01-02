const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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

function handleProxy(req, res, targetUrl) {
    try {
        const parsed = new URL(targetUrl);

        const options = {
            hostname: parsed.hostname,
            port: parsed.port || 80,
            path: parsed.pathname + parsed.search,
            method: 'GET',
            headers: {
                'User-Agent': 'IPTV-App/1.0'
            }
        };

        const proxyReq = http.request(options, (proxyRes) => {
            // Set CORS headers to allow browser access
            res.writeHead(proxyRes.statusCode, {
                'Content-Type': proxyRes.headers['content-type'] || 'video/mp2t',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Range',
                'Cache-Control': 'no-cache'
            });

            // Stream the response
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (err) => {
            console.error('Proxy error:', err.message);
            res.writeHead(502);
            res.end('Proxy error: ' + err.message);
        });

        proxyReq.end();
    } catch (err) {
        console.error('Proxy URL error:', err.message);
        res.writeHead(400);
        res.end('Invalid URL');
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Range'
        });
        res.end();
        return;
    }

    // Handle proxy requests: /proxy?url=http://...
    if (parsedUrl.pathname === '/proxy' && parsedUrl.query.url) {
        handleProxy(req, res, parsedUrl.query.url);
        return;
    }

    // Static file serving
    let filePath = '.' + parsedUrl.pathname;
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
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n  IPTV App running at:`);
    console.log(`  http://localhost:${PORT}\n`);
    console.log(`  Stream proxy enabled at /proxy?url=...\n`);
    console.log(`  Press Ctrl+C to stop\n`);
});
