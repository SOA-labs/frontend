import React, { useState } from "react";
import axios from "axios";

const MovieDetails = () => {
    const [movieId, setMovieId] = useState("");
    const [movieData, setMovieData] = useState(null);
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const fetchMovieData = async () => {
        setIsFetching(true);
        setError(null);
        try {
            const response = await axios.get(`/lab2-1.0-SNAPSHOT/api/movies/${movieId}`);
            setMovieData(response.data);
        } catch (err) {
            setError("Error fetching movie data. Please check the ID.");
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchMovieData();
    };

    return (
        <div>
            <h1>Movie Details</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Movie ID"
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                    required
                />
                <button type="submit" disabled={isFetching}>Get Movie</button>
            </form>

            {isFetching && <p>Fetching movie data...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {movieData && (
                <div>
                    <h3>Movie Details</h3>
                    <p><strong>ID:</strong> {movieData.id}</p>
                    <p><strong>Name:</strong> {movieData.name}</p>
                    <p><strong>Oscars Count:</strong> {movieData.oscarsCount}</p>
                    <p><strong>USA Box Office:</strong> {movieData.usaBoxOffice}</p>
                    <p><strong>Genre:</strong> {movieData.genre || "N/A"}</p>
                    {movieData.screenwriter && (
                        <div>
                            <h4>Screenwriter Details</h4>
                            <p><strong>Name:</strong> {movieData.screenwriter.name}</p>
                            <p><strong>Height:</strong> {movieData.screenwriter.height}</p>
                            <p><strong>Eye Color:</strong> {movieData.screenwriter.eyeColor}</p>
                            <p><strong>Hair Color:</strong> {movieData.screenwriter.hairColor}</p>
                            <p><strong>Nationality:</strong> {movieData.screenwriter.nationality}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MovieDetails;
