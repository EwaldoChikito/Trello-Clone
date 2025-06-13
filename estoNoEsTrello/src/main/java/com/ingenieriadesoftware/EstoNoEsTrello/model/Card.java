package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.time.LocalDate;
import java.util.UUID;

public class Card {
    private Long id;
    private String name;
    private String description;
    private LocalDate creationDate;
    private LocalDate finalDate;
//    private boolean status;
    private static long idCounter = generate12DigitId();
    private static long generate12DigitId() {
        long id = UUID.randomUUID().getMostSignificantBits();
        return Math.abs(id % 999_999_999_999L) + 1; // +1 para evitar cero
    }

    public Card() {
    }

    public Card(Long id, String name, String description, LocalDate creationDate, LocalDate finalDate) {
        this.id = id != null ? id : idCounter++;
        this.name = name;
        this.description = description;
        this.creationDate = creationDate;
        this.finalDate = finalDate;
    }

//    public Card(Long id, String name, String description, LocalDate creationDate, LocalDate finalDate, boolean status) {
//        this.id = id;
//        this.name = name;
//        this.description = description;
//        this.creationDate = creationDate;
//        this.finalDate = finalDate;
//    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDate getFinalDate() {
        return finalDate;
    }

    public void setFinalDate(LocalDate finalDate) {
        this.finalDate = finalDate;
    }

//    public boolean isStatus() {
//        return status;
//    }
//
//    public void setStatus(boolean status) {
//        this.status = status;
//    }

    public Card(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Card{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}

