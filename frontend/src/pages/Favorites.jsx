import "../css/Favorites.css";
import { useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const { favorites } = useMovieContext();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommendClick = async () => {
    const selectedMovie = favorites.find(movie => movie.id === parseInt(selectedMovieId));
    if (!selectedMovie) return;

    try {
      setLoading(true);
      setRecommendations([]); // Clear old recs
      const response = await fetch('https://us-east1-white-faculty-456816-n9.cloudfunctions.net/get_recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: selectedMovie.title })
      });

      const data = await response.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        alert("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to fetch recommendations");
      console.error(err);
    } finally {
      setLoading(false);
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
        <button onClick={handleRecommendClick} disabled={!selectedMovieId || loading}>
          {loading ? "Loading..." : "Recommend Me Movies"}
        </button>
      </div>

      <div className="movies-grid">
        {favorites.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>Recommended for you</h3>
          <ul className="recommendations-list">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Favorites;
