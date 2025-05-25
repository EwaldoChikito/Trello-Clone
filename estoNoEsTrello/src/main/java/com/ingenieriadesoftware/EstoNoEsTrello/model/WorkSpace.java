package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.util.ArrayList;
import java.util.Arrays;

public class WorkSpace {
    private Long id;
    private String name;
    private ArrayList<Block> blocks;

    public WorkSpace() {
    }

    public WorkSpace(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public WorkSpace(Long id, String name, ArrayList<Block> blocks) {
        this.id = id;
        this.name = name;
        this.blocks = blocks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<Block> getBlocks() {
        return blocks;
    }

    public void setBlocks(ArrayList<Block> blocks) {
        this.blocks = blocks;
    }
}
