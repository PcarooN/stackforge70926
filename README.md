# StackForge — roadmap-aligned website

This update develops the website in the supplied project. It is a pre-launch frontend, not the completed StackForge SaaS or game compiler.

## Run

Use Node.js 22.18+ (or Node 24).

```bash
npm ci
npm run dev
```

Open http://localhost:3000. For a dependency-free visual preview, open `preview/index.html` directly. That preview is a browser bundle of the landing page, not a replacement for running Next.js.

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## What changed

- `app/page.tsx` is now a server component composing static sections and client islands.
- Interactive code lives in `components/landing/header.tsx`, `builder-preview.tsx` and `early-access.tsx`.
- Shared marketing content lives in `lib/landing-content.ts`; proposed pricing matches the PDF.
- `lib/blueprint.ts` contains three concept templates and deterministic, range-validated JSON blueprint creation.
- The preview supports template selection, parameter changes, Flow/Blueprint switching and a real local JSON download.
- `app/stackforge.css` contains scoped, responsive styles. CSS is no longer embedded in a giant client component.
- The layout uses local system fonts, avoiding Google Fonts requests and build-time font downloads. Metadata no longer implies unreleased compatibility.
- Mobile navigation includes Escape handling and focus restoration. FAQ uses native disclosure elements. Controls include labels, focus styling and reduced-motion handling.
- Unused older components and incomplete Supabase helpers are preserved in `docs/legacy-components.zip`, outside TypeScript compilation. These files referenced undeclared packages and contained contradictory feature promises. They are not active integrations.
- The existing dependency versions and lockfile dependency graph were retained. Test/typecheck scripts and the Node engine requirement were added.

## Roadmap fidelity

FiveM is a likely first game, not a confirmed supported target. Minecraft and Unturned remain future candidates. Desktop/Tauri, mobile companion, Tebex, an internal marketplace and personal agency workflows remain later phases. Monthly prices are proposed at $0/$15/$30/$75 with the PDF's build allowances. No annual discount, team-seat allowance, customer count, security certification or operating payment integration has been invented.

Revision scope, Business unlimited-revision economics, trial resets, export licenses, framework support and cancellation terms need decisions before launch.

## Waitlist setup

Email collection is intentionally OFF. Configure `lib/site-config.ts` only after deploying a real same-origin endpoint and reviewed privacy notice.

Expected request: `POST /api/waitlist`, JSON `{ "email": "user@example.com", "source": "stackforge-landing" }`.
Expected success: a successful HTTP status and JSON `{ "ok": true }`.

The frontend provides consent, native email validation, submission locking, a timeout and error feedback. It does not implement storage, mailing, authentication or server-side consent records. Before enabling it, implement server-side validation, durable storage, idempotent signup, distributed rate limiting, origin checks, retention/deletion and opt-out handling. Do not put service-role or provider secrets in client code.

## Validation actually performed

- 8 blueprint tests passed, including unknown templates, invalid numeric input, valid bounds, stable serialization and edge references.
- All active landing modules successfully transpiled and bundled with React for the local preview.
- Desktop (1440px) and mobile (390px) previews rendered and were visually inspected. No horizontal page overflow or browser exceptions were reported in these captures.
- Local interaction assertions passed for template changes, JSON output, download dispatch, anchor targets, disabled registration, FAQ expansion, mobile menu Escape handling and focus restoration. The download action was intercepted in that test; no game-server deployment was tested.
- Full Next.js build, ESLint and strict project typecheck were NOT completed: the locked dependency installation failed in the sandbox (`npm ci`: exit handler never called). The package-local Next.js guide was consequently unavailable. Run the commands above in your normal development environment before merging/deploying.
- The enabled waitlist branch has not been end-to-end tested against a real backend.

## Still to build

Actual React Flow editor, game adapters, validated code/package generation, authentication, database persistence, tenant isolation, build queues, cost metering, billing and game-server integration tests. Blueprint JSON is illustrative and cannot be installed as a FiveM resource or Minecraft plugin.
