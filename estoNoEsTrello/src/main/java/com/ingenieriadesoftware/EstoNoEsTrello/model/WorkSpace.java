package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.util.Arrays;

public class WorkSpace {
    private Long id;
    private String name;
    private Board[] boards;

    public WorkSpace() {
    }

    public WorkSpace(Long id, String name, Board[] boards) {
        this.id = id;
        this.name = name;
        this.boards = boards;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Board[] getBoards() {
        return boards;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBoards(Board[] boards) {
        this.boards = boards;
    }

    @Override
    public String toString() {
        return "WorkSpace{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", boards=" + Arrays.toString(boards) +
                '}';
    }
}
