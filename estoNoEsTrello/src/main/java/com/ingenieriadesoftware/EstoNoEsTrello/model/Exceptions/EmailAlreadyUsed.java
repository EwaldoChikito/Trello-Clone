package com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions;

public class EmailAlreadyUsed extends RuntimeException {
    public EmailAlreadyUsed() {
        super("ERROR: Email Already used, please try another one");
    }
}
