# Continuity E2E demo guide

This guide uses Nova Sales to demonstrate one cloud coding session moving between GitHub Mobile, the VS Code Agents Window, the GitHub Copilot app, and GitHub.com.

The app is a safe fixture: payments are simulated, state exists only in browser memory, and no payment provider or production service is contacted.

## Audience promise

> One task, one session, one cloud environment. The client changes; the work does not restart.

## What the `nova-test` branch adds

- A testable payment gateway contract in `src/payment.ts`.
- Deterministic success, transient failure, permanent decline, and offline scenarios.
- Bounded retries that apply only to transient failures.
- Focused Vitest coverage for retries and checkout totals.
- Accessible payment progress and failure announcements.
- A development-only payment scenario panel.
- A repeatable command that seeds the intentional retry defect used in the coding demos.

## 1. Prepare the repository

Check out the demo branch and install dependencies:

```bash
git fetch origin
git switch nova-test
npm install
```

Verify the clean fixture:

```bash
npm test
npm run build
```

Both commands must pass before creating a demo run branch.

## 2. Preview the payment scenarios

Start the app:

```bash
npm run dev
```

Open the URL printed by Vite and add one of these query strings:

| URL parameters | Behavior |
| --- | --- |
| `?demo=true&payment=success` | Payment succeeds on the first attempt |
| `?demo=true&payment=transient` | Two transient failures, then success |
| `?demo=true&payment=declined` | Permanent decline with no retry |
| `?demo=true&payment=offline` | Three transient attempts, then failure |

The demo panel displays the active scenario, attempt count, and number of orders created. Changing its selector reloads the app with a clean in-memory checkout.

For every scenario:

1. Select **Enter the Theater**.
2. Select **Proceed to Seat Map**.
3. Pick one or more seats.
4. Select **Pay**.
5. Observe the attempt and order counters.

The transient scenario must create exactly one order after three attempts. Declined and offline scenarios must preserve the selected seats and create no order.

## 3. Create an isolated demo run

Never run a presentation from `main` or directly from `nova-test`.

```bash
git switch nova-test
git pull --ff-only
git switch -c demo/continuity-YYYYMMDD
```

Record:

- Starting commit SHA: `git rev-parse HEAD`
- Repository and run branch
- Mobile, VS Code, Copilot app, and browser builds
- Signed-in GitHub identity
- Cloud environment and effective permission policy

## 4. Seed the deterministic retry defect

Run:

```bash
npm run demo:seed
npm run test:payment
```

The focused test command must fail only the transient recovery test. The fixture deliberately:

- Ends the retry loop one attempt too early.
- Retries every `PaymentError` without distinguishing transient and permanent failures.
- Temporarily skips the permanent-decline and retry-exhaustion regression tests.

Commit the seeded state on the isolated run branch:

```bash
git add src/payment.ts src/payment.test.ts
git commit -m "Seed deterministic payment retry regression"
git push -u origin HEAD
```

Do not open a pull request for the seeded defect.

To reset a local rehearsal:

```bash
git restore src/payment.ts src/payment.test.ts
```

## Demo 1: Start anywhere, finish at your desk

**Route:** GitHub Mobile → VS Code Agents Window → GitHub.com  
**Target duration:** Six minutes

### Mobile: start the investigation

Open the seeded run branch and create a cloud coding session.

```text
Investigate the failing transient payment test in src/payment.test.ts.

Run npm run test:payment, identify the root cause in src/payment.ts,
and implement a focused fix that preserves the existing payment API.

Run the focused tests after the change. Do not create a pull request.
```

Show the repository, branch, cloud environment, and initial failing output.

### VS Code: add the missing safety rule

Discover the same session from the Agents Window without pasting a link. Confirm that opening it creates no new turn or duplicate session.

```text
Add regression coverage proving that a permanent payment decline is not
retried and that transient failures stop after the configured limit.

Keep the transient recovery coverage. Run npm run test:payment and
npm run build, then report the exact results. Do not create a pull
request yet.
```

Show the focused diff and actual command output.

### GitHub.com: deliver the result

Discover the same session without a pasted link.

```text
Create a draft pull request against main.

Summarize the transient payment retry fix, permanent-decline protection,
retry exhaustion coverage, and exact validation results. Do not merge it.
```

Open the draft PR and verify its branches, changed files, tests, and lack of unrelated changes.

### Closing line

> I started when the problem found me, used the editor when I needed the code, and finished on GitHub where collaboration happens. I changed clients, not sessions.

## Demo 2: Close the laptop, not the work

**Route:** VS Code Agents Window → GitHub Copilot app → GitHub Mobile

Start from a run branch where the payment implementation and tests are complete.

### VS Code: request gated validation

```text
Review the payment retry implementation and focused tests.

Prepare to run npm run test:payment and npm run build, but ask for my
approval before executing either command. Do not change files or create
a pull request.
```

Wait for the approval request, then close the laptop.

### Copilot app: approve cloud execution

Discover the same session and approve the commands once.

```text
Summarize the validated payment scenarios, including attempt counts,
retry limits, permanent-decline behavior, and duplicate-order protection.
Do not change files.
```

Show the actual test and build output.

### Mobile: receive the result

Open the completion notification. If notification delivery is not deterministic, discover the session from Recents and do not claim notification continuity.

Confirm that Mobile shows the VS Code request, app approval, command output, and completion state.

### Closing line

> I closed a client, not the session. Execution remained in the cloud, and I stayed in control from another device.

## Demo 3: Review feedback becomes a verified fix

**Route:** GitHub.com → VS Code Agents Window → GitHub Copilot app → GitHub.com

Prepare a draft PR that changes checkout-total behavior and contains this review comment:

> Please confirm whether the service fee should be rounded once after aggregation or per ticket. Document the chosen rule and add mixed-tier regression coverage.

### GitHub.com: start from review context

```text
Address the service-fee rounding review feedback.

Inspect src/totals.ts and src/totals.test.ts, document the intended
aggregate-rounding rule, and add focused mixed-tier regression coverage.
Do not resolve the review thread or merge the pull request.
```

### VS Code: inspect and validate

Discover the same session and review the focused diff.

```text
Run npm run test:totals and npm run build.

Report the exact results and confirm whether any unrelated checkout
behavior changed. Stop before updating the review thread.
```

### Copilot app: prepare the response

```text
Prepare a concise response explaining the rounding rule, the regression
coverage, and the exact validation results. Do not merge the pull request.
```

### GitHub.com: close the review loop

Return to the PR, verify the current diff and checks, and post the prepared response only if inline review replies have passed rehearsal.

### Closing line

> The feedback started on GitHub, implementation moved to the editor, validation was available in the app, and the result returned to the original review.

## Demo 4: Recover without starting over

**Route:** GitHub Copilot app → GitHub Mobile → VS Code Agents Window

Use `?demo=true&payment=declined` to demonstrate the accessible failure state.

### Copilot app: investigate first

```text
Investigate the checkout behavior for a permanent payment decline.

Review how payment failures are announced, whether selected seats are
preserved, and whether another payment can be attempted. Stop before
editing and ask me whether to proceed.
```

### Mobile: authorize the fix

```text
Proceed with the smallest focused accessibility fix and regression
coverage. Preserve selected seats after failure and do not change the
successful payment flow. Do not create a pull request.
```

During a rehearsal, introduce a controlled connectivity interruption after submission. Reconnect and verify that the instruction appears exactly once.

### VS Code: reconcile and validate

Discover the same session and confirm the ordered history contains one Mobile response.

```text
Review the completed accessibility change.

Run npm run test:payment and npm run build. Confirm that a decline is
announced, selected seats remain available, payment can be attempted
again, and no order is created. Report the actual results and every
changed file.
```

### Closing line

> The client changed and the network was interrupted, but the development thread remained intact. I resumed the work instead of reconstructing it.

## Required rehearsal gates

Run every selected demo twice: once with warm clients and once after restarting every client.

| Gate | Required evidence |
| --- | --- |
| Discover | The original session appears without a pasted link and no duplicate is created |
| View | Ordered history, repository, branch, status, and changes agree |
| Open | Opening a session causes no turn, tool call, execution, or approval |
| Continue | Every instruction is accepted exactly once in the original session |
| Approve | Cross-client approval is accepted once and stale controls clear |
| Preserve | Session, environment, repository, branch, and policy remain unchanged |
| Validate | Actual test and build output is visible |
| Deliver | The draft PR contains only the intended changes |
| Recover | Refresh or reconnection does not duplicate or lose a submitted turn |

Mark missing evidence **Blocked / Not assessed**, not passed.

## Live-demo guardrails

- Do not use CLI, Teams, or Slack as presentation surfaces.
- Do not submit overlapping turns unless concurrency was separately proven.
- Do not describe validation as successful before actual output appears.
- Do not create a replacement session if continuity fails.
- Do not splice recordings from different sessions.
- Keep a disclosed recording of one successful run on the named builds.
- Use the same authorized account and explicit session-sync settings everywhere.
- Never use customer data, real payment details, credentials, or production endpoints.
