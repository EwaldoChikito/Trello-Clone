package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.util.Arrays;

public class List{
    private Long id;
    private String name;
    private Card[] cards;

    public List() {
    }

    public List(Long id, String name, Card[] cards) {
        this.id = id;
        this.name = name;
        this.cards = cards;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Card[] getCards() {
        return cards;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCards(Card[] cards) {
        this.cards = cards;
    }

    @Override
    public String toString() {
        return "List{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", cards=" + Arrays.toString(cards) +
                '}';
    }
}
