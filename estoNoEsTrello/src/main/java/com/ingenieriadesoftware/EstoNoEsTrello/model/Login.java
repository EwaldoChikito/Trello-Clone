package com.ingenieriadesoftware.EstoNoEsTrello.model;

import com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions.*;

public class Login {

    public User singIn (String email, String password, UsersAdministrator usersAdministrator){
        try{
            if (!Validation.isEmailEmpty(email)){
                if (Validation.isDataValid(email, password,usersAdministrator.getUsers())){
                    return usersAdministrator.giveUser(email);
                }
            }
        }catch(EmptyUsername | InvalidPassword | InvalidUsername err){
            System.err.println(err.toString());
        }
        return null;
    }

    public static void register(String email, String password, UsersAdministrator usersAdministrator){
        try{
            if (!Validation.isEmailEmpty(email)){
                if (Validation.emailValidation(email)){
                    if (!Validation.isEmailAlreadyUsed(email,usersAdministrator)) {
                        if (!Validation.isPasswordEmpty(password)) {
                            usersAdministrator.getUsers().addFirst(new User(email,password));
                        }
                    }
                }
            }
        }catch (EmptyEmail | InvalidEmail | EmailAlreadyUsed | EmptyPassword err){
            System.err.println(err.toString());
        }
    }
}
