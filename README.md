# Paddock Pulse V1.16.0 — Live Integration

## Baseline check
- Public site URL was checked first, but the browsing tool could not directly fetch GitHub Pages.
- GitHub `main` was then checked and is the source baseline.
- Current repo UI is V1.15.0 (Dashboard & UX Refresh).
- Current latest commit observed: `217effbfb23d32bfc14677f142f52505256686eb`.
- GitHub connector is read-only (`push:false`), so this package is for manual upload.
- No workflow/status check was attached to that commit; GitHub Pages appears to be branch/static deployment rather than a visible PR workflow from the available connector.

## V1.16.0
Adds Paddock Pulse Live to the production PWA without replacing existing pages.

### Navigation
Bottom dock becomes:
- 首頁
- 賽程
- 賽果
- Live
- 排名
- 我的

The existing `go(page)` function continues to control page visibility and active nav state.

### Live view
- Adds a new `#live.view`.
- Loads the already-tested Paddock Pulse Live app from:
  `https://paddock-pulse-live.onrender.com/`
- Live iframe is lazy: it only starts when the user opens Live.
- Leaving Live stops the iframe so the relay does not keep polling in the background.
- Returning to Live reconnects.
- Includes “重新連線” and “獨立開啟” controls.

### Stability
- Does not modify core `index.html`.
- Does not replace Home / Schedule / Results / Standings / Favorites.
- Does not duplicate the Live timing engine inside production.
- Keeps Paddock Pulse Live as the single tested live-timing implementation.
- Existing localStorage data and favorites are untouched.
- Six-item glass dock geometry is adjusted only by the additive integration layer.

## Files
Upload/overwrite:
- `sw.js`

Add:
- `live-integration.js`

README in this ZIP is documentation only; uploading it is optional.
