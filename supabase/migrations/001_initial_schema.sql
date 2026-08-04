-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Extends auth.users with app-specific data. A trigger keeps them in sync.

CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username     TEXT UNIQUE,
  display_name TEXT,
  avatar_url   TEXT,
  region       TEXT    NOT NULL DEFAULT 'US',
  theme        TEXT    NOT NULL DEFAULT 'system'
                       CHECK (theme IN ('light', 'dark', 'system')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─── Watchlist items ──────────────────────────────────────────────────────────

CREATE TABLE public.watchlist_items (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  tmdb_id      INTEGER     NOT NULL,
  media_type   TEXT        NOT NULL CHECK (media_type IN ('movie', 'tv')),
  status       TEXT        NOT NULL DEFAULT 'want_to_watch'
                           CHECK (status IN ('want_to_watch', 'watching', 'watched', 'dropped')),
  added_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, tmdb_id, media_type)
);

ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own watchlist"
  ON public.watchlist_items FOR ALL
  USING (auth.uid() = user_id);

-- ─── Episode watches ──────────────────────────────────────────────────────────

CREATE TABLE public.episode_watches (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  show_tmdb_id   INTEGER     NOT NULL,
  season_number  INTEGER     NOT NULL,
  episode_number INTEGER     NOT NULL,
  watched_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, show_tmdb_id, season_number, episode_number)
);

ALTER TABLE public.episode_watches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own episode watches"
  ON public.episode_watches FOR ALL
  USING (auth.uid() = user_id);

-- ─── Custom lists (premium) ───────────────────────────────────────────────────

CREATE TABLE public.custom_lists (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  description TEXT,
  is_public   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own lists"
  ON public.custom_lists FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public lists"
  ON public.custom_lists FOR SELECT
  USING (is_public = TRUE);

CREATE TABLE public.custom_list_items (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id    UUID        NOT NULL REFERENCES public.custom_lists ON DELETE CASCADE,
  tmdb_id    INTEGER     NOT NULL,
  media_type TEXT        NOT NULL CHECK (media_type IN ('movie', 'tv')),
  sort_order INTEGER,
  added_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (list_id, tmdb_id, media_type)
);

ALTER TABLE public.custom_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "List owners manage their list items"
  ON public.custom_list_items FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM public.custom_lists WHERE id = list_id)
  );

CREATE POLICY "Anyone can view items in public lists"
  ON public.custom_list_items FOR SELECT
  USING (
    (SELECT is_public FROM public.custom_lists WHERE id = list_id) = TRUE
  );

-- ─── Trakt connections (premium) ─────────────────────────────────────────────

CREATE TABLE public.trakt_connections (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  access_token  TEXT        NOT NULL,
  refresh_token TEXT        NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  last_sync_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trakt_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own Trakt connection"
  ON public.trakt_connections FOR ALL
  USING (auth.uid() = user_id);

-- ─── Subscriptions ────────────────────────────────────────────────────────────

CREATE TABLE public.subscriptions (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  status             TEXT        NOT NULL
                                 CHECK (status IN ('active', 'trialing', 'cancelled', 'past_due')),
  platform           TEXT        NOT NULL CHECK (platform IN ('stripe', 'apple', 'google')),
  external_id        TEXT,
  current_period_end TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);
