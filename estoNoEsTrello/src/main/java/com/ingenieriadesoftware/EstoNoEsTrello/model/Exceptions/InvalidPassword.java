package com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions;

public class InvalidPassword extends RuntimeException {
    public InvalidPassword() {
        super("ERROR: Invalid Password for that Username");
    }
}
