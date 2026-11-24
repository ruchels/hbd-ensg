<a id="top"></a>

<h1 align="center">🎂 Euodia Natalina Siagian — 20th Birthday 3D Celebration ✨</h1>

<p align="center">
  A dedicated, highly personalized, cinematic, interactive 3D birthday experience crafted with love for <b>Euodia Natalina Siagian</b> by her boyfriend.
</p>

<p align="center">
  <b>Recipient:</b> Euodia Natalina Siagian &nbsp;|&nbsp;
  <b>Milestone:</b> 20 Years Old &nbsp;|&nbsp;
  <b>Birthday:</b> December 7, 2026 (00:00:00 WIB / Asia/Jakarta) &nbsp;|&nbsp;
  <b>Sender:</b> From your bf
</p>

<p align="center">
  <a href="#experience-flow"><b>Experience Flow</b></a> &nbsp;|&nbsp;
  <a href="#adding-photos"><b>Adding All 10 Photos</b></a> &nbsp;|&nbsp;
  <a href="#customization"><b>Personal Customization</b></a> &nbsp;|&nbsp;
  <a href="#development"><b>Local Setup &amp; Build</b></a> &nbsp;|&nbsp;
  <a href="#deployment"><b>Static Deployment</b></a> &nbsp;|&nbsp;
  <a href="LICENSE"><b>License (MIT)</b></a>
</p>

---

## 🌟 The Experience at a Glance

1. **Opening Scene &amp; Live Countdown**
   - Welcomes Euodia by name with a luxury midnight plum, champagne gold, and rose gold visual identity.
   - Dynamic live countdown updating every second to December 7, 2026, 00:00:00 WIB (Asia/Jakarta timezone).
   - Wax-sealed envelope with initial "E".
   - Shimmering **"OPEN YOUR SURPRISE"** button (with optional quiet mode).

2. **The 3D Surprise Room**
   - Euodia enters the dark 3D Bangkok room with city lights glowing through the window.
   - A soft glowing light switch beckons on the wall.
   - When pressed: lights turn on, poppers burst, and celebratory confetti rains down.
   - Her personalized LED neon acrylic sign illuminates: **"EUODIA"**.
   - Cinematic camera glide towards the birthday cake while "Happy Birthday" plays.

3. **Personalized 3D Birthday Cake &amp; Candle Blowing**
   - Elegant two-tier cake with soft blush pink frosting, warm ivory sponge, fresh strawberries, chocolate rolls, sprinkles, and golden cake stand.
   - Gold acrylic cake topper: **"Happy Birthday Euodia"**.
   - Candle blowing with microphone detection (opt-in) or touch-friendly flame tapping fallback.
   - Grand climax: cheer, balloon drop, warm lighting bloom, and celebratory confetti.

4. **Secret Birthday Letter ("FOR YOU, EUODIA")**
   - Unfolds an interactive parchment letter with custom typewriter animation.
   - Heartfelt message from her boyfriend.

5. **Photo Gallery ("A LITTLE GALLERY OF YOU")**
   - Ten romantic Polaroid-style frames titled *"A LITTLE GALLERY OF YOU — Ten little frames, a thousand reasons to smile."*
   - Smooth horizontal swipe on mobile, carousel navigation, and photo counter (e.g. `01 / 10`).
   - Tapping any photo opens a high-resolution, full-screen Lightbox with swipe-to-dismiss and keyboard controls.
   - Graceful SVG placeholders ensure broken image icons are never shown.

6. **Grand Finale &amp; Replay**
   - Celebratory fireworks, floating hearts, and romantic final quote:
     > *"HAPPY BIRTHDAY, EUODIA. May your days always be as beautiful as your heart. With love, from your bf."*
   - **"EXPERIENCE IT AGAIN"** replay button restarts the experience smoothly without refreshing or redirecting to any creator.

---

<a id="adding-photos"></a>

## 📸 Adding All 10 Photographs

All photographs are loaded locally from `public/photos/` without any external server or cloud dependencies, ensuring complete privacy.

### File Naming Convention

Place your 10 photos into `public/photos/` with these exact filenames:

```
public/photos/
├── euodia-01.jpg
├── euodia-02.jpg
├── euodia-03.jpg
├── euodia-04.jpg
├── euodia-05.jpg
├── euodia-06.jpg
├── euodia-07.jpg
├── euodia-08.jpg
├── euodia-09.jpg
└── euodia-10.jpg
```

### Supported Formats &amp; Tips

- Format: Standard `.jpg` or `.jpeg` (RGB color space).
- Recommended orientation: Portrait (aspect ratio `4:5` or `3:4`).
- Recommended resolution: `1080 x 1350 px` or `1200 x 1500 px` for optimal sharpness and fast loading.
- If an image file is missing or has not been added yet, an elegant golden-bordered silhouette card will be displayed automatically—broken-image icons will **never** be shown.

### Editing Captions

To change the caption or description for each photo, open [`src/photo-gallery.js`](src/photo-gallery.js) and update `PHOTOS_DATA`:

```javascript
export const PHOTOS_DATA = [
    {
        id: 1,
        number: '01',
        src: '/photos/euodia-01.jpg',
        alt: 'Euodia Natalina Siagian - Memory 01',
        caption: 'Our first trip together' // <-- Edit your caption here
    },
    // ...
];
```

---

<a id="customization"></a>

## 💌 Personal Customization

All personal content is centralized in [`src/personal-card.js`](src/personal-card.js):

- **Recipient Info:** Full name, nickname, age, target birthday date and timezone.
- **Letter Body:** The heartfelt message displayed inside the unfolding envelope.
- **Cake Aesthetic:** Frosting colors, cake tiers, candle colors, topper text, toppings.

---

<a id="development"></a>

## 🛠️ Local Setup &amp; Build

### Prerequisites

- Node.js 18+ (tested on Node.js 20 &amp; 24)
- npm 9+

### Commands

```bash
# 1. Install dependencies
npm ci

# 2. Start local development server
npm run dev

# 3. Run linter
npm run lint

# 4. Build optimized production bundle
npm run build

# 5. Preview production build locally
npm run preview
```

---

<a id="deployment"></a>

## 🚀 Static Deployment

This project is 100% static (HTML, CSS, JS, WebGL, local assets). It has no backend, no database, and no cookies.

You can deploy the generated `dist/` directory directly to any static host:

- **GitHub Pages:** Set build directory to `dist/` or deploy via GitHub Actions.
- **Cloudflare Pages:** Build command `npm run build`, Output directory `dist`.
- **Netlify:** Build command `npm run build`, Publish directory `dist`.
- **Vercel:** Framework Preset `Vite`, Output directory `dist`.

---

## 📄 License &amp; Credits

- Built upon the open-source [hbd-3d-craft](https://github.com/moo-krub/hbd-3d-craft) 3D engine under the **MIT License**.
- 3D Room Assets, Meshopt decoder, and sound engine preserved and adapted for Euodia.
- Copyright (c) 2026. Made exclusively for Euodia Natalina Siagian.
