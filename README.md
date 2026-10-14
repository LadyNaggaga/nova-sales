# Nova & the Lighthouses — Midnight Mona Tour

A pixel-art concert ticket-booking app with simulated payments. It uses Vite and TypeScript with no UI framework or backend.

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
