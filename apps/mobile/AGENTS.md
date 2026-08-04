# apps/mobile — Expo SDK 56

Expo changes fast. Read the versioned docs at
<https://docs.expo.dev/versions/v56.0.0/> before writing native/Expo code.

See the **root `CLAUDE.md`** ("Mobile app (Expo)" section) for the architecture:
Expo Router structure, NativeWind v4.2 (Tailwind v3) setup, Supabase auth, the shared
TMDB client, and `EXPO_PUBLIC_*` env vars. Per the root conventions, non-route
components use named exports + `displayName`; route files (`_layout.tsx`, screens) use
`export default`.
