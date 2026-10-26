# Nova & the Lighthouses — Day Mona Tour

A pixel-art concert ticket-booking app with simulated payments. It uses Vite and TypeScript with no UI framework or backend.

## Quick overview

- Pick seats from a color-coded arena map: blue Floor ($185), orange Lower Bowl ($120), or green Upper Bowl ($65). Selected seats stay lavender with a heart; sold seats stay dark with an × and cannot be selected.
- Enter through a closed pixel-art theater curtain, reveal the tour teaser and reservation ticket, then proceed into seat selection. The intro includes reversible curtains, cursor-reactive spotlights, pixel dust, and optional synthesized 8-bit sound.
- Add or remove seats and see the ticket count, subtotal, 12% service fee, and total update immediately.
- Complete a simulated checkout to get a ticket-style confirmation with an order ID and purchased seats.
- Successful payment triggers a short, full-screen shower of chunky pixel confetti and a **Booking Complete** badge. Reduced-motion users see the static badge without confetti.
- Book on desktop or mobile, with a sticky mobile checkout bar and a horizontally scrollable seat map.

## UI improvements

- Added a full-screen 16-bit theater entrance before seat selection.
- Built closed and open curtain states with a reversible GSAP animation timeline.
- Added a pixel proscenium frame, crimson curtains, gold trim and tassels, wooden floorboards, corner lamps, moving spotlights, and falling pixel dust.
- Added an event marquee with keyboard **Enter** support and an optional synthesized 8-bit sound toggle.
- Added a revealed tour teaser with an animated pixel band, tour dates, and a seat-reservation ticket.
- Added **Close Curtain** and **Proceed to Seat Map** controls so shoppers can move through or reset the experience.
- Preserved reduced-motion behavior, focus management, responsive layouts, and the existing seat-selection flow.

## Demo flow

### 1. Enter the theater

The experience begins with the curtain closed. Select **Enter the Theater** or press **Enter** to start the show.

![Closed pixel-art theater curtain with the Day Mona Tour marquee](docs/screenshots/tour-curtain-closed.png)

### 2. Reveal the tour

The curtains open to reveal the tour teaser, upcoming dates, and reservation ticket. **Close Curtain** reverses the animation.

![Opened theater curtain revealing tour dates and a seat-reservation ticket](docs/screenshots/tour-curtain-open.png)

### 3. Choose seats

Select **Proceed to Seat Map** to continue into the existing interactive arena and checkout experience.

![Seat-selection page shown after proceeding from the theater introduction](docs/screenshots/seat-map-handoff.png)

## Run locally

```bash
npm install
npm run dev        # open the printed URL
npm run build      # type-check and build for production
npm run preview    # preview the production build
```

## Files

| File | What it holds |
| --- | --- |
| `src/main.ts` | Theater intro, GSAP timeline, app shell, rendering, state, checkout flow and interaction handling |
| `src/data.ts` | Event details, tiers, prices, fee rate and the seat inventory (with the curved-bowl offsets) |
| `src/mascot.ts` | The pixel mascot (drawn from a character map) and the cursor look-at behaviour |
| `src/style.css` | All styles; colours and fonts are custom properties at the top |

## UI assets

New pixel-art UI assets live under `public/` as standalone, optimized SVGs so they can be reused outside of inline TypeScript markup and served directly by Vite at the site root.

| Asset | Path | Used for |
| --- | --- | --- |
| Favicon / app icon | `public/favicon.svg` | Browser tab icon, linked from `index.html` (`<link rel="icon">`); simplified version of the pixel mascot |
| Favorite/star marker | `public/assets/icons/star.svg` | Highlighting a shopper's favorite or recommended seat tier in the seat map |
| Ticket | `public/assets/icons/ticket.svg` | Order-confirmation and receipt-style UI, alongside the existing ticket copy |
| Close / remove | `public/assets/icons/close.svg` | A crisper pixel alternative to the plain `×` glyph used by the cart's remove button (`.btn-x`) |
| Sound on / off | `public/assets/icons/sound-on.svg`, `public/assets/icons/sound-off.svg` | A crisper pixel alternative to the `♫` / `♪` glyphs on the theater intro's sound toggle |

All assets follow the same 1px-per-grid-cell, `shape-rendering="crispEdges"` pixel style as `src/mascot.ts`, and reuse the existing colour custom properties from `src/style.css` (e.g. `--purple`, `--mustard`, `--rust`, `--pink`, `--cyan`) so new icons stay visually consistent. To add a new asset: sketch it on a small character grid, map characters to palette colours, and export it as a flat SVG of 1x1 `<rect>` pixels (see the `rects` helper in `src/mascot.ts` for the pattern used to generate these files).

## Booking tickets

Select available seats, review the subtotal and 12% service fee, then click **Pay**. Checkout displays a processing state for approximately 1.5 seconds before confirming the order. Seat changes and repeated payments are blocked during processing.

The confirmation includes a unique order ID, purchased seats, ticket count, and total. **Buy More** returns to shopping; purchased seats stay sold for the current session.

## Demo limitations

Payments are simulated and always succeed. No card information is collected, no payment provider is contacted, and no real charge occurs. Seat inventory and orders exist only in browser memory and reset when the page is refreshed.

## Screenshots

Captured from the running app with Playwright and Chromium.

### Seat map

Browse the three seating tiers and see which seats are open or already sold.

![Desktop arena seat map with ticket availability and an empty cart](docs/screenshots/seat-map.png)

### Selected tickets

Selecting a Floor seat and a Lower Bowl seat brings the total to $341.60, including the 12% service fee.

![Two selected seats with an itemized cart and payment total](docs/screenshots/selected-tickets.png)

### Order confirmation

After simulated payment, purchased seats are marked sold and the cart becomes a confirmation ticket.

![Ticket-style order confirmation showing purchased seats and the order total](docs/screenshots/order-confirmed.png)

### Mobile booking

The narrow layout stacks the cart below the scrollable seat map and keeps a checkout bar visible.

<img src="docs/screenshots/mobile-booking.png" alt="Mobile booking layout with one selected seat, a sticky checkout bar, and an itemized cart" width="390" />
