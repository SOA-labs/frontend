package ru.artemiyandstepan.secondservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.Date;

enum MpaaRating {
    G, PG, PG_13, NC_17
}

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
public class Movie {
    private int id;
    private String name;
    private Coordinates coordinates;
    private Date creationDate;
    private long oscarsCount;
    private int usaBoxOffice;
    private MovieGenre genre;
    private MpaaRating mpaaRating;
    private Person screenwriter;
}

@Setter
@Getter
@AllArgsConstructor
@RequiredArgsConstructor
class Coordinates {
    private long x;
    private Long y;
}