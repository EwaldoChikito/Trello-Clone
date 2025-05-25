package com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions;

public class EmptyUsername extends RuntimeException {
    public EmptyUsername() {
        super("ERROR: Empty username");
    }
}
