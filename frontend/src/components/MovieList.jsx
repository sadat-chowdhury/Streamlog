// src/components/MovieList.jsx
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            const url = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=15&with_watch_monetization_types=flatrate&sort_by=popularity.desc`;

            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDA4MTZlNWMyNzliMjY1ZjRlY2NhYjkyMDc0MDBmNSIsIm5iZiI6MS43NDE3MjM2Mzc5Mjk5OTk4ZSs5LCJzdWIiOiI2N2QwOTdmNTc3NjFhM2E2OGY2MGE1N2QiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.kQq51wtf8GMwoqEheK3-bHLMqpWuAYIthLjHo5iAFaY` // Replace with your actual bearer token
                }
            };

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                setMovies(data.results);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) return <p>Loading movies...</p>;

    return (
        <div className="movie-list">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
}

export default MovieList;
