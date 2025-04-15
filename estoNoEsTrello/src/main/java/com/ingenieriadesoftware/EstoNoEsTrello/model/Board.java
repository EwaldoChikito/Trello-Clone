package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.util.Arrays;

public class Board {
    private Long id;
    private String name;
    private List[] lists;

    public Board() {
    }

    public Board(Long id, String name, List[] lists) {
        this.id = id;
        this.name = name;
        this.lists = lists;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List[] getLists() {
        return lists;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLists(List[] lists) {
        this.lists = lists;
    }

    @Override
    public String toString() {
        return "Board{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", lists=" + Arrays.toString(lists) +
                '}';
    }
}
