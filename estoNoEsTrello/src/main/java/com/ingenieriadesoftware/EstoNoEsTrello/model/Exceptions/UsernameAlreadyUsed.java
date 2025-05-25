package com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions;

public class UsernameAlreadyUsed extends RuntimeException {
    public UsernameAlreadyUsed() {
        super("ERROR: Username already exists, please try another one");
    }
}
