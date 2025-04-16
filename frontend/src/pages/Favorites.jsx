import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import { useState } from "react";

function Favorites() {
  const { favorites } = useMovieContext();
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleRecommendClick = () => {
    const selectedMovie = favorites.find(movie => movie.id === parseInt(selectedMovieId));
    if (selectedMovie) {
      console.log("Fetching recommendations for:", selectedMovie.title);
      // Call your recommendation API here using `selectedMovie.id` or `title`
    }
  };

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No Favorite Movies Yet</h2>
        <p>Start adding movies to your favorites and they will appear here!</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2>Your Favorites</h2>

      {/* Dropdown Selector */}
      <div className="recommendation-bar">
        <label htmlFor="recommend-select">Get recommendations based on:</label>
        <select
          id="recommend-select"
          value={selectedMovieId || ""}
          onChange={(e) => setSelectedMovieId(e.target.value)}
        >
          <option value="" disabled>Select a movie</option>
          {favorites.map((movie) => (
            <option value={movie.id} key={movie.id}>{movie.title}</option>
          ))}
        </select>
        <button onClick={handleRecommendClick} disabled={!selectedMovieId}>
          Recommend Me Movies
        </button>
      </div>

      {/* Favorite Movies Grid */}
      <div className="movies-grid">
        {favorites.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
