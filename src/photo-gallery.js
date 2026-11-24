/**
 * Photo Gallery Module for Euodia Natalina Siagian
 * "A LITTLE GALLERY OF YOU"
 * "Ten little frames, a thousand reasons to smile."
 */

export const PHOTOS_DATA = [
    {
        id: 1,
        number: '01',
        src: '/photos/euodia-01.jpg',
        alt: 'Euodia Natalina Siagian - Memory 01',
        caption: 'Memory 01'
    },
    {
        id: 2,
        number: '02',
        src: '/photos/euodia-02.jpg',
        alt: 'Euodia Natalina Siagian - Memory 02',
        caption: 'Memory 02'
    },
    {
        id: 3,
        number: '03',
        src: '/photos/euodia-03.jpg',
        alt: 'Euodia Natalina Siagian - Memory 03',
        caption: 'Memory 03'
    },
    {
        id: 4,
        number: '04',
        src: '/photos/euodia-04.jpg',
        alt: 'Euodia Natalina Siagian - Memory 04',
        caption: 'Memory 04'
    },
    {
        id: 5,
        number: '05',
        src: '/photos/euodia-05.jpg',
        alt: 'Euodia Natalina Siagian - Memory 05',
        caption: 'Memory 05'
    },
    {
        id: 6,
        number: '06',
        src: '/photos/euodia-06.jpg',
        alt: 'Euodia Natalina Siagian - Memory 06',
        caption: 'Memory 06'
    },
    {
        id: 7,
        number: '07',
        src: '/photos/euodia-07.jpg',
        alt: 'Euodia Natalina Siagian - Memory 07',
        caption: 'Memory 07'
    },
    {
        id: 8,
        number: '08',
        src: '/photos/euodia-08.jpg',
        alt: 'Euodia Natalina Siagian - Memory 08',
        caption: 'Memory 08'
    },
    {
        id: 9,
        number: '09',
        src: '/photos/euodia-09.jpg',
        alt: 'Euodia Natalina Siagian - Memory 09',
        caption: 'Memory 09'
    },
    {
        id: 10,
        number: '10',
        src: '/photos/euodia-10.jpg',
        alt: 'Euodia Natalina Siagian - Memory 10',
        caption: 'Memory 10'
    }
];

export const FALLBACK_PHOTO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#241028"/>
      <stop offset="50%" stop-color="#3d1838"/>
      <stop offset="100%" stop-color="#1b0c1e"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#ffb3c6" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ffb3c6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="750" fill="url(#bg)"/>
  <circle cx="300" cy="340" r="220" fill="url(#glow)"/>
  <rect x="30" y="30" width="540" height="690" rx="16" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.35"/>
  <text x="300" y="330" font-size="48" text-anchor="middle">✨</text>
  <text x="300" y="380" font-family="'Playfair Display', serif" font-size="22" font-weight="600" fill="#fbe39a" text-anchor="middle" letter-spacing="2">EUODIA</text>
  <text x="300" y="420" font-family="'Outfit', sans-serif" font-size="14" fill="#d8b5c8" text-anchor="middle" opacity="0.8">A cherished moment</text>
</svg>
`)}`;

/**
 * Controller for Photo Gallery and Lightbox
 */
export class PhotoGalleryController {
    constructor(containerId = 'photo-gallery-container', lightboxId = 'gallery-lightbox') {
        this.container = document.getElementById(containerId);
        this.lightbox = document.getElementById(lightboxId);
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchMoved = false;

        this.init();
    }

    init() {
        if (!this.container) return;
        this.renderGallery();
        this.setupLightbox();
        this.setupKeyboard();
    }

    renderGallery() {
        this.container.innerHTML = `
            <div class="gallery-wrapper">
                <div class="gallery-header">
                    <span class="gallery-badge">MOMENTS &amp; MEMORIES</span>
                    <h3 class="gallery-title">A LITTLE GALLERY OF YOU</h3>
                    <p class="gallery-subtitle">Ten little frames, a thousand reasons to smile.</p>
                </div>
                
                <div class="gallery-carousel-wrap">
                    <button type="button" class="gallery-nav-btn gallery-prev" id="gallery-prev-btn" aria-label="Previous photograph">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    
                    <div class="gallery-track" id="gallery-track" role="region" aria-label="Euodia's Birthday Gallery" tabindex="0">
                        ${PHOTOS_DATA.map((item, idx) => `
                            <article class="polaroid-card" data-index="${idx}" tabindex="0" role="button" aria-label="View photograph ${item.number}">
                                <div class="polaroid-inner">
                                    <div class="polaroid-photo-frame">
                                        <img 
                                            src="${item.src}" 
                                            alt="${item.alt}" 
                                            class="polaroid-img" 
                                            loading="lazy"
                                            decoding="async"
                                            onerror="this.onerror=null;this.src='${FALLBACK_PHOTO_SVG}';"
                                        />
                                        <div class="polaroid-shine" aria-hidden="true"></div>
                                    </div>
                                    <div class="polaroid-footer">
                                        <span class="polaroid-caption">${item.caption}</span>
                                        <span class="polaroid-num">${item.number} / 10</span>
                                    </div>
                                </div>
                            </article>
                        `).join('')}
                    </div>

                    <button type="button" class="gallery-nav-btn gallery-next" id="gallery-next-btn" aria-label="Next photograph">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                </div>

                <div class="gallery-indicator" id="gallery-indicator">
                    <span id="gallery-counter-text" class="gallery-counter">01 / 10</span>
                    <div class="gallery-dots">
                        ${PHOTOS_DATA.map((_, i) => `<span class="gallery-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        this.bindGalleryEvents();
    }

    bindGalleryEvents() {
        const track = document.getElementById('gallery-track');
        const prevBtn = document.getElementById('gallery-prev-btn');
        const nextBtn = document.getElementById('gallery-next-btn');
        const cards = this.container.querySelectorAll('.polaroid-card');

        // Card tap opens Lightbox
        cards.forEach((card) => {
            const idx = parseInt(card.dataset.index, 10);
            card.addEventListener('click', () => this.openLightbox(idx));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openLightbox(idx);
                }
            });
        });

        // Prev / Next button actions
        if (prevBtn && track) {
            prevBtn.addEventListener('click', () => {
                const cardWidth = track.firstElementChild?.offsetWidth || 280;
                track.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' });
            });
        }

        if (nextBtn && track) {
            nextBtn.addEventListener('click', () => {
                const cardWidth = track.firstElementChild?.offsetWidth || 280;
                track.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
            });
        }

        // Track scroll updates dots and counter
        if (track) {
            let scrollTimeout;
            track.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const card = track.firstElementChild;
                    if (!card) return;
                    const cardWidth = card.offsetWidth + 16;
                    const index = Math.min(
                        PHOTOS_DATA.length - 1,
                        Math.max(0, Math.round(track.scrollLeft / cardWidth))
                    );
                    this.updateActiveDot(index);
                }, 50);
            }, { passive: true });
        }

        // Dot clicking
        this.container.querySelectorAll('.gallery-dot').forEach((dot) => {
            dot.addEventListener('click', () => {
                const i = parseInt(dot.dataset.dot, 10);
                if (track && !isNaN(i)) {
                    const card = track.firstElementChild;
                    const cardWidth = card ? card.offsetWidth + 16 : 280;
                    track.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                }
            });
        });
    }

    updateActiveDot(index) {
        const counter = document.getElementById('gallery-counter-text');
        if (counter) counter.textContent = `${PHOTOS_DATA[index].number} / 10`;

        const dots = this.container.querySelectorAll('.gallery-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    setupLightbox() {
        if (!this.lightbox) return;

        this.lightbox.innerHTML = `
            <div class="lightbox-overlay" id="lightbox-backdrop" aria-hidden="true"></div>
            <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Photo Lightbox">
                <button type="button" class="lightbox-close-btn" id="lightbox-close-btn" aria-label="Close photo view">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>

                <div class="lightbox-body" id="lightbox-body">
                    <button type="button" class="lightbox-arrow lightbox-arrow-prev" id="lightbox-prev" aria-label="Previous photograph">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>

                    <div class="lightbox-stage">
                        <div class="lightbox-image-wrap">
                            <img id="lightbox-img" class="lightbox-img" alt="" src="" />
                            <div class="lightbox-spinner" id="lightbox-spinner" aria-hidden="true"></div>
                        </div>
                        <div class="lightbox-info">
                            <span class="lightbox-counter" id="lightbox-counter">01 / 10</span>
                            <h4 class="lightbox-caption" id="lightbox-caption">Memory 01</h4>
                        </div>
                    </div>

                    <button type="button" class="lightbox-arrow lightbox-arrow-next" id="lightbox-next" aria-label="Next photograph">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                </div>
            </div>
        `;

        document.getElementById('lightbox-close-btn')?.addEventListener('click', () => this.closeLightbox());
        document.getElementById('lightbox-backdrop')?.addEventListener('click', () => this.closeLightbox());
        document.getElementById('lightbox-prev')?.addEventListener('click', () => this.prevPhoto());
        document.getElementById('lightbox-next')?.addEventListener('click', () => this.nextPhoto());

        // Touch swipe on lightbox stage
        const stage = this.lightbox.querySelector('.lightbox-stage');
        if (stage) {
            stage.addEventListener('touchstart', (e) => {
                const t = e.touches[0];
                this.touchStartX = t.clientX;
                this.touchStartY = t.clientY;
                this.touchMoved = false;
            }, { passive: true });

            stage.addEventListener('touchmove', (e) => {
                const t = e.touches[0];
                const dx = t.clientX - this.touchStartX;
                const dy = t.clientY - this.touchStartY;
                if (Math.abs(dx) > 10 || Math.abs(dy) > 10) this.touchMoved = true;
            }, { passive: true });

            stage.addEventListener('touchend', (e) => {
                if (!this.touchMoved) return;
                const t = e.changedTouches[0];
                const dx = t.clientX - this.touchStartX;
                const dy = t.clientY - this.touchStartY;

                // Horizontal swipe
                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) this.prevPhoto();
                    else this.nextPhoto();
                } else if (dy > 65 && Math.abs(dy) > Math.abs(dx)) {
                    // Swipe down to dismiss
                    this.closeLightbox();
                }
            }, { passive: true });
        }
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (!this.lightbox || this.lightbox.hidden) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                this.closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevPhoto();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextPhoto();
            }
        });
    }

    openLightbox(index = 0) {
        if (!this.lightbox) return;
        this.currentIndex = index;
        this.updateLightboxContent();
        this.lightbox.hidden = false;
        this.lightbox.classList.add('is-open');
        document.body.classList.add('lightbox-active');

        document.getElementById('lightbox-close-btn')?.focus();
    }

    closeLightbox() {
        if (!this.lightbox || this.lightbox.hidden) return;
        this.lightbox.classList.remove('is-open');
        this.lightbox.hidden = true;
        document.body.classList.remove('lightbox-active');
    }

    nextPhoto() {
        this.currentIndex = (this.currentIndex + 1) % PHOTOS_DATA.length;
        this.updateLightboxContent();
    }

    prevPhoto() {
        this.currentIndex = (this.currentIndex - 1 + PHOTOS_DATA.length) % PHOTOS_DATA.length;
        this.updateLightboxContent();
    }

    updateLightboxContent() {
        const item = PHOTOS_DATA[this.currentIndex];
        if (!item) return;

        const img = document.getElementById('lightbox-img');
        const counter = document.getElementById('lightbox-counter');
        const caption = document.getElementById('lightbox-caption');
        const spinner = document.getElementById('lightbox-spinner');

        if (counter) counter.textContent = `${item.number} / 10`;
        if (caption) caption.textContent = item.caption;

        if (img) {
            img.style.opacity = '0';
            if (spinner) spinner.hidden = false;

            const temp = new Image();
            temp.onload = () => {
                img.src = item.src;
                img.alt = item.alt;
                img.style.opacity = '1';
                if (spinner) spinner.hidden = true;
            };
            temp.onerror = () => {
                img.src = FALLBACK_PHOTO_SVG;
                img.alt = item.alt;
                img.style.opacity = '1';
                if (spinner) spinner.hidden = true;
            };
            temp.src = item.src;
        }
    }
}
