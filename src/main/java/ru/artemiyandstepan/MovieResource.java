package ru.artemiyandstepan;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.artemiyandstepan.model.Movie;

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
    public Response getAllMovies() {
        logger.info("Fetching all movies");
        return Response.ok(new ArrayList<>(movies.values())).build();
    }

    // Создать фильм
    @POST
    public Response createMovie(Movie movie) {
        if (movie == null || movie.getName() == null || movie.getName().isEmpty() ||
                movie.getCoordinates() == null || movie.getOscarsCount() <= 0 ||
                movie.getUsaBoxOffice() <= 0) {
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
}
