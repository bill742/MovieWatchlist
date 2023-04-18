const MovieCard = ({ movie }) => {
    const bgImg = `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`;

    return (
        // TODO: Add loading state
        // Clear upcoming releases before rendering results
        <div
            className="card"
            style={{
                backgroundImage: `url(${bgImg})`,
            }}
        >
            <div className="card--content">
                <div className="card-copy">
                    <h3 className="card-title">{movie.title}</h3>
                    <p>
                        <small>RELEASE DATE: {movie.release_date}</small>
                    </p>
                    <p>
                        <small>RATING: {movie.vote_average}</small>
                    </p>
                    <p className="card--desc">{movie.overview}</p>
                </div>
                <img
                    className="card--image"
                    src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`}
                    alt={movie.title}
                />
            </div>
        </div>
    );
};

export default MovieCard;
