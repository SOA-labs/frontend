// src/pages/MoviePage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateMovieForm from "../components/forms/CreateMovieForm";
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

    const fetchMovies = async () => {
        setIsLoading(true); // Устанавливаем состояние загрузки
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
            setIsLoading(false); // Снимаем состояние загрузки
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [currentPage, pageSize]);


    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <CreateMovieForm onMovieCreated={fetchMovies} /> {/* Обновлено: Передаем fetchMovies */}
                    <DeleteMovieForm onMovieDeleted={fetchMovies} />
                    <UpdateMovieForm onMovieUpdated={fetchMovies} />
                    <MovieDetails />
                    <MovieTable
                        movies={movies}
                        totalItems={totalItems}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                    />
                </>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Отображаем ошибку, если есть */}
        </div>
    );
};

export default MoviePage;
