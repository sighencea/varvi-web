# VARVI · Casa de vinuri Maria

Brand presentation website for **VARVI**, a small Transylvanian wine house in Cricău, Alba, Romania. A long-scroll homepage, one page per wine (six wines), a contact/order-by-email page, a stockists page and the legal pages. Ordering is by telephone or email only; there is no e-commerce by design.

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
<wine>-<year>.html    one page per wine (six: sauvignon-blanc-2024/2025,
                      feteasca-neagra-2024/2025,
                      feteasca-regala-muscat-ottonel-2024, rose-2024)
contact.html          order-by-email page
stockists.html        where to find VARVI (partners and stockists)
privacy.html, cookies.html, terms.html   legal pages
404.html              branded not-found page
assets/css/styles.css design system + all styles (mobile-first)
assets/js/i18n.js     localization engine (RO default, EN offered)
assets/js/main.js     age gate, menu, reveals, modals, music, contact wiring
assets/fonts/         self-hosted fonts (no request to Google Fonts)
assets/images/        brand / campaign / wine imagery
assets/certificates/  gold-medal diplomas (JPG, thumbnail and PDF per slug)
assets/audio/         background music (Pixabay, royalty-free for commercial use)
i18n/ro.json, en.json translation dictionaries
robots.txt, sitemap.xml
```

## Wine pages

All six wine pages share one template; only the data differs (name, vintage, label colour class `wp--<slug>` on `<body>`, spec rows, diploma slug). A change to the template has to be applied to all six files. Language-dependent values (alcohol, edition, energy, sugar) live in the dictionaries; the Romanian text in the HTML is the no-JS fallback and must match `i18n/ro.json`.

## Localization

Romanian is the default and English is available (`i18n/ro.json`, `en.json`). Every translatable element carries a `data-i18n` key. First-time visitors whose browser prefers a language other than Romanian get a one-time prompt offering English; any choice persists in `localStorage` (`varvi_lang`). `i18n/de.json` is kept for a possible future German site but is not offered anywhere (not in `SUPPORTED` in `assets/js/i18n.js`) and is no longer updated.

## Content still to be supplied

- **Formspree**: the future contact form's insertion point is marked with a comment in `contact.html`. Add the `action="https://formspree.io/f/{form-id}"` form there when configured.

## GitHub Pages

All paths are relative, so the site works both at a user/organization root and under a repository subpath. The custom domain is **varvi.ro** (`CNAME` file in the root; DNS is managed on Cloudflare pointing at GitHub Pages' A records, with `www` as a CNAME to `sighencea.github.io`). The `og:image`, `og:url` and canonical URLs are absolute on that domain.
