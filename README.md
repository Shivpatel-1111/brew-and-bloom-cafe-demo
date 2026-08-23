# Brew & Bloom — Specialty Coffee House Website

A modern, editorial static website for a premium specialty coffee shop. Built with plain HTML5, custom CSS3 (design tokens) + Tailwind CSS (via CDN), and vanilla JavaScript ES6+. No build step or backend required — just open in a browser.

## Design direction

- **Palette:** espresso brown, cream, forest green ("bloom"), warm beige, gold foil accent.
- **Type:** Fraunces (display serif) + Manrope (body sans) + JetBrains Mono (prices, labels, origin stamps).
- **Signature motif:** rotated "origin stamp" badges on coffee cards (modeled on single-origin coffee bag labels — origin, altitude, process) and dotted-leader menu rows, like a printed café menu.
- **Motion:** ambient rising steam behind the hero headline, scroll reveals, hover zooms — all respecting `prefers-reduced-motion`.

## Structure

```
brew-and-bloom/
├── index.html      Home — hero, featured coffee, menu teaser, our story, gallery preview,
│                   reviews, opening hours + reservation CTA
├── menu.html       Full interactive menu — 8 category tabs (Espresso, Cappuccino, Latte,
│                   Cold Coffee, Matcha, Sandwiches, Pasta, Desserts), favorite buttons
├── coffee.html     Coffee sourcing story, origin lots, brew methods
├── food.html       Breakfast, Food and Desserts sections
├── gallery.html    Instagram-style photo grid with lightbox (zoom, keyboard nav)
├── contact.html    Find Us (map + hours + open-now indicator), Reservation form, Contact form
├── css/
│   └── styles.css  Design tokens + all custom component styles
├── js/
│   └── main.js     Nav, scroll reveal, menu tabs, favorites, lightbox, hours indicator,
│                   reservation form validation + success state
├── assets/         (reserved for local image assets if you replace the hosted photography)
└── README.md
```

## Features

- Sticky, responsive navigation with animated mobile menu
- Menu category tabs with accessible `role="tab"` semantics
- Favorite/heart toggle on every menu item
- Instagram-style gallery grid with lightbox: click/tap to zoom, arrow keys + on-screen
  prev/next, Escape to close
- **Open Now** indicator computed from the visitor's local browser time against posted hours
  (Mon–Fri 8:00 AM–10:00 PM, Sat–Sun 8:00 AM–11:00 PM)
- Reservation form (name, phone, date, time, guests, message) with native validation,
  a minimum bookable date, and an inline success state
- Scroll-triggered reveal animations (skipped entirely for reduced-motion users)
- Semantic HTML, labelled form fields, visible keyboard focus states, alt text on every image,
  skip-to-content link

## Photography

Images are served from Unsplash's CDN by URL — no local files to manage, and easy to swap:
replace any `<img src="...">` with your own photography in `assets/` and update the path.

## Notes on deployment

This is a fully static site — upload the folder as-is to any static host (Netlify, Vercel,
GitHub Pages, S3, etc.) or open `index.html` directly in a browser. An internet connection is
needed at view-time for Google Fonts, Tailwind CDN, Lucide icons and the hosted photography.
