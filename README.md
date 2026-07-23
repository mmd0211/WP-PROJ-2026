# WP-PROJ-2026 — Spotune

Spotune is the Phase 1 frontend implementation for the Web Programming course project. It is a Spotify-like music streaming application built as a fully interactive mock frontend with role-based experiences for listeners, artists, support agents, and the system administrator.

> Current status: **Phase 1 — Frontend Mock**. Backend integration with Django/DRF belongs to Phase 2. Mock application state is persisted in the browser with `localStorage`.

## Tech Stack

- React 18
- Vite
- React Router
- Vitest
- LocalStorage mock persistence
- PWA manifest and service worker

## Getting Started

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Run tests:

```bash
npm test
```

## Demo Accounts

All demo accounts use the password `123456`.

| Role | Email |
|---|---|
| Basic listener | `sara@example.com` |
| Silver listener | `mina@example.com` |
| Gold listener | `gold@example.com` |
| Verified artist | `nima@artist.com` |
| Support agent | `support@example.com` |
| System administrator | `admin@example.com` |

## Phase 1 Features

### Authentication and Registration
- Shared login flow for all four roles with role-aware routing.
- Mock password recovery flow.
- Listener registration with display name, email, password confirmation, birth date, gender, and privacy-policy acceptance.
- Dedicated artist registration with stage name, portfolio information, and a pending verification state.
- Artist approval/rejection from the support/admin dashboard with result notifications.

### Home
- User display name and profile image with a default fallback.
- Recently used playlists, newest albums, and popular tracks.
- Gold-only Early Access section.
- Responsive navigation for desktop, tablet, and mobile.

### User and Artist Profiles
- Personal details, system username, profile image, subscription tier, follower/following counts, and daily stream stats.
- Follow/unfollow behavior.
- Editable user profile.
- Basic-tier profile image restriction.
- Artist biography, releases, verified badge, and Gold-only aggregate statistics.

### Settings
- Notification display limit.
- UI sound volume and test tone.
- Subscription overview with dynamic Silver/Gold pricing.
- Mock payment handoff point for Phase 2.
- Account deletion.
- Support ticket submission.
- Demo-state reset.

### Notifications
- Read/unread visual states.
- Mark as read, delete, and mark-all-as-read actions.
- Empty state.
- Role-aware subscription, release, artist-verification, finance, and support-ticket notifications.

### Playlists
- Create, rename, and delete playlists.
- Subscription limits: Basic 6, Silver 100, Gold unlimited.
- Add/remove tracks across playlists.
- Empty state and first-playlist call to action.

### Music Library
- Search by track, album, or artist name.
- Sort by listener count or release date.
- Album and track pages.
- Navigation to artist and album pages.
- Download access for Silver/Gold users.
- Gold-only Early Access releases.

### Music Player
- Local WAV demo audio in `public/audio`.
- Fixed desktop player and expandable mobile mini-player.
- Play, pause, next, previous, and seek controls.
- Volume control.
- Repeat off/all/one.
- Shuffle.
- Queue management.
- Lyrics.
- Artist and album links.
- Gold-only listener/stream statistics.
- Basic-tier 60-stream daily limit in domain logic.

### Artist Studio
- Verified-artist-only publishing and release management.
- MP3/WAV/FLAC file input.
- Cover image, lyrics, genre, release date, collaborators, and Single/Album release type.
- Edit and delete releases.
- Listener, stream, and income statistics.
- Early Access flag.

### Support and Admin Dashboard
- Role-based backoffice access.
- Artist verification requests with approve/reject actions and rejection reasons.
- Support ticket workspace with chat-style replies.
- Monthly artist accounting and settlement state.
- Admin-only settlement confirmation.
- Dynamic Silver/Gold pricing.
- Subscription distribution chart and revenue widgets.

## Testing and Maintainability

- More than the required 10 frontend tests.
- Tests cover subscription policies, role permissions, stream limits, search/sort/repeat behavior, and storage.
- Domain permissions are centralized in `src/utils/permissions.js`.
- Persistence is isolated in `src/services/storage.js`.
- Application state and mock operations are centralized in `src/store/AppContext.jsx`.
- The frontend is structured so Phase 2 can replace mock persistence with Django/DRF APIs without a large UI rewrite.

## PWA

- `public/manifest.webmanifest`
- 192x192 and 512x512 application icons
- `public/service-worker.js`
- Service worker registration for production builds

## Project Structure

```text
WP-PROJ-2026/
├── public/
│   ├── audio/
│   ├── covers/
│   ├── manifest.webmanifest
│   └── service-worker.js
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── tests/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── vite.config.js
```

## Phase 2 Integration Notes

Phase 2 should replace LocalStorage and mock data with Django/DRF API queries and mutations while keeping the UI-facing operation contracts as stable as possible. Authentication/authorization, secure password handling, media uploads, cross-device settings synchronization, payment processing, and aggregated reports must be implemented on the backend.

## Git Workflow

Future changes should be committed in focused commits with descriptive messages so the development history remains easy to review and suitable for team collaboration.
