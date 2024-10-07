package ru.artemiyandstepan.secondservice;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.artemiyandstepan.secondservice.model.Movie;
import ru.artemiyandstepan.secondservice.model.MovieDto;

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

    @Value("${app.first-service.base-url.movies}")
    private String moviesUrl;

    public MovieDto getAllMovies(int pageSize) {
        URI uri = URI.create(moviesUrl + "?size=" + pageSize);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(uri)
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();

        CompletableFuture<HttpResponse<String>> futureResponse = client.sendAsync(request, HttpResponse.BodyHandlers.ofString());

        return futureResponse.thenApply(response -> {
            if (response.statusCode() == 200) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    // Десериализация в MovieDto
                    return objectMapper.readValue(response.body(), new TypeReference<MovieDto>() {
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

    public List<Movie> getLoosers() {
        MovieDto response = getAllMovies(10);
        if (response.getTotalItems() > response.getItems().size()) {
            getAllMovies(response.getTotalItems() + 1);
        }
        return response.getItems().stream()
                .filter(movie -> movie.getOscarsCount() == 0)
                .toList();
    }
}
