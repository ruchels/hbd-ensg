/**
 * Dedicated Personal Card Configuration for Euodia Natalina Siagian
 * Exclusively created by her boyfriend for her 20th birthday.
 */

export const RECIPIENT_INFO = Object.freeze({
    fullName: 'Euodia Natalina Siagian',
    shortName: 'Euodia',
    signName: 'EUODIA',
    age: 20,
    birthdayIso: '2026-12-07',
    birthdayTargetWib: '2026-12-07T00:00:00+07:00',
    sender: 'From your bf',
    senderSignoff: 'Your BF'
});

export const PERSONAL_MESSAGES = Object.freeze({
    openingBadge: 'A LITTLE SURPRISE MADE JUST FOR YOU',
    openingSubtitle: 'December 07, 2026',
    openingButton: 'OPEN YOUR SURPRISE',
    openingQuietButton: 'Open quietly (without music)',
    countdownWaiting: 'Something special is waiting for you, Euodia.',
    countdownCelebration: 'HAPPY BIRTHDAY, EUODIA!',

    invitationHeading: 'A Special Invitation',
    invitationNote: 'To my dearest Euodia,\nStep inside the room, flip the switch, and make a wish.',

    cardTitle: 'Happy Birthday, Euodia',
    cardGreeting: 'Happy 20th Birthday to the most special person in my life.',

    letterSectionHeading: 'FOR YOU, EUODIA',
    letterTitle: 'A Letter For You',
    letterBody: `Happy Birthday, Euodia.

Today is all about celebrating you. I hope this new chapter of your life brings you happiness, beautiful opportunities, strength, and countless reasons to smile.

Thank you for being the wonderful person you are.

I hope this little corner of the internet reminds you how special you are and how much you mean to me.

You deserve all the beautiful things in this world.

With love,

Your BF.`,

    galleryHeading: 'A LITTLE GALLERY OF YOU',
    gallerySubtitle: 'Ten little frames, a thousand reasons to smile.',

    finaleHeading: 'HAPPY BIRTHDAY, EUODIA.',
    finaleWish: 'May your days always be as beautiful as your heart.',
    finaleSign: 'With love, from your bf.',
    replayButton: 'EXPERIENCE IT AGAIN'
});

/**
 * Three.js 3D Cake & Room configuration matching Euodia's aesthetic:
 * Soft blush pink frosting, warm ivory layers, champagne gold plate, glowing candles,
 * fresh strawberries, custom "Happy Birthday Euodia" topper, Bangkok party room backdrop.
 */
export const PERSONAL_CARD_CONFIG = Object.freeze({
    recipientName: RECIPIENT_INFO.shortName,
    sender: RECIPIENT_INFO.sender,
    bdate: RECIPIENT_INFO.birthdayIso,
    title: PERSONAL_MESSAGES.cardTitle,
    message: PERSONAL_MESSAGES.cardGreeting,

    // Visual Palette & Lighting
    theme: 'neon-rose',
    preset: 'pink-dream',
    font: 'playfair',
    backdrop: 'party', // 3D surprise room
    music: 'happy-birthday-lofi',

    // Cake Design
    cakeModel: 'classic-tiered',
    plate: 'golden',
    plateColor: '#e0ad35', // champagne gold
    glaze: 'strawberry',
    glazeColor: '#ffccd5', // soft blush pink frosting
    creamColor: '#fff9f2', // warm ivory sponge & cream
    candleColor: '#f7cad0', // rose gold / champagne candle pillars
    candles: 5,
    strawberries: 6,
    cherries: 0,
    rolls: 2,
    sprinkles: true,
    decorHearts: true,
    decorStars: true,

    // Elegant Cake Topper
    topper: 'custom',
    topperText: 'Happy Birthday Euodia',
    topperColor: '#d4af37', // metallic champagne gold

    // Romantic Envelope & Secret Letter
    letterEnabled: true,
    letterTheme: 'romance',
    letterTitle: PERSONAL_MESSAGES.letterTitle,
    letterBody: PERSONAL_MESSAGES.letterBody,
    envBaseColor: '#250f24', // midnight plum
    envFlapColor: '#3c1437', // rich plum rose
    envSealColor: '#d4af37', // wax seal champagne gold
    photo: ''
});
