package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.UUID;

public class WorkSpace {
    private Long id;
    private String name;
    private String description;
    private ArrayList<Block> blocks;
    private static long idCounter = UUID.randomUUID().getMostSignificantBits() & Long.MAX_VALUE;


    public WorkSpace() {
    }

    public WorkSpace(String name, String description) {
//
//      this.id = UUID.randomUUID().getMostSignificantBits() & Long.MAX_VALUE; // Generate a random ID
//      this.name = name;
//      this.description = description;

//        if (id == null){
//            this.id = 2L;
//        }
//        else{
//            this.id = id;
//        }
        this.id = id != null ? id : idCounter++;
        this.name = name;
        this.description = description;
    }

    public WorkSpace(Long id, String name, String description, ArrayList<Block> blocks) {

//        if (id == null){
//            this.id = 1L;
//        }
//        else{
//            this.id = id;
//        }
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
