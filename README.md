# CPR Solutions website backup

This repository is the source backup of the current CPR Solutions bilingual landing site. It is a TanStack Start application for the Bogotá-based professional IT services site and preserves the current production implementation, including the dark-mode hero shader palette, Spanish/English locale behavior, responsive/mobile-first UI, Sam assistant boundary, dedicated contact route, theme control, and deployment scripts.

## Included

- React/TanStack Start application source in `src/`
- Public SEO and branding assets in `public/`
- `package.json` and `bun.lock`
- Vite, TypeScript, and runtime configuration
- Server/runtime entry points (`serve.ts`, `vercel-entry.ts`)
- Build and deployment helpers (`build-vercel.sh`, `publish.sh`, `go-live.sh`)
- Project documentation (`SITE.md`, `AI-ASSISTANT-SETUP.md`)
- The current generated route tree snapshot (`src/routeTree.gen.ts`) so this backup reflects the complete current source state

## Intentionally excluded

Secrets and machine-local/generated material are not included: `.env*` files, credentials, API keys, tokens, `node_modules`, build output (`dist/`, `dist-ssr/`, `.vercel/`), local runtime state/logs, caches, coverage, screenshots, videos, traces, and other browser QA artifacts. See `.gitignore` for the complete exclusion list.

## Install and run locally

Requirements: Bun (the project uses `bun.lock`) and Node-compatible tooling.

```bash
bun install
bun run dev
```

The development server defaults to the Vite port configured by the environment. For a production-style local run after building:

```bash
bun run build
bun run start
```

Useful scripts:

- `bun run build` — build the TanStack/Vite application.
- `bun run dev` — start the development server.
- `bun run start` — serve the built/runtime application with `serve.ts`.
- `bun run publish` — invoke the project publish helper where the hosting environment provides it.
- `bun run go-live` — build and deploy the Vercel artifact; this requires the deployment environment described below.

## Runtime configuration (names only; never commit values)

- `OPENAI_API_KEY` — optional server/runtime secret for live Sam responses. If absent, Sam returns the clearly labeled demo fallback.
- `VERCEL_TOKEN` — required only by `go-live.sh` for a Vercel deployment.
- `DATABASE_URL` — optional server-only Neon/Postgres connection string for future database-backed features; no current page flow requires it.

Set these in the hosting provider's secret/environment configuration, not in source control. The site code does not include their values.

## Lead/contact integration status

The full diagnostic contact form is available at `/contact` and is currently an MVP/demo form. It does **not** submit leads to an external system until the stakeholder approves and configures the production route. The planned recipient is `soporteweb@cprsas.com`, but automatic email delivery is not configured in this backup. An approved n8n/CRM webhook or transactional email provider, authentication/secret, consent language, sender identity, and field contract are still required before enabling production submission. No webhook URL, API token, email credential, or other integration secret is present here.

## Language and theme behavior

On first visit, Spanish is selected for Spanish browser locales and defined Spanish-first regions; English is selected for non-Spanish or ambiguous locales, including US and Canada defaults. A manual ES/EN choice is persisted locally and takes precedence across `/` and `/contact`; the document language and Sam instruction follow that choice. The theme switch also persists locally. WebGPU shader effects have graceful fallback styling, and reduced-motion preferences are respected.

## Deployment notes

Review `SITE.md`, `AI-ASSISTANT-SETUP.md`, and the deployment scripts before publishing. The deployment host must provide the required runtime secrets through its secret manager. Do not add `.env` files or credential material to this repository. The current application is an MVP/demo deployment: no HA/SLA is established, and contact submission remains intentionally disabled pending an approved production integration.
