# Log Pose (Chrome Extension)

Track your **One Piece anime and manga** progress arc by arc, set a target catch-up date, and see how many episodes or chapters you need per week to stay on schedule.

## Project structure

```text
OnePiece-Tracker/
├── backend/          # Extension manifest, service worker, data & logic
│   ├── data/         # Arcs, sagas, color themes
│   ├── lib/          # Progress, storage, episode sync, Firebase
│   └── extension/    # Built output - load this folder in Chrome
├── frontend/         # React side panel UI (Vite)
├── docs/             # Setup guides
└── scripts/          # Build script
```

## Features

- **Anime and manga modes** - Swap between episode tracking and chapter tracking
- **Per-arc progress** - 47 anime arcs with saga tabs and color-coded cards
- **Catch-up planner** - Episodes or chapters per week to hit your target date
- **Auto episode updates** - Checks [Jikan API](https://api.jikan.moe/) daily and extends the latest anime arc
- **Google sign-in & cloud save** - Optional Firebase sync across devices (see [docs/CLOUD_SETUP.md](docs/CLOUD_SETUP.md))
- **Offline-first** - Works locally without an account

## Quick start

```bash
npm install --prefix frontend
npm run build
```

Load `backend/extension` in Chrome (`chrome://extensions` -> Developer mode -> Load unpacked).

## Cloud save (optional)

1. Copy `frontend/.env.example` -> `frontend/.env`
2. Follow [docs/CLOUD_SETUP.md](docs/CLOUD_SETUP.md) for Firebase + Google OAuth
3. Rebuild: `npm run build`

Without `.env`, the extension runs locally only.

## Development

```bash
npm run dev          # Vite preview (localStorage, no extension APIs)
npm run build        # Production extension build
```

After changes, reload the extension on `chrome://extensions`.

## License

MIT
