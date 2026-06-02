# PPI Wallet Admin

Admin dashboard for the PPI Wallet platform. Read-only inspection of customers, transactions, sub-wallets, analytics, and a PPI load-guard simulator. Designed to live at:

    https://gaurav2sheth.github.io/ppi-wallet-admin/

## Tech

React 19 + TypeScript + Vite 8 + Tailwind v4 + Zustand + React Router v7 (HashRouter) + Recharts.

## Pages

| Route | Purpose |
|---|---|
| `/` | Dashboard: KPIs, live activity, compliance status |
| `/transactions` | All ledger entries, filter by type / range / search |
| `/customers` | Customer list with KYC, state, balance |
| `/customers/:walletId` | Customer detail: KYC, wallet status, full ledger |
| `/sub-wallets` | Food / NCMC / FASTag / Gift / Fuel breakdown |
| `/analytics` | Spend by category (pie), daily trend (bar), top merchants |
| `/load-guard` | Simulate RBI PPI load validation |
| `/settings` | Backend status, environment, links |

## Local development

```
npm install
npm run dev
```

App runs at <http://localhost:5174>. Reads from the Render backend if `VITE_API_URL` is set; otherwise uses seeded mock data so the dashboard is fully interactive offline.

## Environment

| Variable | Default | Notes |
|---|---|---|
| `VITE_API_URL` | _empty_ | Set to `https://ppi-wallet-api.onrender.com` to use live data |
| `VITE_BASE_PATH` | `/` | Set to `/ppi-wallet-admin/` for GitHub Pages |

`.env.production` is already configured for the GitHub Pages deploy path.

## Build & deploy

```
npm run build              # outputs to dist/
npm run preview            # serve the production bundle locally
npm run deploy             # build + push dist to gh-pages branch
```

The included `.github/workflows/deploy.yml` builds and publishes automatically on push to `main` if you'd rather use GitHub Actions.

After the first deploy, enable GitHub Pages in repo settings: **Source = GitHub Actions**.

## Data model

Mirrors the wallet app's types in `src/types/api.types.ts`. All monetary values are `BigInt` paise; use `formatPaise()` / `formatPaiseCompact()` for display.

## Notes on backend endpoints

The wallet app's backend exposes per-wallet endpoints (`/wallet/status/:id`, `/wallet/ledger/:id`, `/kyc/status/:id`). The admin uses these where available and falls back to local seed data for list endpoints (`/admin/customers`, `/admin/transactions`, `/admin/sub-wallets`, `/admin/metrics`) that the backend does not currently document. When you add those endpoints on the Render service, the admin will automatically pick them up — no code change required.
