import React, { useEffect, useState } from "react";
import axios from "axios";

const MovieTable = () => {
    const [movies, setMovies] = useState([]); // Массив для хранения фильмов
    const [filters, setFilters] = useState({
        name: "",
        minOscarsCount: null,
        maxOscarsCount: null,
        minBoxOffice: null,
        maxBoxOffice: null,
        genre: "",
        mpaaRating: ""
    }); // Состояние фильтров
    const [sortFields, setSortFields] = useState([]); // Состояние полей сортировки
    const [sortOrder, setSortOrder] = useState("asc"); // Состояние порядка сортировки
    const [page, setPage] = useState(0); // Текущая страница
    const [size, setSize] = useState(10); // Количество записей на странице
    const [totalMovies, setTotalMovies] = useState(0); // Общее количество фильмов

    useEffect(() => {
        fetchMovies(); // Загружаем фильмы при изменении состояния фильтров, сортировки и страницы
    }, [sortFields, sortOrder, page, size, filters]);

    const fetchMovies = async () => {
        // Формируем параметры для запроса
        const params = {
            sortFields: sortFields.join(",") || undefined,
            sortOrder: sortOrder || undefined,
            page: page || 0,
            size: size || 10,
            name: filters.name || undefined,
            minOscarsCount: filters.minOscarsCount || undefined,
            maxOscarsCount: filters.maxOscarsCount || undefined,
            minBoxOffice: filters.minBoxOffice || undefined,
            maxBoxOffice: filters.maxBoxOffice || undefined,
            genre: filters.genre || undefined,
            mpaaRating: filters.mpaaRating || undefined
        };

        try {
            // Получаем данные о фильмах с сервера
            const response = await axios.get("/web-module-1.0-SNAPSHOT/api/movies", { params });
            console.log("Response data:", response.data); // Логируем ответ для отладки
            if (Array.isArray(response.data)) {
                // Если получаем массив, обновляем состояния
                setMovies(response.data);
                setTotalMovies(response.data.length); // Обновляем общее количество фильмов
            } else {
                console.error("Expected an array of movies, but got:", response.data);
                setMovies([]);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            setMovies([]);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value })); // Обновляем фильтры
    };

    const handleSortChange = (e) => {
        const field = e.target.value;
        if (sortFields.includes(field)) {
            setSortFields(sortFields.filter(f => f !== field)); // Убираем поле сортировки
        } else {
            setSortFields([...sortFields, field]); // Добавляем поле в сортировку
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === "asc" ? "desc" : "asc")); // Переключаем порядок сортировки
    };

    const handleSizeChange = (e) => {
        setSize(e.target.value);
        setPage(0); // Сбрасываем страницу на первую при изменении размера
    };

    return (
        <div>
            <h1>Movie List</h1>
            <h3>Filters:</h3>
            <input
                type="text"
                name="name"
                placeholder="Filter by name"
                value={filters.name}
                onChange={handleFilterChange}
            />
            <input
                type="number"
                name="minOscarsCount"
                placeholder="Min Oscars Count"
                value={filters.minOscarsCount || ""}
                onChange={handleFilterChange}
            />
            <input
                type="number"
                name="maxOscarsCount"
                placeholder="Max Oscars Count"
                value={filters.maxOscarsCount || ""}
                onChange={handleFilterChange}
            />
            <input
                type="number"
                name="minBoxOffice"
                placeholder="Min Box Office"
                value={filters.minBoxOffice || ""}
                onChange={handleFilterChange}
            />
            <input
                type="number"
                name="maxBoxOffice"
                placeholder="Max Box Office"
                value={filters.maxBoxOffice || ""}
                onChange={handleFilterChange}
            />
            <input
                type="text"
                name="genre"
                placeholder="Filter by genre"
                value={filters.genre}
                onChange={handleFilterChange}
            />
            <input
                type="text"
                name="mpaaRating"
                placeholder="Filter by MPAA Rating"
                value={filters.mpaaRating}
                onChange={handleFilterChange}
            />

            <div>
                <h3>Sort by:</h3>
                <label>
                    <input
                        type="checkbox"
                        value="name"
                        checked={sortFields.includes("name")}
                        onChange={handleSortChange}
                    />
                    Name
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="oscarsCount"
                        checked={sortFields.includes("oscarsCount")}
                        onChange={handleSortChange}
                    />
                    Oscars Count
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="usaBoxOffice"
                        checked={sortFields.includes("usaBoxOffice")}
                        onChange={handleSortChange}
                    />
                    USA Box Office
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="creationDate"
                        checked={sortFields.includes("creationDate")}
                        onChange={handleSortChange}
                    />
                    Creation Date
                </label>
                <button onClick={toggleSortOrder}>
                    Toggle Sort Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
                </button>
            </div>

            <label>
                Rows per page:
                <select value={size} onChange={handleSizeChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </label>

            <h3>Table</h3>
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
                {movies.length > 0 ? (
                    movies.map(movie => (
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

            <div>
                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                >
                    Previous
                </button>
                <span>Page: {page + 1}</span>
                <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={(page + 1) * size >= totalMovies}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MovieTable;
