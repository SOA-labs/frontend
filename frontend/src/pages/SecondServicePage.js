// src/pages/SecondServicePage.js

import React, { useState } from "react";
import axios from "axios";
import LosersTable from "../components/tables/LosersTable";

const SecondServicePage = () => {
    const [losers, setLosers] = useState([]);
    const [genre, setGenre] = useState("WESTERN");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchLosers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("/second-service-0.1/v1/oscar/screenwriters/get-loosers");
            setLosers(response.data);
        } catch (err) {
            console.error("Error fetching losers:", err);
            setError("Error fetching movies without Oscars. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const humiliateByGenre = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.post(`/second-service-0.1/v1/oscar/directors/humiliate-by-genre/${genre}`);
            fetchLosers();
        } catch (err) {
            console.error("Error humiliating by genre:", err);
            setError("Error humiliating movies by genre. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Movies Without Oscars</h1>
            <button onClick={fetchLosers} disabled={isLoading}>
                {isLoading ? "Loading..." : "Get Losers"}
            </button>
            {losers.length > 0 && !isLoading && (
                <LosersTable losers={losers} />
            )}
            {losers.length === 0 && !isLoading && (
                <p>No movies found without Oscars. Please click "Get Losers".</p>
            )}

            <h2>Humiliate Movies by Genre</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                humiliateByGenre();
            }}>
                <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                    <option value="WESTERN">Western</option>
                    <option value="MUSICAL">Musical</option>
                    <option value="ADVENTURE">Adventure</option>
                    <option value="TRAGEDY">Tragedy</option>
                </select>
                <button type="submit">Humiliate</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default SecondServicePage;
