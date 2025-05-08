import "../css/Favorites.css";
import { useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import { searchByTitle } from "../services/api.js";

function Favorites() {
  const { favorites, toWatch, watched } = useMovieContext();
  const [currentTab, setCurrentTab] = useState('favorites');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setSelectedMovieId(null);
    setRecommendations([]);
  };

  const handleRecommendClick = async () => {
    const currentMovies = getCurrentMovies();
    const selectedMovie = currentMovies.find(movie => movie.id === parseInt(selectedMovieId));
    if (!selectedMovie) return;

    try {
      setLoading(true);
      setRecommendations([]);
      const response = await fetch('https://us-east1-white-faculty-456816-n9.cloudfunctions.net/get-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: selectedMovie.title })
      });

      const data = await response.json();
      if (data.recommendations) {
        const detailedRecs = await Promise.all(
          data.recommendations.map(async (title) => {
            const movie = await searchByTitle(title);
            return movie;
          })
        );
        setRecommendations(detailedRecs.filter(Boolean));
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

  const getCurrentMovies = () => {
    switch (currentTab) {
      case 'favorites': return favorites;
      case 'toWatch': return toWatch;
      case 'watched': return watched;
      default: return [];
    }
  };

  const renderMovies = () => {
    return getCurrentMovies().map((movie) => (
      <MovieCard movie={movie} key={movie.id} />
    ));
  };

  return (
    <div className="favorites">
      <h2>Your Movies</h2>

      {/* Recommendations appear at the top */}
      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>Recommended for you</h3>
          <div className="movies-grid">
            {recommendations.map((rec, index) => (
              <MovieCard movie={rec} key={rec.id || index} />
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${currentTab === 'favorites' ? 'active' : ''}`}
          onClick={() => handleTabChange('favorites')}
        >
          Favorites
        </button>
        <button
          className={`tab-btn ${currentTab === 'toWatch' ? 'active' : ''}`}
          onClick={() => handleTabChange('toWatch')}
        >
          Watchlist
        </button>
        <button
          className={`tab-btn ${currentTab === 'watched' ? 'active' : ''}`}
          onClick={() => handleTabChange('watched')}
        >
          Watched
        </button>
      </div>

      {/* Recommendation Dropdown */}
      <div className="recommendation-bar">
        <label htmlFor="recommend-select">Get recommendations based on:</label>
        <select
          id="recommend-select"
          value={selectedMovieId || ""}
          onChange={(e) => setSelectedMovieId(e.target.value)}
        >
          <option value="" disabled>Select a movie</option>
          {getCurrentMovies().map((movie) => (
            <option value={movie.id} key={movie.id}>{movie.title}</option>
          ))}
        </select>
        <button onClick={handleRecommendClick} disabled={!selectedMovieId || loading}>
          {loading ? "Loading..." : "Recommend Me Movies"}
        </button>
      </div>

      {/* Movie List */}
      <div className="movies-grid">
        {renderMovies()}
      </div>

      {/* Empty state */}
      {getCurrentMovies().length === 0 && (
        <div className="empty-state">
          <h3>No movies in this list yet!</h3>
          <p>Start adding movies to this list to see them here!</p>
        </div>
      )}
    </div>
  );
}

export default Favorites;
