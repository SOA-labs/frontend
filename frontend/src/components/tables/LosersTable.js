// src/components/tables/LosersTable.js

import React from "react";

const LosersTable = ({ losers }) => {
    return (
        <div>
            <h3>Losers Table</h3>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Oscars Count</th>
                    <th>USA Box Office</th>
                    <th>Genre</th>
                    <th>MPAA Rating</th>
                    <th>Screenwriter Name</th>
                </tr>
                </thead>
                <tbody>
                {losers.length > 0 ? (
                    losers.map(movie => (
                        <tr key={movie.id}>
                            <td>{movie.id}</td>
                            <td>{movie.name}</td>
                            <td>{movie.oscarsCount}</td>
                            <td>{movie.usaBoxOffice}</td>
                            <td>{movie.genre}</td>
                            <td>{movie.mpaaRating}</td>
                            <td>{movie.screenwriter.name}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7">No movies found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default LosersTable;
