## Movie Watchlist

A web application for discovering and exploring movies — browse trending films, now-playing releases, and upcoming titles filtered by region, with full search and detailed movie pages.

## Current Features

- **Trending & regional releases** — Hero banner of trending titles, now-playing and upcoming movies filtered by country (US, CA, GB, and more)
- **Search** — Full-text movie search across the TMDB catalog
- **Movie detail pages** — Poster, genres, rating, runtime, overview, directors, cast, and trailers
- **Trailer playback** — Embedded YouTube trailers via an in-page modal
- **Dark/Light theme** — System-aware with a manual toggle
- **Responsive design** — Mobile-first layout

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, Server Components) — React 19
- [Tailwind CSS 4](https://tailwindcss.com) — utility-first styling
- [Radix UI](https://www.radix-ui.com) — headless component primitives
- [Playwright](https://playwright.dev) — end-to-end testing

Data is sourced from [The Movie Database (TMDB) API v3](https://developer.themoviedb.org).

## Project Structure

```
MovieWatchlist/
└── client/     # Next.js front-end application
```

See [`client/README.md`](client/README.md) for setup instructions, environment variables, and a detailed breakdown of the client source structure.

## Upcoming Features

- **User authentication** — Account creation and login
- **Personal watchlist** — Save and manage movies you want to watch
- **Back-end API** — Server to handle auth and persist watchlist data per user
