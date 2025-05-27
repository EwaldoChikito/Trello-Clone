package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.UUID;

public class WorkSpace {
    private Long id;
    private String name;
    private String description;
    private ArrayList<Block> blocks;

    private static long idCounter = generate12DigitId();
    private static long generate12DigitId() {
        long id = UUID.randomUUID().getMostSignificantBits();
        return Math.abs(id % 999_999_999_999L) + 1; // +1 para evitar cero
    }

    public WorkSpace() {
    }

    public WorkSpace(String name, String description) {
        this.id = id != null ? id : idCounter++;
        this.name = name;
        this.description = description;
    }

    public WorkSpace(Long id, String name, String description, ArrayList<Block> blocks) {
        this.id = id != null ? id : idCounter++;
        this.name = name;
        this.description = description;
        this.blocks = blocks;
    }

    public Long getId() {
        return id;
    }

    private void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ArrayList<Block> getBlocks() {
        return blocks;
    }

    public void setBlocks(ArrayList<Block> blocks) {
        this.blocks = blocks;
    }
}
