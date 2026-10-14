# Nova & the Lighthouses — Midnight Mona Tour

A pixel-art concert ticket-booking app with simulated payments. It uses Vite and TypeScript with no UI framework or backend.

## Quick overview

- Pick seats from a color-coded arena map: Floor ($185), Lower Bowl ($120), or Upper Bowl ($65). Sold seats cannot be selected.
- Add or remove seats and see the ticket count, subtotal, 12% service fee, and total update immediately.
- Complete a simulated checkout to get a ticket-style confirmation with an order ID and purchased seats.
- Book on desktop or mobile, with a sticky mobile checkout bar and a horizontally scrollable seat map.

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
| `src/main.ts` | App shell, rendering, state, the checkout flow and click handling |
| `src/data.ts` | Event details, tiers, prices, fee rate and the seat inventory (with the curved-bowl offsets) |
| `src/mascot.ts` | The pixel mascot (drawn from a character map) and the cursor look-at behaviour |
| `src/style.css` | All styles; colours and fonts are custom properties at the top |

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
