import './style.css';
import './styles/icons.css';
import './styles/receiver.css';
import './styles/personal-birthday.css';

import { decodeCardHash } from './card-link.js';
import { BACKDROP_NAMES } from './backdrop-names.js';
import { PERSONAL_CARD_CONFIG } from './personal-card.js';
import { BirthdayCountdown } from './countdown.js';

let viewerModule = null;
const loadViewer = () => import('./viewer.js').then((m) => (viewerModule = m));

// Explicit allowed enum sets decoupled from DOM forms
export const ALLOWED_THEMES = new Set([
    'neon-rose', 'midnight-gold', 'pastel-mint', 'lavender-dream',
    'sakura-blossom', 'cyber-retro', 'forest-moss', 'cosmic-nebula', 'choco-monarch'
]);

export const ALLOWED_PRESETS = new Set([
    '', 'pink-dream', 'chocolate-royal', 'mint-chocolate',
    'midnight-gold', 'sakura-sweet', 'cosmic-crystal'
]);

export const ALLOWED_MUSIC = new Set([
    'happy-birthday-lofi', 'happy-birthday-piano', 'happy-birthday-synth'
]);

export const ALLOWED_FONTS = new Set(['outfit', 'playfair', 'great-vibes']);
export const ALLOWED_LETTER_THEMES = new Set(['royal', 'romance', 'cyber', 'steampunk']);
export const ALLOWED_CAKE_MODELS = new Set(['classic-tiered', 'vintage-heart', 'korean-bento', 'triple-luxury', 'cyber-prism']);
export const ALLOWED_PLATES = new Set(['ceramic', 'crystal', 'golden', 'cosmic']);
export const ALLOWED_GLAZES = new Set(['chocolate', 'strawberry', 'mint', 'cream']);
export const ALLOWED_TOPPERS = new Set(['hbd', 'star', 'best-senpai', 'none', 'custom']);
export const ALLOWED_BACKDROPS = new Set(['party', 'night', 'blush', 'cream', 'sky', 'mint', 'lavender', ...BACKDROP_NAMES]);

/**
 * Dedicated Application Controller for Euodia Natalina Siagian's Birthday Experience
 */
class App {
    constructor() {
        this.receiverView = document.getElementById('receiver-view');
        this.countdown = null;

        // Bind routing
        window.addEventListener('hashchange', () => this.handleRouting());
        window.addEventListener('DOMContentLoaded', () => {
            this.handleRouting();
            this.setupGlobalEvents();
            this.initCountdown();
        });
    }

    initCountdown() {
        if (!this.countdown) {
            this.countdown = new BirthdayCountdown();
            this.countdown.start();
        }
    }

    async handleRouting() {
        const hash = window.location.hash || '';
        const token = (this.routeToken = (this.routeToken || 0) + 1);

        // Clean up previous viewer states
        this.cleanupCurrentView();

        // Always activate receiver view
        if (this.receiverView) {
            this.receiverView.classList.add('active-view');
        }

        await loadViewer();
        if (token !== this.routeToken) return;

        let cardConfig = { ...PERSONAL_CARD_CONFIG };

        // If a valid custom card link was explicitly provided, allow decoding with fallback to Euodia's config
        if (hash.startsWith('#/view/') || hash.startsWith('#/c/')) {
            try {
                const decoded = await decodeCardHash(hash);
                if (token === this.routeToken && decoded?.config) {
                    cardConfig = sanitizeCardConfig(decoded.config, PERSONAL_CARD_CONFIG);
                }
            } catch (err) {
                console.warn('[Router] Failed to decode hash, falling back to Euodia card:', err);
                cardConfig = { ...PERSONAL_CARD_CONFIG };
            }
        }

        if (token === this.routeToken) {
            await this.mountReceiverView(cardConfig);
        }
    }

    cleanupCurrentView() {
        viewerModule?.destroyViewer();
    }

    async mountReceiverView(cardConfig) {
        // Apply visual theme from the greeting configuration
        this.applyTheme(cardConfig.theme || 'neon-rose');

        // Initialize the interactive 3D WebGL card
        viewerModule.initViewer(cardConfig);
    }

    applyTheme(themeName) {
        document.body.className = '';
        document.body.classList.add(`theme-${themeName}`);
    }

    setupGlobalEvents() {
        // Envelope teaser triggers the main surprise open button
        const teaser = document.getElementById('teaser-envelope');
        const openBtn = document.getElementById('btn-open-envelope');
        if (teaser && openBtn) {
            teaser.addEventListener('click', () => openBtn.click());
            teaser.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openBtn.click();
                }
            });
        }

        // Final replay button triggers the receiver replay
        const finalReplayBtn = document.getElementById('btn-final-replay');
        const rcvReplayBtn = document.getElementById('btn-replay');
        if (finalReplayBtn && rcvReplayBtn) {
            finalReplayBtn.addEventListener('click', () => rcvReplayBtn.click());
        }

        // Escape closes whichever dialog is on top
        window.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            const closeIds = ['btn-close-letter', 'btn-close-greeting-card', 'lightbox-close-btn'];
            for (const id of closeIds) {
                const btn = document.getElementById(id);
                if (btn && isShown(btn)) {
                    btn.click();
                    break;
                }
            }
        });

        // Prevent default spacebar and arrow keys scrolling in 3D receiver mode
        window.addEventListener('keydown', (e) => {
            if (this.receiverView?.classList.contains('active-view')) {
                const target = e.target;
                const isFormEl = target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName);
                if (!isFormEl && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                    e.preventDefault();
                }
            }
        });
    }
}

function isShown(el) {
    if (typeof el.checkVisibility === 'function') {
        return el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
    }
    return el.offsetParent !== null;
}

function clampText(value, max) {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/**
 * Pure sanitizer without DOM dependencies
 */
function sanitizeCardConfig(config, defaults) {
    const out = { ...defaults };
    const enums = {
        theme: ALLOWED_THEMES,
        preset: ALLOWED_PRESETS,
        music: ALLOWED_MUSIC,
        font: ALLOWED_FONTS,
        letterTheme: ALLOWED_LETTER_THEMES,
        cakeModel: ALLOWED_CAKE_MODELS,
        plate: ALLOWED_PLATES,
        glaze: ALLOWED_GLAZES,
        topper: ALLOWED_TOPPERS,
        backdrop: ALLOWED_BACKDROPS
    };

    for (const [key, allowed] of Object.entries(enums)) {
        if (allowed.has(config[key])) out[key] = config[key];
    }

    const texts = {
        recipientName: 60, sender: 60, bdate: 10, title: 120, message: 2000,
        letterTitle: 120, letterBody: 4000, topperText: 40
    };
    for (const [key, max] of Object.entries(texts)) {
        out[key] = typeof config[key] === 'string' ? clampText(config[key], max) : (defaults[key] || '');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(out.bdate)) out.bdate = defaults.bdate || '';

    const ints = { candles: [1, 10], strawberries: [0, 8], cherries: [0, 8], rolls: [0, 6] };
    for (const [key, [min, max]] of Object.entries(ints)) {
        const n = parseInt(config[key], 10);
        if (Number.isFinite(n)) out[key] = Math.min(max, Math.max(min, n));
    }

    for (const key of ['sprinkles', 'letterEnabled', 'decorHearts', 'decorStars']) {
        if (typeof config[key] === 'boolean') out[key] = config[key];
    }

    for (const key of [
        'glazeColor', 'creamColor', 'plateColor', 'candleColor',
        'topperColor', 'envBaseColor', 'envFlapColor', 'envSealColor'
    ]) {
        out[key] = typeof config[key] === 'string' && /^#[0-9a-f]{6}$/i.test(config[key]) ? config[key] : (defaults[key] || '');
    }

    out.photo = '';
    if (typeof config.photo === 'string' && config.photo) {
        try {
            const url = new URL(config.photo);
            if (url.protocol === 'https:') out.photo = url.href;
        } catch {
            out.photo = '';
        }
    }
    return out;
}

// Instantiate App
new App();
