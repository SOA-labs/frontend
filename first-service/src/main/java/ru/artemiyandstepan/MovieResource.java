package ru.artemiyandstepan;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.artemiyandstepan.model.*;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Path("/movies")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MovieResource {
    private static final Logger logger = LogManager.getLogger(MovieResource.class);
    private static Map<Integer, Movie> movies = new HashMap<>();
    private static AtomicInteger idCounter = new AtomicInteger();

    // Получить все фильмы
    @GET
    public Response getAllMovies(@QueryParam("sortFields") String sortFields, @QueryParam("sortOrder") String sortOrder, @QueryParam("page") @DefaultValue("0") int page, @QueryParam("size") @DefaultValue("10") int size, @QueryParam("name") String nameFilter, @QueryParam("minOscarsCount") Long minOscarsCount, @QueryParam("maxOscarsCount") Long maxOscarsCount, @QueryParam("minBoxOffice") Integer minBoxOffice, @QueryParam("maxBoxOffice") Integer maxBoxOffice, @QueryParam("genre") MovieGenre genreFilter, @QueryParam("mpaaRating") MpaaRating mpaaRatingFilter) {

        logger.info("Fetching all movies with filters");

        List<Movie> filteredMovies = new ArrayList<>(movies.values());

        // Фильтры
        if (nameFilter != null && !nameFilter.isEmpty()) {
            filteredMovies.removeIf(movie -> !movie.getName().toLowerCase().contains(nameFilter.toLowerCase()));
            logger.info("Applied filter name: {}", nameFilter);
        }
        if (minOscarsCount != null) {
            filteredMovies.removeIf(movie -> movie.getOscarsCount() < minOscarsCount);
            logger.info("Applied filter minOscarsCount: {}", minOscarsCount);
        }
        if (maxOscarsCount != null) {
            filteredMovies.removeIf(movie -> movie.getOscarsCount() > maxOscarsCount);
            logger.info("Applied filter maxOscarsCount: {}", maxOscarsCount);
        }
        if (minBoxOffice != null) {
            filteredMovies.removeIf(movie -> movie.getUsaBoxOffice() < minBoxOffice);
            logger.info("Applied filter minBoxOffice: {}", minBoxOffice);
        }
        if (maxBoxOffice != null) {
            filteredMovies.removeIf(movie -> movie.getUsaBoxOffice() > maxBoxOffice);
            logger.info("Applied filter maxBoxOffice: {}", maxBoxOffice);
        }
        if (genreFilter != null) {
            filteredMovies.removeIf(movie -> !movie.getGenre().equals(genreFilter));
            logger.info("Applied filter genreFilter: {}", genreFilter);
        }
        if (mpaaRatingFilter != null) {
            filteredMovies.removeIf(movie -> !movie.getMpaaRating().equals(mpaaRatingFilter));
            logger.info("Applied filter mpaaRatingFilter: {}", mpaaRatingFilter);
        }

        // Сортировка по нескольким полям
        if (sortFields != null && !sortFields.isEmpty()) {
            String[] fields = sortFields.split(",");
            filteredMovies.sort((movie1, movie2) -> {
                for (String field : fields) {
                    int comparison = compareMovies(movie1, movie2, field);
                    logger.info("Sorted by: {}", field);
                    if (comparison != 0) {
                        return "desc".equalsIgnoreCase(sortOrder) ? -comparison : comparison;
                    }
                }
                return 0; // Если поля равны
            });
        }

        // Постраничный вывод
        int totalMovies = filteredMovies.size();
        int start = Math.min(page * size, totalMovies);
        int end = Math.min((page + 1) * size, totalMovies);
        List<Movie> paginatedMovies = filteredMovies.subList(start, end);

        return Response.ok().entity(new ResponseByPages<>(paginatedMovies, totalMovies, page, size)).build();
    }

    // Функция для сравнения по указанному полю
    private int compareMovies(Movie movie1, Movie movie2, String field) {
        return switch (field) {
            case "name" -> movie1.getName().compareTo(movie2.getName());
            case "oscarsCount" -> Long.compare(movie1.getOscarsCount(), movie2.getOscarsCount());
            case "usaBoxOffice" -> Integer.compare(movie1.getUsaBoxOffice(), movie2.getUsaBoxOffice());
            case "creationDate" -> movie1.getCreationDate().compareTo(movie2.getCreationDate());
            default -> throw new IllegalArgumentException("Invalid sort field: " + field);
        };
    }

    private boolean checkMovie(Movie movie){
        if (movie == null || movie.getName() == null || movie.getName().isEmpty() || movie.getCoordinates() == null || movie.getOscarsCount() < 0 || movie.getUsaBoxOffice() <= 0) {
            logger.info("bad movie data: {}", movie);
            return false;
        }
        return checkScreenwriter(movie.getScreenwriter());
    }

    private boolean checkScreenwriter(Person screenwriter){
        if (screenwriter == null || screenwriter.getName() == null || screenwriter.getHeight() == null || screenwriter.getEyeColor() == null) {
            logger.info("bad screenwriter data {}", screenwriter);
            return false;
        }
        return checkLocation(screenwriter.getLocation());
    }

    private boolean checkLocation(Location location){
        if (location == null || location.getName() == null || location.getX() == null){
            logger.info("bad location data: {}", location);
            return false;
        }

        return true;
    }




    // Создать фильм
    @POST
    public Response createMovie(Movie movie) {
        if (!checkMovie(movie)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        movie.setId(idCounter.incrementAndGet());
        movie.setCreationDate(new Date());
        movies.put(movie.getId(), movie);
        logger.info("Movie created: {}", movie);
        return Response.status(Response.Status.CREATED).entity(movie).build();
    }

    // Получить фильм по его id
    @GET
    @Path("/{id}")
    public Response getMovieById(@PathParam("id") int id) {
        Movie movie = movies.get(id);
        if (movie == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(movie).build();
    }

    // Обновить фильм по его id
    @PUT
    @Path("/{id}")
    public Response updateMovie(@PathParam("id") int id, Movie updatedMovie) {
        Movie existingMovie = movies.get(id);
        if (existingMovie == null || updatedMovie == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (!checkMovie(updatedMovie)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        updatedMovie.setId(id);
        updatedMovie.setCreationDate(existingMovie.getCreationDate());
        movies.put(id, updatedMovie);
        logger.info("Movie updated: {}", updatedMovie);
        return Response.ok(updatedMovie).build();
    }

    // Удалить фильма по его id
    @DELETE
    @Path("/{id}")
    public Response deleteMovie(@PathParam("id") int id) {
        Movie movie = movies.remove(id);
        if (movie == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        logger.info("Movie deleted by id {}", id);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    // Получить сумму сборов
    @GET
    @Path("/sum-usa-box-office")
    public Response getSumUsaBoxOffice() {
        long sum = movies.values().stream().mapToLong(Movie::getUsaBoxOffice).sum();
        return Response.ok(sum).build();
    }

    // Получить фильмы, в названии которых содержится заданная подстрока
    //    (фильтр по имени работает также бтв)
    @GET
    @Path("/movie-by-name")
    public Response getMoviesByNameSubstring(@QueryParam("substring") String substring) {
        if (substring == null || substring.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Substring cannot be empty").build();
        }

        logger.info("Fetching movies with name containing substring: {}", substring);

        // Фильтрация
        List<Movie> filteredMovies = movies.values().stream().filter(movie -> movie.getName().toLowerCase().contains(substring.toLowerCase())).toList();

        return Response.ok(filteredMovies).build();
    }

    // Получить список сценаристов, рост которых выше заданного
    @GET
    @Path("/screenwriters/taller-than")
    public Response getScreenwritersTallerThan(@QueryParam("height") double height) {
        logger.info("Fetching movies where screenwriters are taller than: {}", height);

        long movieCount = movies.values().stream().filter(movie -> movie.getScreenwriter() != null && movie.getScreenwriter().getHeight() != null && movie.getScreenwriter().getHeight() > height).count();

        return Response.ok(movieCount).build();
    }

}
