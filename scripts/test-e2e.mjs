import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

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

const PORT = 4188;

server.listen(PORT, async () => {
    console.log(`E2E Server listening on http://localhost:${PORT}`);
    const browser = await chromium.launch({ channel: 'msedge', headless: true });

    let testsPassed = 0;
    let testsFailed = 0;

    const assert = (condition, desc) => {
        if (condition) {
            console.log(`  ✓ ${desc}`);
            testsPassed++;
        } else {
            console.error(`  ✗ ${desc}`);
            testsFailed++;
        }
    };

    try {
        console.log('\n--- 1. Desktop Experience Test (1280x800) ---');
        const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        const page = await context.newPage();

        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });
        page.on('pageerror', err => consoleErrors.push(err.message));

        await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

        // Check countdown numbers on clean landing page
        const days = await page.locator('#count-days').textContent();
        const hours = await page.locator('#count-hours').textContent();
        assert(days && days !== '00', `Countdown active: ${days} days, ${hours} hours`);

        const countMsg = await page.locator('#count-message').textContent();
        assert(countMsg.includes('Euodia'), `Countdown message: "${countMsg}"`);

        // Verify title & date are removed from landing page per user request
        const mainTitleCount = await page.locator('.euodia-main-title').count();
        assert(mainTitleCount === 0, 'Landing page has no separate title text');
        const dateSubCount = await page.locator('.euodia-date-sub').count();
        assert(dateSubCount === 0, 'Landing page has no separate date text');

        // Verify that before countdown finishes, the surprise button is HIDDEN
        const actionWrapHidden = await page.locator('#surprise-action-wrap').evaluate(el => el.hidden || el.style.display === 'none');
        assert(actionWrapHidden, 'Surprise action button is strictly HIDDEN while counting down');

        // Check creator is gone
        const creatorForm = await page.locator('#creator-form').count();
        assert(creatorForm === 0, 'No creator form exists');

        // Test unlocking via secret triple-click or ?preview=1
        console.log('Testing countdown completion / preview reveal...');
        await page.goto(`http://localhost:${PORT}/?preview=1`, { waitUntil: 'networkidle' });

        const actionWrapVisible = await page.locator('#surprise-action-wrap').isVisible();
        assert(actionWrapVisible, 'Surprise action button appears when countdown completes / preview enabled');

        // Click "OPEN YOUR SURPRISE"
        console.log('Clicking "OPEN YOUR SURPRISE"...');
        await page.locator('#btn-open-envelope').click();

        // Wait for switch
        await page.waitForSelector('#rcv-switch:not([hidden])', { timeout: 8000 });
        assert(true, 'Entered dark room with glowing switch');

        // Flip switch
        console.log('Flipping the room switch...');
        await page.locator('#rcv-switch').click({ force: true });

        // Wait for cake coming and skip song button
        console.log('Waiting for room tour and song...');
        await page.waitForSelector('#btn-skip-song:not([hidden])', { timeout: 15000 });
        assert(true, 'Birthday song started in 3D party room');

        console.log('Skipping song to make wish...');
        await page.locator('#btn-skip-song').click();

        // Wait for wish prompt
        await page.waitForSelector('#btn-wish-ready:not([hidden])', { timeout: 8000 });
        assert(true, 'Make a wish beat reached');

        console.log('Ready to blow candles...');
        await page.locator('#btn-wish-ready').click();

        // Wait for blow UI
        await page.waitForSelector('#rcv-blow:not([hidden])', { timeout: 5000 });
        assert(true, 'Candle blowing HUD active');

        // Extinguish candles by pressing space or clicking
        console.log('Blowing out candles via keyboard/touch...');
        for (let i = 0; i < 7; i++) {
            await page.keyboard.press('Space');
            await page.waitForTimeout(250);
        }

        // Wait for climax & message card open
        console.log('Waiting for celebration climax & message card...');
        await page.waitForSelector('#rcv-card.is-open', { timeout: 10000 });
        assert(true, 'Birthday message card opened after climax celebration');

        // Verify card headline
        const cardTitle = await page.locator('#view-title').textContent();
        assert(cardTitle.length > 0, `Card title rendered: "${cardTitle}"`);

        // Verify letter button
        const letterBtn = page.locator('#btn-read-letter');
        assert(await letterBtn.isVisible(), 'Read letter button is visible');

        // Click to read letter
        console.log('Opening personal letter...');
        await letterBtn.click();
        await page.waitForSelector('#letter-popup-overlay.active', { timeout: 3000 });
        assert(true, 'Letter popup overlay activated');

        // Tap envelope to unfold letter
        await page.locator('#letter-envelope-container').click();
        await page.waitForTimeout(1000);
        const letterContent = await page.locator('#letter-popup-sr').textContent();
        assert(letterContent.includes('Euodia') && letterContent.includes('celebrating you'), 'Personal letter text loaded correctly');

        // Close letter
        await page.locator('#btn-close-letter').click();
        await page.waitForTimeout(400);

        // Verify photo gallery has 10 polaroids
        const polaroidCards = await page.locator('.polaroid-card').count();
        assert(polaroidCards === 10, `Photo gallery has exactly 10 polaroids (found: ${polaroidCards})`);

        // Verify gallery title & subtitle
        const galleryTitle = await page.locator('.gallery-title').textContent();
        assert(galleryTitle.includes('A LITTLE GALLERY OF YOU'), `Gallery title: "${galleryTitle}"`);

        const gallerySub = await page.locator('.gallery-subtitle').textContent();
        assert(gallerySub.includes('Ten little frames'), `Gallery subtitle: "${gallerySub}"`);

        // Test Lightbox
        console.log('Opening photo lightbox...');
        await page.locator('.polaroid-card').first().click();
        await page.waitForSelector('#gallery-lightbox.is-open', { timeout: 3000 });
        assert(true, 'Photo lightbox opened');

        const lightboxCaption = await page.locator('#lightbox-caption').textContent();
        assert(lightboxCaption === 'Memory 01', `Lightbox caption: "${lightboxCaption}"`);

        // Close lightbox via close button
        await page.locator('#lightbox-close-btn').click();
        await page.waitForTimeout(300);
        const isClosed = await page.locator('#gallery-lightbox').evaluate(el => !el.classList.contains('is-open'));
        assert(isClosed, 'Lightbox closed cleanly');

        // Check final celebration banner
        const finaleTitle = await page.locator('.final-title').textContent();
        assert(finaleTitle.includes('HAPPY BIRTHDAY, EUODIA.'), `Finale title: "${finaleTitle}"`);

        const finalQuote = await page.locator('.final-quote').textContent();
        assert(finalQuote.includes('May your days always be as beautiful as your heart'), `Finale quote: "${finalQuote}"`);

        const finalReplay = page.locator('#btn-final-replay');
        assert(await finalReplay.isVisible(), 'Final replay button is visible');

        // Test clicking replay
        console.log('Testing replay button...');
        await finalReplay.click();
        await page.waitForTimeout(1500);
        assert(true, 'Replay initiated without navigating away');

        // Check console errors
        const severeErrors = consoleErrors.filter(e => !e.includes('AudioContext') && !e.includes('favicon'));
        assert(severeErrors.length === 0, `Zero critical console errors (found: ${severeErrors.length})`);

        await context.close();

        console.log('\n--- 2. Mobile Responsive Test (iPhone 390x844) ---');
        const mobileContext = await browser.newContext({
            viewport: { width: 390, height: 844 },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15'
        });
        const mPage = await mobileContext.newPage();
        await mPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

        // Check mobile layout has NO horizontal overflow
        const hasOverflow = await mPage.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });
        assert(!hasOverflow, 'Mobile viewport (390px) has zero horizontal overflow');

        await mPage.goto(`http://localhost:${PORT}/?preview=1`, { waitUntil: 'networkidle' });
        const mobileOpenBtn = mPage.locator('#btn-open-envelope');
        const box = await mobileOpenBtn.boundingBox();
        assert(box && box.height >= 44 && box.width >= 280, `Touch target size compliant: ${box?.width}x${box?.height}px`);

        await mobileContext.close();

        console.log('\n--- 3. Ultra-compact Mobile Test (320x568) ---');
        const smallContext = await browser.newContext({ viewport: { width: 320, height: 568 } });
        const sPage = await smallContext.newPage();
        await sPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

        const smallOverflow = await sPage.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });
        assert(!smallOverflow, 'Ultra-compact (320px) viewport has zero horizontal overflow');
        await smallContext.close();

        console.log('\n=============================================');
        console.log(`E2E Results: ${testsPassed} passed, ${testsFailed} failed`);
        console.log('=============================================');

        if (testsFailed > 0) process.exitCode = 1;

    } catch (err) {
        console.error('E2E Test Exception:', err);
        process.exitCode = 1;
    } finally {
        await browser.close();
        server.close();
    }
});
