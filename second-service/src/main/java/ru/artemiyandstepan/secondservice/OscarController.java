package ru.artemiyandstepan.secondservice;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.artemiyandstepan.secondservice.model.Movie;

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
}
