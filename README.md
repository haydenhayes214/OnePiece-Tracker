# One Piece Tracker (Chrome Extension)

Track your **One Piece anime** progress arc by arc, set a target catch-up date, and see how many episodes you need to watch **per week** to stay on schedule.

## Project structure

```
OnePiece-Tracker/
├── backend/          # Extension manifest, service worker, shared data & logic
│   ├── data/         # Arc episode ranges
│   ├── lib/          # Progress, catch-up math, chrome.storage helpers
│   ├── manifest.json
│   └── extension/    # Built output — load this folder in Chrome
├── frontend/         # React side panel UI (Vite)
└── scripts/          # Build script that bundles frontend into the extension
```

## Features

- **Per-arc progress** — Mark episodes watched for each of 47 story arcs (1,164 episodes total as of May 2026).
- **Global episode shortcut** — Set your current episode number to update all arcs at once.
- **Catch-up planner** — Pick a target date; the extension calculates episodes per week (and per day).
- **Local storage** — Progress is saved with `chrome.storage` and persists across browser sessions.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- Google Chrome

### Install & build

```bash
npm install --prefix frontend
npm run build
```

This creates `backend/extension/` with the side panel UI and extension files.

### Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `backend/extension` folder
5. Click the extension icon in the toolbar to open the **side panel** (dock it on the right like Tagit)

### Dev mode (browser preview)

For UI work without reloading the extension each time:

```bash
npm install --prefix frontend
npm run dev
```

Open the Vite URL in a normal browser tab. Progress saves to `localStorage` instead of `chrome.storage` when not running as an extension.

After UI changes, run `npm run build` and click **Reload** on the extension card in Chrome.

## Updating episode counts

When new episodes air, edit `backend/data/arcs.js` — update the `end` field on the latest arc (e.g. Elbaph) and run `npm run build` again.

## License

MIT
