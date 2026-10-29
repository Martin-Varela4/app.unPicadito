# Copilot instructions for app.unPicadito

## Project overview

This repository is a React + Vite front-end for managing recreational matches and sports rooms. The app is organized around feature modules under `src/features`, each owning the pages, components, services, hooks, schemas, and store related to a single domain.

The main app shell is intentionally small:
- `src/App.jsx` wraps the app in `BrowserRouter`.
- `src/routes/AppRoutes.jsx` defines the authenticated and public route groups and the fallback redirect.
- `src/api/axiosInstance.js` is the shared Axios client; all API calls should flow through it.
- Authentication state is persisted through `src/features/auth/store/useAuthStore.js` using Zustand + localStorage.
- Form validation is centralized via Yup schemas under each feature's `schemas/` directory.

## Commands

Use the project scripts from the repository root:

```bash
npm install
npm run dev
npm run build
npm run lint
```

Important notes:
- There is no `test` script in `package.json`, so there is currently no automated test runner configured for this repo.
- If you need to validate a single file, use the linter directly for that file, for example:

```bash
npx eslint src/features/auth/pages/AuthPage.jsx
```

- The repo currently has ESLint issues in files such as `src/api/axiosInstance.js`, `src/components/ConfirmModal.jsx`, and `src/components/Navbar.jsx`; when working on those files, fix the existing lint errors in the same patch if they are directly related to your change.

## Architecture

The codebase follows a feature-first layout:

- `src/components/`: reusable UI primitives shared across the app.
- `src/features/auth/`: login/register flow, route access control, auth forms, schemas, and session store.
- `src/features/matches/`: rooms, joins, filters, match listings, and room detail flow.
- `src/features/friendship/`: friend requests and related services.
- `src/features/players/`: player search and list screens.
- `src/features/profile/`: profile pages and profile-related data.
- `src/routes/`: route guards (`ProtectedRoute`, `PublicRoute`) and route composition.
- `src/api/` and `src/config/`: HTTP client setup and request defaults.

The app uses a consistent pattern for feature work:
- components receive props and keep rendering concerns separate from business logic;
- data fetching is pushed into feature-level hooks/services;
- state is managed with Zustand stores when it needs to be shared across screens;
- forms validate inputs using Yup before submission.

## Key conventions

- Keep feature code colocated. New domain logic should live next to the related page/component instead of being spread across global folders unless it is truly reusable.
- Do not call Axios directly from components. Put the request logic in a feature service and keep the shared HTTP behavior in `src/api/axiosInstance.js`.
- Prefer route-level guards for auth state instead of ad hoc checks in individual components.
- Preserve existing naming patterns: route labels and user-facing text are mostly in Spanish, and the app mixes Spanish and English naming across modules.
- Use environment-based configuration for backend URLs and endpoint overrides (`VITE_API_URL`, `VITE_AUTH_LOGIN_ENDPOINT`, `VITE_AUTH_REGISTER_ENDPOINT`).
- The auth interceptor in `src/api/axiosInstance.js` reads the token from `useAuthStore.getState()` and adds the Authorization header automatically; do not duplicate this logic elsewhere.
- Search/filter behavior belongs in feature hooks such as `useMatches`; keep visual components focused on rendering and user interaction.
- When handling request errors, normalize them into a clear user-facing message at the API/hook boundary rather than surfacing raw server payloads.

## Working style within this repo

- The repo is a small front-end app with mostly feature-local logic; keep patches targeted rather than introducing new global abstractions unless the code already follows that pattern.
- When a change touches a feature, keep related files together (page + hook + service + schema/store) so the module remains understandable in one pass.
- Follow the established route structure and naming patterns already in use (`/login`, `/registro`, `/partidos`, `/players`, `/profile`, `/salas/:id`).
- Use the existing app patterns and styling conventions instead of introducing a new framework or state-management pattern.
