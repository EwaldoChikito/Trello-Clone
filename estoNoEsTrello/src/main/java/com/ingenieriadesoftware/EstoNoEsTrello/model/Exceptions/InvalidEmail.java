package com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions;

public class InvalidEmail extends RuntimeException {
    public InvalidEmail() {
        super("ERROR: Invalid Email. It has to be an UCAB email");
    }
}
