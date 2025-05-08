import { useMovieContext } from "../contexts/MovieContext";
import "../css/MovieCard.css";

function MovieCard({ movie }) {
    const {
        isFavorite,
        addToFavorites,
        removeFromFavorites,
        isInWatchList,
        addToWatch,
        removeFromWatch,
        isWatched,
        addToWatched,
        removeFromWatched,
    } = useMovieContext();

    const favorite = isFavorite(movie.id);
    const toWatch = isInWatchList(movie.id);
    const watched = isWatched(movie.id);

    function onFavoriteClick(e) {
        e.preventDefault();
        favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
    }

    function handleWatchlistClick(e) {
        e.preventDefault();
        toWatch ? removeFromWatch(movie.id) : addToWatch(movie);
    }

    function handleWatchedClick(e) {
        e.preventDefault();
        watched ? removeFromWatched(movie.id) : addToWatched(movie);
    }

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img
                    src={
                        movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "/path/to/placeholder-image.jpg"
                    }
                    alt={movie.title}
                />
                <div className="movie-overlay">
                    <button
                        className={`favorite-btn ${favorite ? "active" : ""}`}
                        onClick={onFavoriteClick}
                    >
                        <span className="icon">♥</span>
                        <span className="text">Favorite</span>
                    </button>
                    <button
                        className={`watch-btn ${toWatch ? "active" : ""}`}
                        onClick={handleWatchlistClick}
                    >
                        <span className="icon">ⴵ</span>
                        <span className="text">Watchlist</span>
                    </button>
                    <button
                        className={`watched-btn ${watched ? "active" : ""}`}
                        onClick={handleWatchedClick}
                    >
                        <span className="icon">☑</span>
                        <span className="text">Watched</span>
                    </button>
                </div>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split("-")[0]}</p>
            </div>
        </div>
    );
}

export default MovieCard;
