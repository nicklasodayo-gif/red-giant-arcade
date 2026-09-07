<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5c3f3ab4-9120-4f7d-a061-0052f67eae38

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Open Admin Dashboard (dev)

To open the app directly in the Admin dashboard while running the dev server, use a URL flag:

- Open admin mode: `http://localhost:3000/?mode=admin`
- Open admin mode and jump to a tab (e.g. campaigns): `http://localhost:3000/?mode=admin&tab=campaigns`

Available `tab` values: `dashboard`, `campaigns`, `themes`, `games`, `kiosks`, `leads`, `rewards`, `leaderboards`, `analytics`, `sync`, `settings`.

## Development commands

- Install dependencies: `npm install`
- Run full dev server (Express + Vite): `npm run dev`
- Run frontend only (Vite): `npm run dev:client`
- Build production: `npm run build`
- Start production server: `npm start`
- Clean build artifacts: `npm run clean`
- Fix audit issues (may modify package-lock): `npm audit fix`

Note: Node.js >= 18 is recommended (see `engines` in `package.json`).
