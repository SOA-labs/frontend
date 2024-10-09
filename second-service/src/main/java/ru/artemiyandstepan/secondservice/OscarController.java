package ru.artemiyandstepan.secondservice;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import ru.artemiyandstepan.secondservice.model.Movie;
import ru.artemiyandstepan.secondservice.model.MovieGenre;

import java.util.List;

@Service
@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-url}")
public class OscarController {

    private final OscarService oscarService;

    @GetMapping("screenwriters/get-loosers")
    public ResponseEntity<List<Movie>> getLoosers() {
        return ResponseEntity.ok(oscarService.getLoosers());
    }

    @PostMapping("directors/humiliate-by-genre/{genre}")
    public ResponseEntity<String> humiliateByGenre(
            @PathVariable String genre
    ) {
        genre = genre.toUpperCase();
        try {
            oscarService.humiliateByGenre(MovieGenre.valueOf(genre));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid genre: " + genre);
        }
        return ResponseEntity.ok("Oscars were successfully taken away");
    }
}
