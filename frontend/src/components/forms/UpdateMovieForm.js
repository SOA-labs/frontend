import React, { useState } from "react";
import axios from "axios";

const MovieGenre = {
    WESTERN: "WESTERN",
    MUSICAL: "MUSICAL",
    ADVENTURE: "ADVENTURE",
    TRAGEDY: "TRAGEDY",
};

const Country = {
    GERMANY: "GERMANY",
    VATICAN: "VATICAN",
    ITALY: "ITALY",
    SOUTH_KOREA: "SOUTH_KOREA",
    JAPAN: "JAPAN",
};

const UpdateMovieForm = ({ onMovieUpdated }) => {
    const [movieId, setMovieId] = useState("");
    const [movieData, setMovieData] = useState({
        name: "",
        coordinates: { x: "", y: "" },
        oscarsCount: "",
        usaBoxOffice: "",
        genre: "",
        mpaaRating: "",
        screenwriter: {
            name: "",
            height: "",
            eyeColor: "",
            hairColor: "",
            nationality: "",
            location: {
                x: "",
                y: "",
                name: ""
            }
        }
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const fetchMovieData = async (id) => {
        setIsFetching(true);
        setError(null);
        try {
            const response = await axios.get(`/lab2-1.0-SNAPSHOT/api/movies/${id}`);
            const movie = response.data;

            setMovieData(movie);
        } catch (err) {
            setError("Error fetching movie data. Please check the ID.");
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovieData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCoordinateChange = (e) => {
        const { name, value } = e.target;
        setMovieData((prevData) => ({
            ...prevData,
            coordinates: { ...prevData.coordinates, [name]: value },
        }));
    };

    const handleScreenwriterChange = (e) => {
        const { name, value } = e.target;
        setMovieData((prevData) => ({
            ...prevData,
            screenwriter: { ...prevData.screenwriter, [name]: value },
        }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setMovieData((prevData) => ({
            ...prevData,
            screenwriter: {
                ...prevData.screenwriter,
                location: { ...prevData.screenwriter.location, [name]: value }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await axios.put(`/lab2-1.0-SNAPSHOT/api/movies/${movieId}`, movieData);
            onMovieUpdated(); // Вызов функции для обновления таблицы
            setMovieId(""); // Сброс поля ID
            setMovieData({
                name: "",
                coordinates: { x: "", y: "" },
                oscarsCount: "",
                usaBoxOffice: "",
                genre: "",
                mpaaRating: "",
                screenwriter: {
                    name: "",
                    height: "",
                    eyeColor: "",
                    hairColor: "",
                    nationality: "",
                    location: {
                        x: "",
                        y: "",
                        name: ""
                    }
                }
            }); // Сброс остальных полей
        } catch (err) {
            setError("Error updating movie. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Update Movie</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                placeholder="Movie ID"
                value={movieId}
                onChange={(e) => {
                    setMovieId(e.target.value);
                    if (e.target.value) {
                        fetchMovieData(e.target.value); // Загружаем данные о фильме при изменении ID
                    } else {
                        // Сбросить данные, если поле ID очищено
                        setMovieData({
                            name: "",
                            coordinates: { x: "", y: "" },
                            oscarsCount: "",
                            usaBoxOffice: "",
                            genre: "",
                            mpaaRating: "",
                            screenwriter: {
                                name: "",
                                height: "",
                                eyeColor: "",
                                hairColor: "",
                                nationality: "",
                                location: {
                                    x: "",
                                    y: "",
                                    name: ""
                                }
                            }
                        });
                    }
                }}
                required
            />
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={movieData.name}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="oscarsCount"
                placeholder="Oscars Count"
                value={movieData.oscarsCount}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="usaBoxOffice"
                placeholder="USA Box Office"
                value={movieData.usaBoxOffice}
                onChange={handleChange}
                required
            />
            <select
                name="genre"
                value={movieData.genre}
                onChange={handleChange}
                required
            >
                <option value="">Select Genre</option>
                <option value={MovieGenre.WESTERN}>{MovieGenre.WESTERN}</option>
                <option value={MovieGenre.MUSICAL}>{MovieGenre.MUSICAL}</option>
                <option value={MovieGenre.ADVENTURE}>{MovieGenre.ADVENTURE}</option>
                <option value={MovieGenre.TRAGEDY}>{MovieGenre.TRAGEDY}</option>
            </select>

            <select name="mpaaRating" value={movieData.mpaaRating} onChange={handleChange}>
                <option value="">Select MPAA Rating</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG_13">PG-13</option>
                <option value="NC_17">NC-17</option>
            </select>

            <h3>Coordinates</h3>
            <input
                type="number"
                name="x"
                placeholder="Coordinates X"
                value={movieData.coordinates.x}
                onChange={handleCoordinateChange}
                required
            />
            <input
                type="number"
                name="y"
                placeholder="Coordinates Y"
                value={movieData.coordinates.y}
                onChange={handleCoordinateChange}
                required
            />

            <h3>Screenwriter</h3>
            <input
                type="text"
                name="name"
                placeholder="Screenwriter Name"
                value={movieData.screenwriter.name}
                onChange={handleScreenwriterChange}
                required
            />
            <input
                type="number"
                name="height"
                placeholder="Height"
                value={movieData.screenwriter.height}
                onChange={handleScreenwriterChange}
            />
            <select
                name="eyeColor"
                value={movieData.screenwriter.eyeColor}
                onChange={handleScreenwriterChange}
            >
                <option value="">Select Eye Color</option>
                <option value="GREEN">Green</option>
                <option value="RED">Red</option>
                <option value="BLACK">Black</option>
                <option value="WHITE">White</option>
                <option value="YELLOW">Yellow</option>
                <option value="ORANGE">Orange</option>
                <option value="BROWN">Brown</option>
            </select>
            <input
                type="text"
                name="hairColor"
                placeholder="Hair Color"
                value={movieData.screenwriter.hairColor}
                onChange={handleScreenwriterChange}
            />
            <select
                name="nationality"
                value={movieData.screenwriter.nationality}
                onChange={handleScreenwriterChange}
                required
            >
                <option value="">Select Nationality</option>
                <option value={Country.GERMANY}>{Country.GERMANY}</option>
                <option value={Country.VATICAN}>{Country.VATICAN}</option>
                <option value={Country.ITALY}>{Country.ITALY}</option>
                <option value={Country.SOUTH_KOREA}>{Country.SOUTH_KOREA}</option>
                <option value={Country.JAPAN}>{Country.JAPAN}</option>
            </select>
            <h4>Location</h4>
            <input
                type="number"
                name="x"
                placeholder="Location X"
                value={movieData.screenwriter.location.x}
                onChange={handleLocationChange}
                required
            />
            <input
                type="number"
                name="y"
                placeholder="Location Y"
                value={movieData.screenwriter.location.y}
                onChange={handleLocationChange}
                required
            />
            <input
                type="text"
                name="name"
                placeholder="Location Name"
                value={movieData.screenwriter.location.name}
                onChange={handleLocationChange}
                required
            />
            <button type="submit" disabled={isSubmitting || isFetching}>Update Movie</button>
            {isFetching && <p>Fetching movie data...</p>}
        </form>
    );
};

export default UpdateMovieForm;
