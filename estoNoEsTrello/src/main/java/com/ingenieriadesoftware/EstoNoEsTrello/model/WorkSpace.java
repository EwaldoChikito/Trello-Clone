package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.util.Arrays;

public class WorkSpace {
    private Long id;
    private String name;
    private Block[] blocks;

    public WorkSpace() {
    }

    public WorkSpace(Long id, String name, Block[] boards) {
        this.id = id;
        this.name = name;
        this.blocks = boards;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Block[] getBoards() {
        return blocks;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBoards(Block[] boards) {
        this.blocks = boards;
    }

    @Override
    public String toString() {
        return "WorkSpace{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", boards=" + Arrays.toString(blocks) +
                '}';
    }
}
