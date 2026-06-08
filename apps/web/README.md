# Movie Watchlist — Client

A Next.js web application for discovering and exploring movies. Browse trending films, now-playing releases, and upcoming titles — filtered by your region — with search and detailed movie pages including cast, crew, and trailers.

## Features

- **Home page** — Trending hero banner, now-playing, and upcoming movies filtered by region
- **Region selection** — ISO 3166-1 country codes (US, CA, GB, etc.) for region-specific release dates
- **Search** — Full-text movie search
- **Movie detail pages** — Poster, genres, rating, runtime, overview, directors, cast, and trailers
- **Trailer playback** — Embedded YouTube trailers via a modal dialog
- **Dark/Light theme** — System-aware with manual toggle
- **Responsive design** — Mobile-first layout

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, Server Components)
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com) — headless component primitives
- [next-themes](https://github.com/pacocoursey/next-themes) — dark/light mode
- [Lucide React](https://lucide.dev) — icons
- [Playwright](https://playwright.dev) — end-to-end testing

Data is sourced entirely from [The Movie Database (TMDB) API v3](https://developer.themovie.org).

## Getting Started

### Prerequisites

Create a `.env.local` file in this directory with your TMDB credentials:

```bash
NEXT_PUBLIC_API_KEY=Bearer <your_tmdb_read_access_token>
NEXT_PUBLIC_API_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_API_IMAGE_PATH=https://image.tmdb.org/t/p/
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

A free TMDB API read access token can be obtained at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout (Header, Footer, providers)
│   ├── not-found.tsx         # Custom 404 page
│   ├── search/               # Search results page
│   └── movies/[id]/          # Movie detail page
├── components/
│   ├── movie/                # MovieFetcher, MovieList, MoviePreview, HeroBanner
│   ├── header/               # Search, RegionSelect, ModeToggle, Logo
│   └── ui/                   # Radix-based Button, Card, Dialog, etc.
├── data/
│   └── loaders.ts            # TMDB API fetching functions
├── context/
│   └── region-context.tsx    # Global region selection state
└── utils/
    └── fetch-apis.ts         # Generic fetch utilities with error handling
```
