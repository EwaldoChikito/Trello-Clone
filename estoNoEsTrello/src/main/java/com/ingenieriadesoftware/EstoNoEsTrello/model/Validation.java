package com.ingenieriadesoftware.EstoNoEsTrello.model;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Validation {
    public static boolean emailValidation(String email){
        Pattern pattern= Pattern.compile("[a-z]+\\.[0-9]{2}(@est.ucab.edu.ve)");
        Matcher matcher= pattern.matcher(email);
        return matcher.find();
    }
}
