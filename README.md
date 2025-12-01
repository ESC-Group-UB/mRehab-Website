# mRehab Website & API

mRehab is a full-stack tele-rehabilitation platform that combines a React UI, an Express/TypeScript API, and AWS/Stripe integrations to deliver remote therapy workflows, device ordering, and clinician dashboards.

## Repository layout

| Path | Description |
| --- | --- |
| `mrehab/` | React single-page app that powers marketing pages, onboarding flows, dashboards, and checkout. |
| `server/` | TypeScript Express API that talks to AWS (Cognito, DynamoDB, S3), Redis, Stripe, and email providers. |
| `docker-compose.yaml` | Spins up frontend (NGINX) and backend containers for parity with production. |
| `start.sh` / `start.ps1` | Convenience scripts to install deps and start both stacks locally. |

## Prerequisites

- Node.js 18+ and npm
- AWS account (S3, DynamoDB, Cognito, SES or Brevo)
- Stripe account with Checkout + webhook secret
- Redis (optional; only required if you enable caching)
- Docker Desktop (optional, for containerized development)

## Environment configuration

Create `.env` files inside both `server/` and `mrehab/`.

### `server/.env`

```
PORT=5000
ACCESSKEYID=...
SECRETACCESSKEY=...
S3BUCKET=latest-logging
COGNITO_USER_POOL_ID=us-east-2_XXXX
COGNITO_CLIENT_ID=...
COGNITO_CLIENT_SECRET=...
COGNITO_POOL_ID=us-east-2:xxxx
AuthorizedUsers=AuthorizedUsersTable
ActivitySessions=ActivitySessionsTable
Orders=OrdersTable
UserSettings=UserSettingsTable
IntentClassifierLogs=IntentClassifierLogsTable
SMTP_USER_NAME=...
SMTP_PASSWORD=...
BREVO_API_KEY=...            # required only if you use BrevoMailer
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
REACT_APP_BACKEND_API_URL=http://localhost:5000/api
```

### `mrehab/.env`

```
REACT_APP_BACKEND_API_URL=http://localhost:5000/api
REACT_APP_API_URL=http://localhost:3000
```

> ⚠️ Never commit secrets. Use a secrets manager (AWS Secrets Manager, Doppler, 1Password, etc.) for production values.

## Local development

1. **Install dependencies**
   ```bash
   cd /Users/kritarthdandapat/code/mRehab-Website/server && npm install
   cd /Users/kritarthdandapat/code/mRehab-Website/mrehab && npm install
   ```
2. **Start the backend**
   ```bash
   cd /Users/kritarthdandapat/code/mRehab-Website/server
   npm run dev
   ```
3. **Start the frontend**
   ```bash
   cd /Users/kritarthdandapat/code/mRehab-Website/mrehab
   npm start
   ```
4. Visit `http://localhost:3000`. API requests proxy to `http://localhost:5000`.

> Prefer `start.sh` (macOS/Linux) or `start.ps1` (Windows) if you want a single command that installs dependencies and launches both processes. Update the scripts if you customize npm commands (e.g., `npm start` vs `npm run dev`).

## Docker workflow

```
docker compose up --build
```

This builds the backend image via `server/Dockerfile` and the frontend via `mrehab/Dockerfile`, wiring env files automatically. The frontend is served by NGINX on `http://localhost:3000`, while the backend listens on `http://localhost:5000`.

## Key backend capabilities

- **Auth & user provisioning**: Cognito-hosted flows plus DynamoDB tables (`AuthorizedUsers`, `UserSettings`, etc.) with helpers in `server/AWS`.
- **CSV ingestion & logging**: `POST /api/uploadCsv` stores files in S3 under `latest-logging/<email>/timestamp-file.csv`.
- **Session uploads**: `POST /api/uploadSession` accepts JSON payloads for therapy sessions and mirrors them to DynamoDB/S3.
- **Orders & Stripe checkout**: `POST /api/stripe/create-checkout-session` launches Checkout; `POST /api/stripeWebhook/webhook` validates signatures, persists orders, and sends confirmation emails.
- **AI utilities**: `server/routes/AI.ts` surfaces in-progress ML endpoints backed by `AWS/AIFunctions.ts`.
- **Email notifications**: `utilities/mailer.ts` (SES) and `utilities/BrevoMailer.ts` (Brevo) power transactional mail.

All routes are mounted under `/api` inside `server/index.ts`. Use the built-in `/api/hello` health check to confirm connectivity.

## Frontend highlights

- Marketing/landing flows under `src/app/pages/landing.tsx`, `HowItWorks.tsx`, etc.
- Patient/provider dashboards located in `src/app/pages/dashboard.tsx` with UI primitives under `src/components/DashBoard`.
- Auth forms in `src/components/auth/` call the backend URL defined via `REACT_APP_BACKEND_API_URL`.
- Stripe purchase experiences live under `src/app/pages/buyNow*` and `src/components/BuyNow`.

The app is bootstrapped with `create-react-app` (`react-scripts`), so standard CRA tooling (`npm start`, `npm run build`, `npm test`) applies.

## Testing & quality

- **Frontend**: `npm test` (Jest + React Testing Library). Add suites under `mrehab/src` alongside components.
- **Backend**: Add Jest/Vitest or integration tests (none are provided yet). For quick checks you can leverage `ts-node` to run scripts under `server/scripts/`.
- **Linting/formatting**: Align with your editor defaults; no opinionated formatter is enforced yet.

## Operational notes

- Webhooks require the raw body middleware configured in `server/routes/stripeWebhooks.ts`. When developing locally, use `stripe listen --forward-to localhost:5000/api/stripeWebhook/webhook`.
- Redis is optional; if `REDIS_URL` is omitted the server falls back to local defaults.
- Media assets for marketing pages live in `mrehab/public`. Keep file sizes small to ensure acceptable bundle sizes.

## Need help?

Open an issue with detailed repro steps or reach out to the mRehab engineering team. Include Node version, OS, and any relevant logs (API responses, Stripe webhook IDs, AWS request IDs, etc.) to speed up debugging.