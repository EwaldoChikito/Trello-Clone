package com.ingenieriadesoftware.EstoNoEsTrello.model;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions.*;

import java.util.LinkedList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Validation {

    public static boolean emailValidation(String email) throws InvalidEmail {
        Pattern pattern = Pattern.compile("[a-z]+\\.[0-9]{2}(@est.ucab.edu.ve)");
        Matcher matcher = pattern.matcher(email);
        if (matcher.find()){
            return true;
        }
        else{
            throw new InvalidEmail();
        }
    }

    public static boolean isEmailEmpty(String email) throws EmptyEmail{
        if (email.isEmpty()){
            throw new EmptyEmail();
        }else {
            return false;
        }
    }

    public static boolean isUsernameEmpty(String username) throws EmptyUsername{
        if (username.isEmpty()){
            throw new EmptyUsername();
        }
        else {
            return false;
        }
    }

    public static boolean isPasswordEmpty(String password) throws EmptyPassword{
        if (password.isEmpty()){
            throw new EmptyPassword();
        }
        else{
            return false;
        }
    }

    public static boolean isUsernameAlreadyUsed(String username, UsersAdministrator usersList) throws UsernameAlreadyUsed {
        for (User user : usersList.getUsers()) {
            if (user.getUsername().equals(username)) {
                throw new UsernameAlreadyUsed();
            }
        }
        return false;
    }

    public static boolean isEmailAlreadyUsed(String email, UsersAdministrator usersList) throws EmailAlreadyUsed {
        for (User user : usersList.getUsers()) {
            if (user.getEmail().equals(email)) {
                throw new EmailAlreadyUsed();
            }
        }
        return false;
    }

    public static boolean isDataValid(String username, String password, LinkedList<User> usersList) throws InvalidUsername, InvalidPassword {
        for (User user : usersList) {
            if (user.getUsername().equals(username)) {
                if (user.getPassword().equals(password)){
                    return true;
                }
                throw new InvalidPassword();
            }
        }
        throw new InvalidUsername();
    }
}