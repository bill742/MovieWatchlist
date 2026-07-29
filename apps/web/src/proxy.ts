import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/watchlist", "/profile"];

/**
 * How long we will wait on Supabase before treating the request as signed out.
 *
 * When the auth host is unreachable, gotrue retries with exponential backoff
 * for ~26s before surfacing AuthRetryableFetchError — and this runs on every
 * request carrying a session cookie, so a Supabase outage otherwise turns into
 * ~51s page loads for every signed-in user. Generous enough that an ordinarily
 * slow response still succeeds rather than signing people out.
 */
const AUTH_TIMEOUT_MS = 5000;

/**
 * Resolves `work`, or falls back if it hasn't settled within the timeout.
 *
 * The abort signal on the Supabase client cancels the in-flight request so we
 * don't leave a socket open; this race is the hard bound, since gotrue retries
 * internally and would otherwise keep going long after the first attempt was
 * cancelled.
 */
async function withinTimeout<T>(work: Promise<T>, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), AUTH_TIMEOUT_MS);
  });

  try {
    return await Promise.race([work, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

export async function proxy(request: NextRequest) {
  // Carry the current pathname as a header so Server Components can read it
  // without accessing dynamic request params (used for metadata generation).
  let response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        "x-current-path": request.nextUrl.pathname,
      }),
    },
  });

  // Refresh the Supabase session on every request so it never expires silently.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, options, value }) =>
            response.cookies.set(name, value, options),
          );
          // Re-apply the x-current-path header after creating a new response.
          response.headers.set(
            "x-current-path",
            request.nextUrl.pathname,
          );
        },
      },
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
          }),
      },
    },
  );

  const user = await withinTimeout(
    supabase.auth
      .getUser()
      .then(({ data }) => data.user)
      .catch(() => null),
    null,
  );

  const isProtected = PROTECTED_PATHS.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  // The public TMDB routes are excluded deliberately: they read nothing
  // user-specific, so running session refresh on them only added a Supabase
  // round trip per request. /auth/callback is NOT excluded — it needs the
  // session handling to complete a sign-in.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/(?:movies|tv|search|tmdb)(?:/|$)|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
