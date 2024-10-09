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

const EyeColor = {
    GREEN: "GREEN",
    RED: "RED",
    BLACK: "BLACK",
    WHITE: "WHITE"
}

const HairColor = {
    GREEN: "GREEN",
    YELLOW: "YELLOW",
    ORANGE: "ORANGE",
    WHITE: "WHITE",
    BROWN: "BROWN"
}

const MpaaRating = {
    G: "G",
    PG: "PG",
    PG_13: "PG_13",
    NC_17: "NC_17"
}

const CreateMovieForm = ({ onMovieCreated }) => {
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

    const handleNestedChange = (path, value) => {
        setMovieData((prevData) => {
            const keys = path.split('.');
            let newData = { ...prevData };
            let current = newData;
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    current[key] = value;
                } else {
                    current = current[key];
                }
            });
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await axios.post(`/lab2-1.0-SNAPSHOT/api/movies`, movieData);
            onMovieCreated(); // Вызов функции для обновления таблицы или списка
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
            }); // Сброс формы после успешного создания
        } catch (err) {
            setError("Error creating movie. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create Movie</h1>
            <h3>Movie</h3>
            {error && <p style={{color: "red"}}>{error}</p>}
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
                onChange={(e) => handleNestedChange("genre", e.target.value)}
                required
            >
                <option value="">Select MovieGenre</option>
                {Object.values(MovieGenre).map(movieGenre => (
                    <option key={movieGenre} value={movieGenre}>{movieGenre}</option>
                ))}
            </select>

            <select
                name="mpaaRating"
                value={movieData.screenwriter.mpaaRating}
                onChange={(e) => handleNestedChange("mpaaRating", e.target.value)}
                required
            >
                <option value="">Select MPAA Rating</option>
                {Object.values(MpaaRating).map(mpaaRating => (
                    <option key={mpaaRating} value={mpaaRating}>{mpaaRating}</option>
                ))}
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
                onChange={(e) => handleNestedChange("screenwriter.eyeColor", e.target.value)}
                required
            >
                <option value="">Select EyeColor</option>
                {Object.values(EyeColor).map(eyeColor => (
                    <option key={eyeColor} value={eyeColor}>{eyeColor}</option>
                ))}
            </select>
            <select
                name="hairColor"
                value={movieData.screenwriter.hairColor}
                onChange={(e) => handleNestedChange("screenwriter.hairColor", e.target.value)}
                required
            >
                <option value="">Select HairColor</option>
                {Object.values(HairColor).map(hairColor => (
                    <option key={hairColor} value={hairColor}>{hairColor}</option>
                ))}
            </select>
            <select
                name="nationality"
                value={movieData.screenwriter.nationality}
                onChange={(e) => handleNestedChange("screenwriter.nationality", e.target.value)}
                required
            >
                <option value="">Select Nationality</option>
                {Object.values(Country).map(country => (
                    <option key={country} value={country}>{country}</option>
                ))}
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
            <button type="submit" disabled={isSubmitting}>Create Movie</button>
        </form>
    );
};

export default CreateMovieForm;
