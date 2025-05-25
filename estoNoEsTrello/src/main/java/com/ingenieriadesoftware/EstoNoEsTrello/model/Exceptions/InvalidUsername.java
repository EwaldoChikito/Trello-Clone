package com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions;

public class InvalidUsername extends RuntimeException {
    public InvalidUsername() {
        super("ERROR: Username not exists");
    }
}
