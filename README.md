# API Manager

Frontend MVP for managing API contracts, validating contract compatibility, and reviewing breaking changes in a developer-focused dashboard.

The app is currently a React mock MVP: data, authentication, validation runs, diffs, and Slack configuration are simulated in the browser so the product flow can be reviewed without a backend.

## Features

- Mock sign-in and protected application routes
- Dashboard with contract status, recent violations, and activity log
- Contracts list with search, filters, and validation actions
- Contract details with schema preview, validation history, consumers, and Slack webhook configuration
- Diff viewer for breaking and non-breaking schema changes
- New contract registration wizard
- Settings page for workspace, validation, notification, and security preferences
- Dark, dense technical UI based on the provided prototypes

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Vitest and Testing Library

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

By default, Vite serves the app at:

```text
http://localhost:5173/
```

## Scripts

```bash
npm run dev
```

Runs the Vite development server.

```bash
npm run build
```

Type-checks and builds the production bundle into `dist/`.

```bash
npm run lint
```

Runs ESLint across the project.

```bash
npm test
```

Runs the test suite once.

```bash
npm run test:watch
```

Runs Vitest in watch mode.

## Local Network Preview

To open the app from another device on the same network, build and preview it on all network interfaces:

```bash
npm run build
npm exec vite -- preview --host 0.0.0.0 --port 4173
```

Then open the reported `Network` URL from the other device, for example:

```text
http://192.168.x.x:4173/
```

If the page does not load, confirm both devices are on the same network and allow incoming connections for Node/npm in the macOS firewall.

## Project Structure

```text
src/
  components/
    layout/          App shell and route guards
    ui/              Shared UI primitives
  features/
    auth/            Mock login screen
    contracts/       Contract list and details
    dashboard/       Overview dashboard
    diff-viewer/     Schema diff experience
    registration/    New contract wizard
    settings/        App settings
  services/          Mock API and data
  store/             App state provider
  types/             Domain models
```

## Current Scope

This branch does not include a real backend. The following are mocked:

- User authentication
- Contract persistence
- Endpoint validation
- Diff generation
- Slack webhook delivery

The mock service layer is intentionally isolated under `src/services/` so it can be replaced by real API calls later.
