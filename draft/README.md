# Handoff: VARVI Wine House Website

## Overview
Brand presentation website for **VARVI**, a small Transylvanian wine house (producer: **Casa de vinuri Maria**, Cricău, Alba, Romania). One long-scroll homepage telling the brand story (heritage, place, limited production, awards), plus a dedicated contact/order page. Ordering is by telephone or email only — there is **no e-commerce/checkout** by design. Bilingual: Romanian (default) and English.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs in the target codebase's environment**. The original brief specified **Next.js + TypeScript + React + Tailwind CSS**; if no environment exists yet, that stack is the recommended choice. Use `next/image`, locale dictionaries under `/content/locales`, and wine data in `/content/wines.ts` per the structure below.

The design files are "Design Components" (`.dc.html`): the markup sits inside an `<x-dc>` tag with inline styles and `{{ hole }}` placeholders; the logic is a React-like class in the `<script data-dc-script>` tag at the bottom of each file (locale dictionaries, wine data, handlers). Everything needed to reimplement is readable in those two files.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy and interactions are final design intent. Recreate pixel-perfectly. Exceptions: photography marked as placeholder (drop-zones), and data marked `[ ... to be supplied ]` (telephone, email, social links) — these are intentional placeholders, never invent values for them.

## Content rules (critical)
- **Never invent facts.** Only verified data is used: Fetească Neagră 2024, "Ediție limitată 1200 sticle"; awards Gold (Sauvignon Blanc), Gold (Rosé), Bronze (Fetească Regală & Muscat Ottonel), "Awarded in Alba". Vintages/quantities for other wines are deliberately absent.
- Telephone and email are **empty constants** (`PHONE`, `EMAIL`) — single source of truth. When empty: placeholder `+40 ··· ··· ···` / `··· @ ···` is shown, tel/mailto links stay inert, and the call CTA opens a "coming soon" popup instead.
- Romanian is the native brand language and the **default locale**; the visitor's choice persists (`localStorage: varvi_lang`). Age-gate confirmation persists (`varvi_age_ok`).

## Screens / Views

### 1. Homepage (`VARVI Home.dc.html`) — section order
1. **Age gate** (optional, off by default; a boolean flag): fullscreen ivory overlay, crest logo (210px), VARVI wordmark, confirmation text, dark "Enter" button + underlined "Leave" text button.
2. **Fixed header**: transparent over hero; after 60px scroll a dark translucent bar fades in (`rgba(22,23,22,.9)` + 8px backdrop blur, 0.6s opacity transition). Left: VARVI wordmark (21px serif, letter-spacing .34em). Center nav: Wines / Our Place / The House / Awards / **Order Wine** (gold `#c8b083`) / Contact — 10.5px Manrope uppercase, letter-spacing .22em. Right: RO / EN toggle, active language in gold `#A98A50`. Note: no mobile hamburger built yet — implement one.
3. **Hero**: 100svh, photo `assets/hero.png` full-bleed (object-fit cover) with vertical dark gradient scrim. Left-aligned content in 1440px container: `VARVI` h1 (clamp 64–160px, serif 500, ls .14em), "WINE SHAPED BY PLACE" (Manrope, ls .3em, uppercase), 56×1px rule, italic "From our vineyard to your table." (serif italic, clamp 20–27px), then two buttons: filled gold `#A98A50` "Discover our wines" → #wines, outlined "Order wine" → #order (11px Manrope uppercase, ls .26em, padding 18px 40px). Bottom-center micro-line "CRICĂU · ALBA · ROMANIA" (9.5px, ls .4em).
4. **Crest intro**: ivory `#F2EFE7`, huge vertical padding (clamp 110–240px), centered: crest logo `assets/crest-logo.png` at min(400px, 80vw) with `mix-blend-mode: multiply`, VARVI (26px, ls .34em), "Casa de vinuri Maria" italic, "CRICĂU · TRANSYLVANIA" eyebrow.
5. **Brand statement** (#house): parchment `#E8E1D4`, 2-col grid (1fr / 4fr): eyebrow "THE HOUSE"; statement "Wine does not begin in the bottle. It begins with a place." (clamp 38–84px serif) + supporting paragraph.
6. **Flagship** (#feteasca): near-black burgundy `#1C1114`, 2-col grid (5fr/4fr). Left: gold eyebrow "LIMITED EDITION", "Fetească Neagră" (clamp 46–96px), meta row "2024 · Ediție limitată · 1,200 bottles" (11px Manrope, gold middots), copy, links "Discover this wine →" + gold "Order by telephone" → #order. Right: bottle image, height clamp(460px,70vh,760px), object-fit cover, subtle scroll parallax (±30px translateY based on element center vs viewport center).
7. **Collection** (#wines): ivory; heading block then a horizontal scroll row (`scroll-snap-type: x proximity`) of 4 panels, each `flex: 0 0 min(380px, 82vw)`, color-coded from the physical labels:
   - Fetească Neagră — bg `#E8E1D4`, text `#161716`, accent `#631D28`, meta "2024 · Edition of 1,200 bottles"
   - Sauvignon Blanc — bg `#18232C`, text `#F2EFE7`, accent `#A98A50`, meta "Gold Medal · Awarded in Alba"
   - Rosé — bg `#631D28`, text `#F2EFE7`, accent `#c8b083`, meta "Gold Medal · Awarded in Alba"
   - Fetească Regală & Muscat Ottonel — bg `#20392E`, text `#F2EFE7`, accent `#c8b083`, meta "Bronze Medal · Awarded in Alba"
   Each panel: bottle image area (36px side padding; the frame adapts its aspect-ratio to the loaded image's natural ratio, default 5/8), category eyebrow, name (30px serif), meta line, "Order wine →" link → #order, and "View award certificate" text button (accent color) opening the certificate lightbox. On mobile, panels stack via the min() width.
8. **The Place** (#place): min-height 92svh, landscape photo drop-zone over `#20392E`, bottom-up dark scrim (`rgba(22,23,22,.78)` → `.32`), bottom-left: eyebrow "THE PLACE", "Transylvania" (clamp 52–120px), "CRICĂU · ALBA", short copy.
9. **Origin**: ivory, centered vertical schematic: ROMANIA → TRANSYLVANIA → ALBA (Manrope uppercase, increasing size/darkness, 1×56px rules between) → 9px gold dot → "CRICĂU" (44px serif, ls .2em) → italic caption.
10. **Limited production**: parchment, grid 3fr/1fr baseline-aligned: "Not made by the million." (clamp 44–100px) + copy; right column right-aligned figure "1,200" (clamp 72–120px, deep wine `#4B1720`… rendered `#631D28`) over "BOTTLES / FETEASCĂ NEAGRĂ · 2024".
11. **Details** ("Details matter."): charcoal `#161716`, centered image `assets/bottles-group.png` (full width, max 1200px container), italic caption below.
12. **Awards** (#awards): navy `#18232C`; gold eyebrow "RECOGNITION", "Awarded for what is inside the bottle." (max 18ch); 3-col auto-fit grid, each entry: gold top border `rgba(169,138,80,.35)`, tier (GOLD/GOLD/BRONZE, gold, ls .4em), wine name (27px serif), "AWARDED IN ALBA", "View award certificate" button → lightbox.
13. **Human scale**: ivory; eyebrow "CASA DE VINURI MARIA", "Made at human scale.", documentary copy; single photo `assets/stall.png` in a contact-print frame (white 16px padding, soft shadow, −0.8° rotation, max-width 880px) with a monospace caption. Documentary imagery is deliberately styled differently from campaign imagery.
14. **Motto**: parchment; crest logo 190px (multiply), "AUT VINCERE AUT MORI" (clamp 26–52px, ls .4em), eyebrow "THE VARVI CREST".
15. **Order** (#order): deep wine `#4B1720`, centered, max 680px: eyebrow "WINE ORDERS", "Order VARVI Wine", italic "From our vineyard to your table.", copy, large phone number (clamp 34–52px serif, tel: link), buttons: ivory-filled "CALL TO PLACE AN ORDER" (tel: or coming-soon popup) + outlined "ORDER BY EMAIL" → contact page, gold micro-line "DIRECT FROM VARVI. PERSONALLY ARRANGED.", monospace placeholder note.
16. **Contact** (#contact): ivory, centered: "Discover VARVI", address lines, three underlined uppercase links (Contact the wine house / Find VARVI / Instagram — all placeholders), monospace placeholder note.
17. **Footer**: charcoal; brand block (wordmark, italic producer, address line), nav column (incl. Order Wine), column with RO/EN + Privacy/Cookies/Terms; bottom rule row as 3-col grid: "© VARVI / CASA DE VINURI MARIA" left, "AUT VINCERE AUT MORI" centered, right: "Built to last by <u>Sighencea</u>" linking https://www.sighencea.com (new tab).

### 2. Contact / Order-by-email page (`VARVI Contact.dc.html`)
Fixed ivory header (VARVI wordmark ← back link). Centered single screen: crest logo 170px (multiply), eyebrow "CONTACT", "Order by email" (clamp 42–84px), copy, large email line (mailto with pre-filled localized subject "Wine order, VARVI" and an order-template body: wines and quantity, name, delivery address, telephone), two-column grid: Telephone (tel: link) and Wine house address. Monospace placeholder note; slim bordered footer. Reads the same `varvi_lang` locale key.

## Interactions & Behavior
- **Language switch (RO/EN)**: swaps every string from locale dictionaries; RO default; persisted; sets `<html lang>`. All strings live in the `I18N` objects inside both `.dc.html` files — port them verbatim to locale files.
- **Header**: dark bar fades in past 60px scroll.
- **Scroll reveals**: sections marked `data-reveal` start `opacity 0 / translateY(26px)` and animate in via IntersectionObserver (threshold .12, ~1.1s cubic-bezier(.22,.61,.36,1)); includes a scroll-position fallback and a 4s reveal-all safety net so content can never stay hidden. Disabled entirely under `prefers-reduced-motion`.
- **Flagship parallax**: ±30px translateY on the bottle frame, disabled under reduced motion.
- **Certificate lightbox**: in-page modal (never `window.open`, so popup blockers are irrelevant): dark overlay `rgba(22,23,22,.88)`, ivory frame with the certificate image per wine, wine name + Close below; closes on backdrop click, Close, or Escape.
- **Call CTA**: `tel:` when the number exists; otherwise an in-page popup (crest, "Telephone ordering is coming soon", email suggestion, Close).
- **Age gate**: feature-flagged overlay; "Enter" persists confirmation, "Leave" navigates back.
- Smooth in-page anchor scrolling (`scroll-behavior: smooth`, off under reduced motion).

## State Management
- `lang: 'ro' | 'en'` (persisted), `gateOk: boolean` (persisted), `lightbox: wineSlug | null`, `phonePopup: boolean`, header-scrolled flag, per-frame image aspect ratios (read from the loaded image's naturalWidth/Height).
- Constants: `PHONE`, `EMAIL` (empty until supplied).

## Design Tokens
Colors: Warm Ivory `#F2EFE7`; Parchment `#E8E1D4`; Charcoal `#161716`; Flagship black-burgundy `#1C1114`; Deep Wine `#4B1720`; Ox Blood `#631D28`; Forest `#20392E`; Midnight Navy `#18232C`; Antique Gold `#A98A50`; Muted Brass `#8E7447`; Light gold (on dark) `#c8b083`; Soft Stone `#B7B0A4`; body-text ink `#4a463e`; muted ink `#5a564d` / `#8a857b`; hairline on ivory `#cfc9bc`.
Gold is an accent only — never bright yellow-gold, no gradients.

Typography: **Cormorant Garamond** (display + body serif; weights 400/500/600 + italics) and **Manrope** (400/500/600) for eyebrows, nav, buttons, micro-labels — always uppercase with generous letter-spacing (.22–.42em). Monospace (ui-monospace/Menlo) only for placeholder/provenance notes. Serif dominates; sizes use `clamp()` throughout (see per-section values above).

Spacing: section padding `clamp(96px, 13vw, 200px)` vertical (hero moments up to 240px); content container max-width 1440px with `clamp(24px, 6vw, 96px)` side padding; 12-col editorial feel with intentional asymmetry.

Motion: 0.4–1.2s, `cubic-bezier(.22,.61,.36,1)`, opacity/translate only. No bounce, no spinning, no scroll-hijack. Full `prefers-reduced-motion` support.

## Assets (in `assets/`)
- `hero.png` — golden-hour vineyard + bottle + glass (hero background)
- `crest-logo.png` — clean crest render on white (use with multiply blend on light bg; replace with SVG when available); crest motto: AUT VINCERE AUT MORI
- `bottles-group.png` — four-bottle campaign shot ("Details matter.")
- `stall.png` — documentary stall photo ("Made at human scale.")
- `crest-macro.png`, `crest-wide.png`, `label-front.png`, `wordmark.png`, `doc-bottle-office.jpeg` — label crops / earlier documentary shot, kept for reference
- Bottle cut-outs per wine and certificate scans are **not yet supplied** — the prototype uses drag-and-drop placeholder slots for them.

## Files
- `VARVI Home.dc.html` — homepage (template + all logic/locales/data at the bottom of the file)
- `VARVI Contact.dc.html` — contact / order-by-email page
- `assets/` — imagery listed above (plus `image-slot.js`, the prototype's drop-zone helper — do not port; replace slots with real `next/image` usage)

## Suggested target structure (from the original brief)
```
/app  /components (layout, navigation, hero, wine, editorial, awards, place, footer)
/content  wines.ts  awards.ts  brand.ts  /locales (ro.ts, en.ts)
/public  /images (/wine /brand /awards /place)
```
Wine content model: slug, name, variety, vintage, category, origin, bottleCount, servingTemperature, alcohol, tastingNotes[], pairing[], awards[], images{bottle,label,detail} — keep unverified fields `null`.
