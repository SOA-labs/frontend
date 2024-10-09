import React, { useState } from "react";
import axios from "axios";

const DeleteMovieForm = ({ onMovieDeleted }) => {
    const [movieId, setMovieId] = useState("");
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await axios.delete(`/lab2-1.0-SNAPSHOT/api/movies/${movieId}`);
            onMovieDeleted(); // Вызов функции для обновления таблицы
            setMovieId(""); // Сброс поля ID
        } catch (err) {
            setError("Error deleting movie. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Delete Movie</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                placeholder="Movie ID"
                value={movieId}
                onChange={(e) => setMovieId(e.target.value)}
                required
            />
            <button type="submit" disabled={isSubmitting}>Delete Movie</button>
        </form>
    );
};

export default DeleteMovieForm;
