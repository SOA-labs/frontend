package ru.artemiyandstepan.secondservice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.artemiyandstepan.secondservice.model.Movie;
import ru.artemiyandstepan.secondservice.model.MovieDto;
import ru.artemiyandstepan.secondservice.model.MovieGenre;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class OscarService {
    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${app.first-service.base-url.movies}")
    private String moviesUrl;

    public MovieDto getMoviesPageable(int pageSize) {
        log.info("Request for {} movies from {}", pageSize, moviesUrl);
        URI uri = URI.create(moviesUrl + "?size=" + pageSize);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(uri)
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();

        CompletableFuture<HttpResponse<String>> futureResponse = client.sendAsync(request, HttpResponse.BodyHandlers.ofString());

        return futureResponse.thenApply(response -> {
            if (response.statusCode() == 200) {
                try {
                    // Десериализация в MovieDto
                    return mapper.readValue(response.body(), new TypeReference<MovieDto>() {
                    });
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                    return null;
                }
            } else {
                log.error("Request failed with status code: {}", response.statusCode());
                return null;
            }
        }).join();
    }

    private MovieDto getAllMovies() {
        MovieDto response = this.getMoviesPageable(100);
        if (response.getTotalItems() > response.getItems().size()) {
            this.getMoviesPageable(response.getTotalItems() + 1);
        }
        return response;
    }

    public List<Movie> getLoosers() {
        log.info("Request for loosers");
        MovieDto response = getAllMovies();
        return response.getItems().stream()
                .filter(movie -> movie.getOscarsCount() == 0)
                .toList();
    }

    public void humiliateByGenre(MovieGenre genre) {
        log.info("Request for humiliate by genre");
        MovieDto response = getAllMovies();
        response.getItems().stream()
                .filter(movie -> movie.getGenre().equals(genre))
                .filter(movie -> movie.getOscarsCount() != 0)
                .peek(movie -> movie.setOscarsCount(0))
                .forEach(this::voidUpdateMovies);
    }

    private void voidUpdateMovies(Movie movie) {
        log.info("Updating movie with id={}", movie.getId());
        URI uri = URI.create(moviesUrl + "/" + movie.getId());
        try {
            String body = mapper.writeValueAsString(movie);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .PUT(HttpRequest.BodyPublishers.ofString(body))
                    .setHeader("Content-Type", "application/json")
                    .build();
            CompletableFuture<HttpResponse<String>> completableFuture = client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
            int code = completableFuture.thenApply(HttpResponse::statusCode).join();
            System.out.println(code);
        } catch (JsonProcessingException ignored) {
        }
    }
}
