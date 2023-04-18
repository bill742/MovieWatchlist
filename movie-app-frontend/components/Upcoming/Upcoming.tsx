import { useState } from 'react';
import MovieCard from '../MovieCard/MovieCard';

const Upcoming = ({upcomingMovies}) => {
  // const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);



    // try {
    //   const res = await fetch(url);
    //   const data = await res.json();
    //   return data.results;
    // } catch (err) {
    //   console.error(err);
    // }
  // }

  console.log(upcomingMovies);



//     this.setState({ movies: upcomingMovies.data.results, loading: false });

    if (loading) {
        // TODO: Add loading animation
        return 'Loading!';
    } else {
        return (
            <div>
                <h2>Upcoming releases</h2>
                {upcomingMovies.results.map((movie) => (
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </div>
        );
    }
};

export default Upcoming;
