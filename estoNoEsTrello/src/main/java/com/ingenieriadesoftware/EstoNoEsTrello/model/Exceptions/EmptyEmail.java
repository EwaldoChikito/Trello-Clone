package com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions;

public class EmptyEmail extends RuntimeException {
    public EmptyEmail() {
        super("ERROR: Empty email");
    }
}
