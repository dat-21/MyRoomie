# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Type-check with tsc, then build for production
npm run preview   # Preview production build locally
```

There is no test runner configured. There is no linter configured beyond TypeScript.

## Architecture

**MyRoomie** is a Vietnamese roommate-matching SPA (React 19 + TypeScript + Vite + Tailwind CSS v4).

### Entry point & providers

`src/main.tsx` wraps the app in `<BrowserRouter>` and `<AuthProvider>`. All routing and role-based rendering happens in `src/App.tsx`.

### Authentication & role system

`src/contexts/AuthContext.tsx` provides `useAuth()`. Auth state is persisted to `localStorage` under the key `myroomie_auth`. There is no real backend — login/register are entirely mock. Three roles exist:

- `tenant` — standard user looking for roommates
- `landlord` — property owner managing listings
- `admin` — platform administrator (demo credentials: `admin@myroomie.vn` / `admin123`)

### Role-based routing & layouts

`App.tsx` conditionally renders route trees based on `user.role`:

| Role | Layout | Root page |
|---|---|---|
| `tenant` | `TenantLayout` (Navbar + Footer + ChatPanel) | `LandingPage` |
| `landlord` | `LandlordLayout` (sidebar nav via `LandlordSidebar`) | `LandlordHomePage` |
| `admin` | standalone (no layout) | `AdminPage` |
| unauthenticated | `TenantLayout` | `RoleSelectionPage` |

`TenantLayout` owns the `chatOpen` state and passes `onChatOpen` down to `Navbar` and `ChatPanel`.

### Pages

| Path | Page | Notes |
|---|---|---|
| `/` | `RoleSelectionPage` or `LandingPage` | Depends on auth |
| `/find` | `FindRoommatePage` | Filter/sort roommates |
| `/rooms` | `ViewAllRoomsPage` | Filter/sort listings |
| `/rooms/:id` | `RoomDetailPage` | Full-page room detail |
| `/matches` | `ViewAllMatchesPage` | Tenant matches grid |
| `/post` | `PostRoomPage` | 4-step wizard |
| `/profile` | `ProfilePage` | Own profile (view/edit) |
| `/profile/:id` | `ProfilePage` | Other user's profile |
| `/user/:id` | `UserDetailPage` | |
| `/premium` | `PremiumPage` or `LandlordPremiumPage` | Role-specific |
| `/admin` | `AdminPage` | Admin dashboard |
| `/login`, `/register` | Auth pages | Standalone layout |

### Data & service layer

**All TypeScript types** live in `src/types/index.ts` — never define interfaces in data or component files.

**Service layer** (`src/services/`) is the only place components fetch data from. Each service file exposes async functions that return real API data in production or mock data in development:

| Service file | Exports |
|---|---|
| `roommate.service.ts` | `getRoommates`, `getRoommateById`, `getRoommateWithReviews`, `getReviewsByRoommateId`, `submitRoommateReview`, `getCurrentUser`, `updateCurrentUser` |
| `room.service.ts` | `getRooms`, `getRoomById`, `getLandlordRooms`, `createRoomSlot`, `updateRoomSlot`, `deleteRoomSlot`, `submitRoomReview` |
| `chat.service.ts` | `getConversations`, `getConversationById`, `sendMessage`, `startConversation` |
| `admin.service.ts` | `getAdminStats`, `getLandlords`, `getTenants`, `getAdminReviews`, `updateLandlord`, `updateTenant`, `deleteLandlord`, `deleteTenant`, `updateReviewStatus` |
| `auth.service.ts` | `login`, `register`, `logout`, `restoreSession` |

**Mock vs. real API** is controlled by `VITE_API_URL` in `.env`:
- When `VITE_API_URL` is unset (development default): `IS_MOCK_MODE = true` — services return `mockDelay(localData)` with a simulated 300 ms delay.
- When `VITE_API_URL` is set: `IS_MOCK_MODE = false` — services call `apiRequest(endpoint, options)` against the real backend.

To switch to a real backend, set `VITE_API_URL=https://api.example.com` in `.env.production`. No component changes are needed.

**Mock data arrays** remain in `src/data/mockData.ts` and `src/data/adminData.ts` but must not be imported directly in components or pages — import from `../services` or `../lib` instead.

**Shared utilities** live in `src/lib/`:
- `format.ts` — `formatCurrency(amount)` formats VND using `Intl.NumberFormat`
- `constants.ts` — `LIFESTYLE_OPTIONS`, `DISTRICTS`, `ROOM_TYPES`, `AMENITY_OPTIONS`

### Internationalisation

`src/i18n/index.ts` configures i18next with Vietnamese (`vi`) as default and English (`en`) as fallback. Translation files are at `src/i18n/vi.json` and `src/i18n/en.json`. Language preference is persisted to `localStorage` under the key `language`. Components use the `useTranslation()` hook from `react-i18next`.

### Styling

- Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)
- Global CSS tokens and utility classes in `src/styles/index.css`
- Key CSS custom properties: `--color-primary` (#4A90E2), `--color-secondary` (#2EC4B6), `--color-accent` (#FF6B6B), `--color-bg` (#F7F9FC), `--color-text` (#1A1A2E)
- Custom classes: `.glass`, `.glass-strong`, `.skeleton`, `.animated-gradient`, `.card-lift`, `.premium-glass`, `.line-clamp-2`, `.hide-scrollbar`
- Fonts: Poppins (headings), Inter (body) via `@fontsource`

### Animations

Framer Motion is used throughout. All page transitions use `AnimatePresence mode="wait"` with `opacity`/`y` variants (0.3s). Two custom hooks drive scroll-triggered animations:

- `useInView(threshold?)` — one-shot IntersectionObserver, returns `[ref, isInView]`
- `useCountUp(target, duration?, start?)` — rAF-based count-up animation, used with `useInView` for deferred start

### Key components

- `MatchCircle` — reusable SVG donut showing compatibility %, sizes: `sm` / `md` / `lg`
- `Modal` — generic overlay with body scroll lock and spring animation; takes `size` prop (`md`/`lg`/`xl`/`full`)
- `RoomDetailContent` — image carousel + booking card, rendered inside `Modal` or `RoomDetailPage`
- `ChatPanel` — slide-in two-column chat UI; accepts optional `initialConversationId` to pre-select a conversation
- `LandlordSidebar` — sidebar nav for landlord layout (replaces top Navbar)
- `SkeletonCards` — shimmer loading placeholders used in list pages
