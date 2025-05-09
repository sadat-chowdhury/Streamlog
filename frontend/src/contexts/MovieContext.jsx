import {createContext, useState, useContext, useEffect} from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {
    const [favorites, setFavorites] = useState([])
    const [toWatch, setToWatch] = useState([]);
    const [watched, setWatched] = useState([]);

    // Load from localStorage on first render
    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites");
        const storedToWatch = localStorage.getItem("toWatch");
        const storedWatched = localStorage.getItem("watched");

        if (storedFavs) setFavorites(JSON.parse(storedFavs));
        if (storedToWatch) setToWatch(JSON.parse(storedToWatch));
        if (storedWatched) setWatched(JSON.parse(storedWatched));
    }, [])

    // save each list to localStorage when changed
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('toWatch', JSON.stringify(toWatch))
    }, [toWatch]);

    useEffect(() => {
        localStorage.setItem('watched', JSON.stringify(watched))
    }, [watched]);

    // generic utility to add without duplicates
    const addUnique = (listSetter, list, movie) => {
        listSetter(prev => (prev.some(m => m.id === movie.id) ? prev : [...prev, movie]));
    };

    // Favorites
    const addToFavorites = (movie) => {
        addUnique(setFavorites, favorites, movie);
    }
    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }
    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    // To Watch
    const addToWatch = (movie) => {
        addUnique(setToWatch, toWatch, movie);
    }
    const removeFromWatch = (movieId) => {
        setToWatch(prev => prev.filter(movie => movie.id !== movieId))
    }
    const isInWatchList = (movieId) => {
        return toWatch.some(movie => movie.id === movieId)
    }

    // Watched
    const addToWatched = (movie) => {
        addUnique(setWatched, watched, movie);
    }
    const removeFromWatched = (movieId) => {
        setWatched(prev => prev.filter(movie => movie.id !== movieId))
    }
    const isWatched = (movieId) => {
        return watched.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,

        toWatch,
        addToWatch,
        removeFromWatch,
        isInWatchList,

        watched,
        addToWatched,
        removeFromWatched,
        isWatched,
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}