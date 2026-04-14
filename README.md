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

All personal details in this template are placeholders. To customise:

1. **Couple & parent names** — edit the `.couple-names` and `.parent-names` in `index.html` (welcome slide)
2. **Photos** — add `assets/images/couple.jpg` and `assets/images/couple-illustration.jpg`, then reference them in `index.html`
3. **Event dates, times, venues** — update each ceremony section in `index.html` (Haldi, Sangeet, Vivaah, Reception, and the summary slide)
4. **Maps links** — replace the `href="#"` on `.maps-link` anchors with your Google Maps URLs
5. **Background music** — drop an MP3 file at `assets/audio/music.mp3`
6. **Meta tags** — update title, description, `og:url`, `og:image` in `index.html`
7. **Colours** — customise CSS variables at the top of `css/styles.css` (`--gold`, `--teal`, etc.)

## Personalised Guest Links

Append `?guest=Name` to the URL to show a personalised greeting on the splash screen:

```
https://your-domain.com?guest=Rahul
https://your-domain.com?guest=Priya
```

## Deployment

This is a static site — deploy anywhere:

- **GitHub Pages** — push to `main`, enable Pages in repo Settings
- **Cloudflare Pages** — connect GitHub repo, leave build command empty
- **Netlify** — drag-and-drop the folder, or connect a repo
- **Vercel** — same as above

All four provide free hosting with HTTPS and custom domain support.

## Browser Support

Tested on all modern browsers (Chrome, Safari, Firefox, Edge). Requires support for CSS `backdrop-filter`, `clamp()`, and ES6.

## License

[MIT](LICENSE) — free to use, modify, and distribute for any wedding.

## Acknowledgements

Built with love and a lot of marigold petals. 🌸

### Audio Attribution

The background music `assets/audio/music.mp3` is **"Raga Tilanga"** (1937) — Ravi Shankar's first recording, now in the **public domain**. Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Raga_Tilanga.ogg).
