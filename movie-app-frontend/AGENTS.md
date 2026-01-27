# AI Agent Instructions for Watchlist Frontend

## Project Overview

This is a movie watchlist web application that displays movie premiere dates and information.

**Tech Stack:**

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript with strict mode
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui with Radix UI primitives
- **Icons:** Lucide React
- **Theming:** next-themes
- **Testing:** Playwright
- **Data Source:** The Movie Database (TMDB) API

---

## Architecture & File Structure

### Directory Organization

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── [route]/
│       └── page.tsx       # Route-specific pages
├── components/
│   ├── ui/                # Reusable UI components (Shadcn)
│   ├── movies/            # Movie-specific components
│   ├── search/            # Search functionality
│   └── header/            # Header components
└── lib/                   # Utilities, contexts, and helpers
```

### Naming Conventions

- **Files and folders:** kebab-case (e.g., `movie-list.tsx`, `region-context.tsx`)
- **Components:** PascalCase exports (e.g., `export function MovieList()`)
- **Use named exports** instead of default exports for consistency

### Component Export Patterns

**Preferred: Named Function Declarations**

```tsx
export function ComponentName() {
  // No displayName needed - React DevTools uses function name
  return <div>...</div>;
}
```

**When Using HOCs (memo, forwardRef): Add displayName**

```tsx
export const ComponentName = memo(() => {
  return <div>...</div>;
});
ComponentName.displayName = "ComponentName"; // ✅ Required for debugging
```

**Rule:** Only use `displayName` when wrapping components with Higher-Order Components (HOCs) like `memo()`, `forwardRef()`, or custom HOCs. Named function declarations automatically provide the name to React DevTools.

---

## Component Guidelines

### Server vs Client Components

- **Default to Server Components** - Use server components by default for better performance
- **Add `"use client"` only when needed** for:
  - React hooks (useState, useEffect, useContext, etc.)
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - Third-party libraries that require client-side rendering

### Client Component Best Practices

When creating client components that use browser-specific features:

1. **Prevent hydration mismatches** - Use mounted state for theme-dependent rendering:

   ```tsx
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
     setMounted(true);
   }, []);

   if (!mounted) return <Placeholder />;
   ```

2. **Suppress hydration warnings** - Add `suppressHydrationWarning` to elements modified by client-side libraries (e.g., theme providers)

---

## Styling & Design

### Tailwind CSS

- Use **Tailwind v4** utility classes
- Follow **mobile-first responsive design**
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

### Dark Mode Support

- All components must support both light and dark mode
- Use Tailwind's dark mode classes (e.g., `dark:bg-gray-900`)
- The app uses `next-themes` with system preference detection
- Root layout has `suppressHydrationWarning` on `<html>` tag for theme support

### Accessibility

- Use semantic HTML elements (`<main>`, `<header>`, `<nav>`, `<section>`)
- All interactive elements must have accessible labels
- Include `aria-label` attributes where needed
- Ensure keyboard navigation works properly

---

## State Management & Context

### Existing Contexts

1. **ThemeProvider** (`src/components/theme-provider.tsx`)
   - Wraps the app in `layout.tsx`
   - Provides theme switching functionality
   - Uses `next-themes` library

2. **RegionProvider** (`src/lib/region-context.tsx`)
   - Manages selected movie region (US, CA, GB, etc.)
   - Default region: "US"
   - Used for filtering TMDB API results by region

---

## Data Fetching

### API Integration

- **API:** The Movie Database (TMDB)
- **Environment Variables:**
  - `NEXT_PUBLIC_API_KEY` - TMDB API authorization
  - `NEXT_PUBLIC_API_URL` - TMDB API base URL

### Fetching Patterns

**Server Components:**

```tsx
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
    },
  });
  return res.json();
}
```

**Client Components:**

```tsx
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch(url, options);
    const data = await res.json();
    setData(data);
  };
  fetchData();
}, [dependency]);
```

---

## Routing & Navigation

### App Router (Next.js 15)

- Use `src/app/` directory structure
- Pages are defined by `page.tsx` files
- Layouts are defined by `layout.tsx` files

### Navigation APIs

**DO NOT USE** Pages Router APIs:

- ❌ `import { useRouter } from 'next/router'`
- ❌ `getServerSideProps`
- ❌ `getStaticProps`

**USE** App Router APIs:

- ✅ `import { useRouter } from 'next/navigation'` - for programmatic navigation
- ✅ `import { useSearchParams } from 'next/navigation'` - for query parameters
- ✅ `import { usePathname } from 'next/navigation'` - for current path
- ✅ Server components with async/await for data fetching

---

## Image Optimization

### Next.js Image Component

- Always use `next/image` for images
- Configure remote patterns in `next.config.ts` for external images

**Current configuration:**

```ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "image.tmdb.org",
      pathname: "/t/p/**",
    },
  ],
}
```

---

## Code Style & Best Practices

### Import Order

```tsx
// 1. React and Next.js
import { useState } from "react";
import Image from "next/image";

// 2. Third-party libraries
import { Moon, Sun } from "lucide-react";

// 3. Components
import { Button } from "@/components/ui/button";
import { MovieList } from "@/components/movies/movie-list";

// 4. Local utilities and contexts
import { useRegion } from "@/lib/region-context";

// 5. Types
import type { Movie } from "@/types/movie";
```

### TypeScript

- Use **strict mode**
- Define interfaces for all data structures
- Prefer `interface` over `type` for object shapes
- Use proper typing for all function parameters and returns

### Documentation

- Use JSDoc comments for complex functions and components
- Include description, parameters, and return types
- Document non-obvious logic with inline comments

---

## Testing

### Playwright

- Use Playwright for end-to-end tests
- Test critical user flows:
  - Page rendering
  - Navigation
  - Form submissions
  - Responsive behavior
  - Accessibility

---

## Common Patterns

### Loading States

Use the reusable `Loader` component for all loading states:

```tsx
import { Loader } from "@/components/ui/loader";

if (loading) {
  return <Loader message="Loading data..." />;
}
```

**Loader Component Features:**

- Animated spinner using Lucide's `Loader2` icon
- Optional message prop for context-specific loading text
- Configurable size: `sm`, `md` (default), `lg`
- Accessible with screen reader support
- Automatic dark mode support

**Examples:**

```tsx
// Basic loader with message
<Loader message="Loading movies..." />

// Without message (just spinner)
<Loader />

// Different sizes
<Loader size="sm" message="Loading..." />
<Loader size="lg" />
```

**DO NOT** create custom loading divs. Always use the `Loader` component for consistency.

### Error Handling

```tsx
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error("Error fetching data:", error);
  // Handle error appropriately
}
```

---

## Performance Considerations

- Optimize images with `next/image`
- Use Server Components when possible
- Implement proper loading states
- Avoid unnecessary client-side JavaScript
- Consider code splitting for large components

---

## SEO & Metadata

- Use metadata exports in page files:
  ```tsx
  export const metadata: Metadata = {
    title: "Page Title",
    description: "Page description",
    alternates: {
      canonical: "/page-path",
    },
  };
  ```
- Set `metadataBase` in root layout for automatic canonical URL generation
- Follow SEO best practices
- Include Open Graph tags
- Always include canonical URLs to prevent duplicate content issues

---

## Known Issues & Gotchas

1. **Hydration errors** - Ensure server and client render identical content initially
2. **Theme flashing** - Use `suppressHydrationWarning` on `<html>` tag
3. **Router errors** - Always use App Router APIs, never Pages Router APIs
4. **Image hostname errors** - Configure remote patterns in `next.config.ts` before using external images

---

## Additional Notes

- This is the frontend only; there may be a separate backend service
- Keep performance, SEO, and accessibility in mind for all features
- When in doubt, prefer simpler solutions over complex abstractions
