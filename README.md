# VARVI — Casa de vinuri Maria

Brand presentation website for **VARVI**, a small Transylvanian wine house in Cricău, Alba, Romania. A long-scroll homepage plus a contact/order-by-email page. Ordering is by telephone or email only — no e-commerce by design.

## Stack

Pure static site: **HTML5, CSS3, vanilla JavaScript**. No frameworks, no build step, no dependencies. Deployable as-is on GitHub Pages (serve the repository root).

## Preview locally

The i18n dictionaries are fetched over HTTP, so use any static server rather than `file://`:

```
python -m http.server 8000
# or: npx serve .
```

Then open `http://localhost:8000`.

## Structure

```
index.html            homepage
contact.html          order-by-email page
assets/css/styles.css design system + all styles (mobile-first)
assets/js/i18n.js     localization engine (RO default, EN offered)
assets/js/main.js     age gate, menu, reveals, modals, contact wiring
assets/images/        brand / campaign / documentary imagery
i18n/ro.json, en.json translation dictionaries
draft/                design reference (git-ignored, not deployed)
```

## Localization

Romanian is the default. Every translatable element carries a `data-i18n` key resolved against `i18n/*.json`. First-time visitors whose browser prefers English get a one-time prompt offering a switch; any choice persists in `localStorage` (`varvi_lang`).

## Content still to be supplied

- `PHONE` and `EMAIL` constants at the top of `assets/js/main.js` (single source of truth; placeholders shown until set)
- Bottle cut-out photographs (flagship + four collection panels)
- Landscape photograph for "The Place"
- Award certificate scans (lightbox)
- Stockists and Instagram links
- **Formspree**: the future contact form's insertion point is marked with a comment in `contact.html` — add the `action="https://formspree.io/f/{form-id}"` form there when configured.

## GitHub Pages

All paths are relative, so the site works both at a user/organization root and under a repository subpath. No `CNAME` yet — a custom domain will be configured later (also update the `og:image`/canonical URLs then).
