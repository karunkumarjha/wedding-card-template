# Indian Wedding Invitation Template

A cinematic, single-page digital wedding invitation template with an Indian ethnic theme. Pure HTML, CSS, and vanilla JavaScript — no framework, no build step, no dependencies.

## Demo

Open `index.html` in any modern browser, or deploy to any static host (GitHub Pages, Cloudflare Pages, Netlify, Vercel).

## Features

- **Splash screen** with pulsing concentric rings, couple photo placeholder, and music unlock
- **Cinematic per-slide entry/exit animations** — rise, zoom, sweep, drop, unfurl
- **Rotating SVG mandala** background with dual counter-spinning rings
- **Per-event theme particle bursts** — turmeric dots, music notes, fire sparks, gold stars
- **Staggered card content reveal** as each slide settles
- **Floating petals** in Indian festival colours (saffron, marigold, rose, jasmine)
- **Auto-advance slideshow** with click-to-pause/resume on any screen
- **Background music** auto-starts on splash dismiss and loops continuously
- **Touch/swipe navigation** for mobile (horizontal pan blocked to prevent viewport drift)
- **Keyboard navigation** — arrow keys to navigate, Space/K to pause
- **Personalised guest greeting** via URL query param (`?guest=Name`)
- **Accurate SVG calendar and clock icons** generated at runtime from event data
- **Responsive design** — phones, tablets, desktops, and landscape orientations
- **Accessible** — `aria-label` on all interactive elements and slide sections
- **Open Graph meta tags** for social sharing previews
- **Custom 404 page** matching the site theme

## Slideshow

Each slide displays for ~8.3 seconds before a 3-second cinematic transition. Click anywhere to pause/resume auto-advance.

| Slide | Content | Entry Animation |
|-------|---------|-----------------|
| 1 | Welcome — couple names, parents, photo | Rise from bottom |
| 2 | Haldi (turmeric ceremony) | Zoom in |
| 3 | Sangeet (music & dance evening) | Sweep from right |
| 4 | Vivaah (wedding ceremony) | Sweep from left |
| 5 | Reception | Drop from top |
| 6 | All events summary | Unfurl |

## Project Structure

```
wedding-card-template/
├── index.html                # HTML markup
├── css/
│   └── styles.css            # All styles (variables, animations, responsive)
├── js/
│   └── main.js               # Slideshow, navigation, audio, particles, mandalas
├── assets/
│   ├── audio/                # Add your background music as music.mp3
│   └── images/
│       └── favicon.svg       # Browser tab icon
├── 404.html                  # Custom 404 page
├── robots.txt                # Search engine crawl rules
├── LICENSE                   # MIT License
├── .gitignore
└── README.md
```

## Getting Started

```bash
git clone https://github.com/<your-username>/wedding-card-template.git
cd wedding-card-template
open index.html
```

No build tools, no package managers, no servers required.

## Customising for Your Wedding

All personal details in this template are fictional placeholders (Arjun & Meera, Umaid Bhawan Palace, November 2027). Follow the steps below to make it yours — all edits are in `index.html` unless noted otherwise.

### 1. Fork & clone

```bash
# Fork this repo on GitHub, then:
git clone https://github.com/<your-username>/wedding-card-template.git
cd wedding-card-template
open index.html   # preview locally
```

### 2. Update the welcome slide

In `index.html`, find the `SCREEN 0 — WELCOME` section:

- Replace `Arjun` and `Meera` inside `<span class="couple-names shimmer-text">` with your names
- Replace the parent names inside `<div class="parent-names">` (groom's parents first, then bride's)
- Update `<p class="welcome-dates">` with your wedding dates
- Update `<p class="welcome-venue">` with your city (e.g., `JAIPUR`, `JODHPUR`, `MUMBAI`)

### 3. Update each ceremony slide (Haldi, Sangeet, Vivaah, Reception)

Each ceremony section has three fields to update:

- `📅 Date` — `Saturday, 20 November 2027` → your date (keep the `Day, DD Month YYYY` format so the date icon renders correctly)
- `⏰ Time` — `12:00 PM onwards` → your time (keep `HH:MM AM/PM` format)
- `📍 Venue` — update the `href` with your Google Maps link and the visible venue name

> **Tip:** To get a clean Maps link, open Google Maps, search your venue, click **Share → Copy link** — you'll get a `https://maps.app.goo.gl/...` short link that points to the exact location.

Don't forget to update the same details in the `SCREEN 5 — ALL EVENTS` summary slide too.

### 4. Add your photos (optional)

The template uses a 👫 emoji as the couple photo placeholder. To use real photos:

1. Drop your images into `assets/images/` (e.g., `couple.jpg`, `splash.jpg`)
2. In `index.html`, replace the `.photo-placeholder` div with: `<img src="assets/images/couple.jpg" alt="Couple photo" />`
3. For the splash screen couple illustration, edit `#splash-couple` similarly

> **Copyright note:** Don't use Studio Ghibli stills, celebrity photos, or any copyrighted art in a public repo — use your own photos, commissioned illustrations, or royalty-free art from Unsplash/Pexels.

### 5. Replace the background music

The template ships with **Raga Tilanga (1937, Ravi Shankar)** — a public-domain Indian classical track. To use your own:

1. Drop your MP3 at `assets/audio/music.mp3` (overwrite the existing file)
2. Make sure you have the right to use it — prefer public-domain, Creative Commons, or royalty-free sources like:
   - [Wikimedia Commons](https://commons.wikimedia.org/)
   - [Free Music Archive](https://freemusicarchive.org/)
   - [Incompetech](https://incompetech.com/music/royalty-free/)
3. Update the audio attribution at the bottom of this README

### 6. Update meta tags for social sharing

In `index.html` `<head>`, update:

- `<title>` — your names + "Wedding Invitation"
- `<meta name="description">` — a short summary with dates and city
- `<meta property="og:title">` and `<meta property="og:description">` — these show in WhatsApp/LinkedIn previews
- Optionally add `<meta property="og:url">` and `<meta property="og:image">` once deployed

### 7. Guest banner text (optional)

In `js/main.js`, line 45, update the "With love from Arjun & Meera" string to your names.

### 8. Colours & fonts (optional)

CSS variables at the top of `css/styles.css` control the palette — `--gold`, `--teal`, `--cream`, etc. Tweak these to match your wedding theme.

### 9. Deploy

- **Cloudflare Pages** (recommended for privacy — you can keep your repo private): connect the repo, no build command, publish dir = `/`
- **GitHub Pages**: Settings → Pages → Deploy from branch `main`
- **Netlify / Vercel**: drag-and-drop or connect the repo

All four provide free HTTPS and custom domain support.

### 10. Personalised guest links

Share invitations with a named greeting by appending `?guest=Name`:

```
https://your-domain.com/?guest=Rahul
https://your-domain.com/?guest=Priya
```

The splash screen will show "Dear Rahul," above the invitation title.

## Browser Support

Tested on all modern browsers (Chrome, Safari, Firefox, Edge). Requires support for CSS `backdrop-filter`, `clamp()`, and ES6.

## License

[MIT](LICENSE) — free to use, modify, and distribute for any wedding.

## Acknowledgements

Built with love and a lot of marigold petals. 🌸

### Audio Attribution

The background music `assets/audio/music.mp3` is **"Raga Tilanga"** (1937) — Ravi Shankar's first recording, now in the **public domain**. Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Raga_Tilanga.ogg).
