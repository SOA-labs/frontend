// src/pages/MoviePage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieForm from "../components/forms/CreateMovieForm";
import DeleteMovieForm from "../components/forms/DeleteMovieForm";
import UpdateMovieForm from "../components/forms/UpdateMovieForm";
import MovieTable from "../components/tables/MovieTable";
import MovieDetails from "../components/MovieDetails";

const MoviePage = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [usaBoxOfficeSum, setUsaBoxOfficeSum] = useState(0);
    const [searchResults, setSearchResults] = useState([]); // Для хранения результатов поиска
    const [searchQuery, setSearchQuery] = useState(""); // Для хранения подстроки поиска

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/lab2-1.0-SNAPSHOT/api/movies", {
                params: {
                    page: currentPage,
                    size: pageSize,
                },
            });
            setMovies(response.data.items);
            setTotalItems(response.data.totalItems);
        } catch (err) {
            console.error("Error fetching movies:", err);
            setError("Error fetching movies. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsaBoxOfficeSum = async () => {
        try {
            const response = await axios.get("/lab2-1.0-SNAPSHOT/api/movies/sum-usa-box-office");
            setUsaBoxOfficeSum(response.data);
        } catch (err) {
            console.error("Error fetching USA box office sum:", err);
            setError("Error fetching USA box office sum. Please try again later.");
        }
    };

    // Функция для поиска фильмов по подстроке
    const searchMoviesByName = async (substring) => {
        try {
            const response = await axios.get("/lab2-1.0-SNAPSHOT/api/movies/movie-by-name", {
                params: { substring },
            });
            setSearchResults(response.data); // Сохранение результатов поиска
        } catch (err) {
            console.error("Error fetching movies by name:", err);
            setError("Error fetching movies by name. Please try again later.");
        }
    };

    useEffect(() => {
        fetchMovies();
        fetchUsaBoxOfficeSum();
    }, [currentPage, pageSize]);

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setCurrentPage(0);
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * pageSize < totalItems) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const refreshMoviesAndSum = async () => {
        await fetchMovies();
        await fetchUsaBoxOfficeSum();
    };

    // Обработка отправки формы поиска
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            searchMoviesByName(searchQuery);
        }
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <MovieForm onMovieCreated={refreshMoviesAndSum} />
                    <DeleteMovieForm onMovieDeleted={refreshMoviesAndSum} />
                    <UpdateMovieForm onMovieUpdated={refreshMoviesAndSum} />
                    <MovieDetails />
                    <MovieTable
                        movies={movies}
                        totalItems={totalItems}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                    />
                    <h1>Total USA Box Office: ${usaBoxOfficeSum}</h1>

                    {/* Форма для поиска фильмов по подстроке */}
                    <form onSubmit={handleSearchSubmit}>
                        <h1>Search Movies by Name</h1>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter name substring"
                            required
                        />
                        <button type="submit">Search</button>
                    </form>

                    {/* Отображение результатов поиска */}
                    {searchResults.length > 0 && (
                        <div>
                            <h4>Search Results:</h4>
                            <ul>
                                {searchResults.map((movie) => (
                                    <li key={movie.id}>{movie.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default MoviePage;
