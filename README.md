# VARVI · Casa de vinuri Maria

Brand presentation website for **VARVI**, a small Transylvanian wine house in Cricău, Alba, Romania. A long-scroll homepage plus a contact/order-by-email page. Ordering is by telephone or email only; there is no e-commerce by design.

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
stockists.html        where to find VARVI (partners and stockists)
assets/css/styles.css design system + all styles (mobile-first)
assets/js/i18n.js     localization engine (RO default, EN offered)
assets/js/main.js     age gate, menu, reveals, modals, contact wiring
assets/images/        brand / campaign / documentary imagery
i18n/ro.json, en.json translation dictionaries
```

## Pre-launch coming soon curtain

While the site is being built, every page shows a full-screen "coming soon" curtain (with the order telephone number) instead of the site. The owner unlocks it via the small **Admin** button in the bottom corner (password `22446688`, stored in plain sight by design; it only guards work in progress). The unlock persists per browser in `localStorage` (`varvi_admin_ok`).

To go live, remove: the `.coming-soon` block from all three HTML pages, the `varvi_admin_ok` reads in their inline head scripts, the "Coming soon curtain" sections in `assets/js/main.js` (plus its `siteLocked` guards and the `data-cs-phone` wiring), and the curtain styles in `assets/css/styles.css`.

## Localization

Romanian is the default; English and German are available (`i18n/ro.json`, `en.json`, `de.json`). Every translatable element carries a `data-i18n` key. First-time visitors whose browser prefers another supported language get a one-time prompt, in that language, offering a switch; any choice persists in `localStorage` (`varvi_lang`). The German and Romanian copy should be reviewed by native speakers.

## Content still to be supplied

- `PHONE` and `EMAIL` constants at the top of `assets/js/main.js` (single source of truth; placeholders shown until set)
- Landscape photograph for "The Place"
- Award certificate scans (lightbox)
- Stockists and Instagram links
- **Formspree**: the future contact form's insertion point is marked with a comment in `contact.html`. Add the `action="https://formspree.io/f/{form-id}"` form there when configured.

## GitHub Pages

All paths are relative, so the site works both at a user/organization root and under a repository subpath. The custom domain is **varvi.ro** (`CNAME` file in the root; DNS is managed on Cloudflare pointing at GitHub Pages' A records, with `www` as a CNAME to `sighencea.github.io`). The `og:image`, `og:url` and canonical URLs are absolute on that domain.
