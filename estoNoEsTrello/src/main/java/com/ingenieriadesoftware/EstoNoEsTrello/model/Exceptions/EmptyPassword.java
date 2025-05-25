package com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions;

public class EmptyPassword extends RuntimeException {
    public EmptyPassword() {
        super("ERROR: Empty password");
    }
}
