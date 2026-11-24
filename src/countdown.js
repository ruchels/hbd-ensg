/**
 * Birthday Countdown Module for Euodia Natalina Siagian
 * Target: December 7, 2026, 00:00:00 WIB (Asia/Jakarta, UTC+07:00)
 */

import { RECIPIENT_INFO, PERSONAL_MESSAGES } from './personal-card.js';

export const TARGET_TIMESTAMP = new Date(RECIPIENT_INFO.birthdayTargetWib).getTime();

export function calculateTimeRemaining(targetTime = TARGET_TIMESTAMP) {
    const now = Date.now();
    const diff = Math.max(0, targetTime - now);

    const isArrived = diff <= 0;

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return {
        days,
        hours,
        minutes,
        seconds,
        isArrived,
        formatted: {
            days: String(days).padStart(2, '0'),
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0')
        },
        message: isArrived ? PERSONAL_MESSAGES.countdownCelebration : PERSONAL_MESSAGES.countdownWaiting
    };
}

export class BirthdayCountdown {
    constructor(elements = {}) {
        this.elements = {
            days: elements.days || document.getElementById('count-days'),
            hours: elements.hours || document.getElementById('count-hours'),
            minutes: elements.minutes || document.getElementById('count-minutes'),
            seconds: elements.seconds || document.getElementById('count-seconds'),
            message: elements.message || document.getElementById('count-message'),
            container: elements.container || document.getElementById('birthday-countdown-wrap'),
            actionWrap: elements.actionWrap || document.getElementById('surprise-action-wrap')
        };
        this.timer = null;
        this.targetTime = TARGET_TIMESTAMP;
        this.lastValues = { days: '', hours: '', minutes: '', seconds: '' };

        // Check if preview/test flag is enabled via URL search parameter (e.g. ?preview=1 or ?open=1)
        const params = new URLSearchParams(window.location.search);
        this.isPreview = params.has('preview') || params.has('test') || params.has('open');

        this.setupSecretUnlock();
    }

    setupSecretUnlock() {
        // Triple-click on countdown wrapper or status message unlocks the button anytime for testing
        const target = this.elements.wrap || this.elements.message;
        if (target) {
            let clickCount = 0;
            let clickTimer = null;
            target.addEventListener('click', () => {
                clickCount++;
                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => { clickCount = 0; }, 800);
                if (clickCount >= 3) {
                    this.isPreview = true;
                    this.showAction(true);
                    if (this.elements.message) {
                        this.elements.message.textContent = PERSONAL_MESSAGES.countdownCelebration;
                    }
                }
            });
        }
    }

    start() {
        this.update();
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.update(), 1000);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    showAction(visible) {
        if (!this.elements.actionWrap) return;
        if (visible) {
            this.elements.actionWrap.hidden = false;
            this.elements.actionWrap.classList.add('is-revealed');
        } else {
            this.elements.actionWrap.hidden = true;
            this.elements.actionWrap.classList.remove('is-revealed');
        }
    }

    update() {
        const data = calculateTimeRemaining(this.targetTime);

        this.updateDigit(this.elements.days, data.formatted.days, 'days');
        this.updateDigit(this.elements.hours, data.formatted.hours, 'hours');
        this.updateDigit(this.elements.minutes, data.formatted.minutes, 'minutes');
        this.updateDigit(this.elements.seconds, data.formatted.seconds, 'seconds');

        if (this.elements.message && this.elements.message.textContent !== data.message) {
            this.elements.message.textContent = data.message;
        }

        const canShowSurprise = data.isArrived || this.isPreview;

        if (canShowSurprise) {
            if (this.elements.container) {
                this.elements.container.classList.add('birthday-arrived');
            }
            this.showAction(true);
            if (data.isArrived) this.stop();
        } else {
            if (this.elements.container) {
                this.elements.container.classList.remove('birthday-arrived');
            }
            this.showAction(false);
        }
    }

    updateDigit(element, newValue, key) {
        if (!element) return;
        if (this.lastValues[key] !== newValue) {
            this.lastValues[key] = newValue;
            element.textContent = newValue;
            element.classList.remove('tick');
            void element.offsetWidth; // trigger reflow for css animation
            element.classList.add('tick');
        }
    }
}
