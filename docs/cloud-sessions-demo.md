# Cloud Sessions / Cloud Sandboxes demo guide

This 90-second story turns a small customer request into visible product value: begin work away from the desk, continue the same Copilot session on another surface, and review a working result without rebuilding context or depending on the first device.

## Story anchors

- **One connected session:** Start in Copilot on mobile, then continue that same session in the Copilot app and VS Code. Show the prior prompt and progress after each handoff.
- **Cloud execution, not phone execution:** The task runs in an isolated cloud sandbox. Closing or switching away from the phone does not stop the work.
- **Resume with context:** The session, repository context, and sandbox state remain available when moving between supported Copilot surfaces.
- **Customer value:** Respond sooner, use otherwise-idle time, avoid local setup, and arrive at the desk with reviewable progress instead of a fresh task.

Avoid implying that the phone performs the build, that every local secret is automatically available, or that a sandbox is a permanent deployment environment.

## Presenter setup

1. Use `LadyNaggaga/nova-sales` and begin from the original **Midnight Mona Tour** experience.
2. Keep the same cloud session visible across the mobile, GitHub App, and VS Code handoffs.
3. Preload the deterministic review scenes:
   - `/` — original theater entrance
   - `/?demo=seat-map` — updated seat map with one Floor and one Lower Bowl seat selected
   - `/?demo=confirmation` — successful checkout with persistent pixel confetti
4. Use a 390 x 844 viewport for the mobile captures.
5. Cut execution wait time, but keep enough session history visible to prove continuity.

The demo routes are capture aids only. Without a `demo` query parameter, the normal theater, seat-selection, and simulated-payment behavior is unchanged.

## 90-second run of show

### 1. Customer request arrives on mobile · 0:00-0:14

**Show:** The client email, then the original app with **Midnight Mona Tour** and yellow Floor seats.

**Say:**

> "A customer needs three visible changes before sharing Nova Sales: blue Floor seats, a new tour name, and a bigger checkout celebration. I am away from my desk, but I do not have to wait to make progress."

### 2. Start the cloud session · 0:14-0:33

**Do:** In Copilot on mobile, select the repository and submit:

> Change the yellow Floor seats to blue and update the matching legend and tier color. Preserve distinct selected and sold states.
>
> Rename "Midnight Mona Tour" to "Day Mona Tour" everywhere users see it, including the theater entrance, seat-map heading, reservation ticket, confirmation, and browser title.
>
> Preserve prices, seat selection, simulated checkout, accessibility behavior, and the pixel-art style. Run the relevant build.

**Say:**

> "I start a cloud session from my phone. Copilot works in an isolated cloud sandbox, so the task is not using my phone's compute and is not tied to this screen staying open."

### 3. Continue the same session on desktop · 0:33-0:54

**Do:** Open the same session in the Copilot app. Briefly show the mobile prompt and current progress, then add:

> One more customer update: turn the existing confirmation confetti into a noticeable pixel-art celebration. Trigger it only after successful simulated payment, keep capture output deterministic, and respect reduced-motion preferences.
>
> Add repeatable mobile review routes for the updated seat map and successful confirmation without changing the normal customer flow.

**Say:**

> "At my desk, the same session and context are already here. I add the missed requirement instead of restating the task or recreating the environment."

### 4. Review in VS Code · 0:54-1:08

**Do:** Continue the session in VS Code. Show the diff and make the final visual request:

> Change the confirmation headline to "SEE YOU AT THE SHOW!" and match the checkout buttons to the new blue Floor seats. Keep button states and behavior unchanged.

**Say:**

> "I can move into the editor for a focused review while keeping the session history and cloud work connected."

### 5. Prove the result · 1:08-1:24

**Show:** The updated entrance, `/?demo=seat-map`, then `/?demo=confirmation`.

**Say:**

> "The customer's feedback is now visible: Day Mona Tour, blue seats, and a stronger success moment. Prices, selection states, checkout behavior, and reduced-motion support remain intact."

### 6. Close on value · 1:24-1:30

**Say:**

> "Start anywhere, continue anywhere, and keep the work isolated in the cloud. The result is faster response time and less setup between the customer request and a reviewable change."

## Verification checklist

- The same session is shown at every handoff.
- The original mobile prompt is visible after moving to desktop.
- The normal `/` route still requires the theater and checkout interactions.
- `/?demo=seat-map` opens directly to two selected, visually distinct seats totaling $341.60.
- `/?demo=confirmation` shows the stable `NL-CLOUD-DEMO` order and persistent confetti.
- Reduced-motion mode shows the static **Booking Complete** state without confetti.
- `npm run build` passes before recording.
