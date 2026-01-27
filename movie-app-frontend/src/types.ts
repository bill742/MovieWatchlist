export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  release_dates: {
    type: number;
  }[];
  genres: Genre[];
  runtime: number;
  overview: string;
  vote_average?: number;
  vote_count?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieListProps {
  movies: Movie[];
  heading: string;
}

export interface MoviePreviewProps {
  movie: Movie;
}

export interface RegionContextType {
  region: string;
  setRegion: (region: string) => void;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}
