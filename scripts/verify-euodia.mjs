import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// Quick static server test on dist
const DIST = path.resolve('dist');

const MIME = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0].split('#')[0];
    if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
    
    // Check dist first, then public
    let filePath = path.join(DIST, urlPath);
    if (!fs.existsSync(filePath)) {
        filePath = path.join(path.resolve('public'), urlPath);
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(4173, async () => {
    console.log('Test server running at http://localhost:4173');

    try {
        // Test fetching the root page
        const html = await fetch('http://localhost:4173/').then(r => r.text());

        console.log('--- Verifying HTML Content ---');
        const checks = [
            ['Countdown elements', html.includes('id="count-days"') && html.includes('id="count-seconds"')],
            ['Surprise action wrapper present', html.includes('id="surprise-action-wrap"')],
            ['Surprise button present inside wrapper', html.includes('id="btn-open-envelope"')],
            ['No landing title or date per user request', !html.includes('class="euodia-main-title"') && !html.includes('class="euodia-date-sub"')],
            ['No creator form', !html.includes('id="creator-form"')],
            ['No make your own button', !html.includes('id="btn-make-own"')],
            ['Photo gallery container', html.includes('id="photo-gallery-container"')],
            ['Final celebration banner', html.includes('HAPPY BIRTHDAY, EUODIA.')],
            ['Final quote', html.includes('May your days always be as beautiful as your heart.')],
            ['Replay button', html.includes('EXPERIENCE IT AGAIN')]
        ];

        let failed = false;
        for (const [name, passed] of checks) {
            console.log(`${passed ? '✓' : '✗'} ${name}`);
            if (!passed) failed = true;
        }

        // Test photo availability
        console.log('--- Verifying Photos ---');
        for (let i = 1; i <= 10; i++) {
            const num = String(i).padStart(2, '0');
            const res = await fetch(`http://localhost:4173/photos/euodia-${num}.jpg`);
            const ok = res.status === 200;
            console.log(`${ok ? '✓' : '✗'} /photos/euodia-${num}.jpg (${res.headers.get('content-type')})`);
            if (!ok) failed = true;
        }

        if (failed) {
            console.error('Test suite FAILED');
            process.exitCode = 1;
        } else {
            console.log('All static verifications PASSED!');
        }
    } catch (err) {
        console.error('Error during test:', err);
        process.exitCode = 1;
    } finally {
        server.close();
    }
});
