package ru.artemiyandstepan.secondservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

enum Country {
    GERMANY, VATICAN, ITALY, SOUTH_KOREA, JAPAN
}

enum Color {
    GREEN, RED, BLACK, WHITE, YELLOW, ORANGE, BROWN
}

@Setter
@Getter
@AllArgsConstructor
@RequiredArgsConstructor
public class Person {
    private String name;
    private Double height;
    private Color eyeColor;
    private Color hairColor;
    private Country nationality;
    private Location location;
}

@Setter
@Getter
@AllArgsConstructor
@RequiredArgsConstructor
class Location {
    private Double x;
    private float y;
    private String name;
}