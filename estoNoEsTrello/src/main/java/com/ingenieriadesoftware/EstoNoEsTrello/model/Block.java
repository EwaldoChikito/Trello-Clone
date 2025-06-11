package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.util.ArrayList;
import java.util.UUID;

public class Block {
    private Long id;
    private String name;
    private ArrayList<Card> cards;

    private static long idCounter = generate12DigitId();
    private static long generate12DigitId() {
        long id = UUID.randomUUID().getMostSignificantBits();
        return Math.abs(id % 999_999_999_999L) + 1; // +1 para evitar cero
    }

    public Block() {
    }

    public Block(Long id, String name) {
        this.id = id != null ? id : idCounter++;
        this.name = name;
    }

    public Block(Long id, String name, ArrayList<Card> cards) {
        this.id = id != null ? id : idCounter++;
        this.name = name;
        this.cards = cards;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<Card> getCards() {
        if (this.cards == null){
            return cards = new ArrayList<Card>();
        }
        return cards;
    }

    public void setCards(ArrayList<Card> cards) {
        this.cards = cards;
    }
}
