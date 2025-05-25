package com.ingenieriadesoftware.EstoNoEsTrello.model;

import com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions.*;

public class Login {

    public User singIn (String username, String password, UsersAdministrator usersAdministrator){
        try{
            if (!Validation.isUsernameEmpty(username)){
                if (Validation.isDataValid(username, password,usersAdministrator.getUsers())){
                    return usersAdministrator.giveUser(username);
                }
            }
        }catch(EmptyUsername | InvalidPassword | InvalidUsername err){
            System.err.println(err.toString());
        }
        return null;
    }

    public static void register(String username, String email, String password, UsersAdministrator usersAdministrator){
        try{
            if (!Validation.isUsernameEmpty(username)){
                if (!Validation.isUsernameAlreadyUsed(email, usersAdministrator)){
                    if (!Validation.isEmailEmpty(email)){
                        if (Validation.emailValidation(email)){
                            if (!Validation.isEmailAlreadyUsed(email,usersAdministrator)) {
                                if (!Validation.isPasswordEmpty(password)) {
                                    usersAdministrator.getUsers().addFirst(new User(username,email,password));
                                }
                            }
                        }
                    }
                }
            }
        }catch (EmptyUsername | UsernameAlreadyUsed | EmptyEmail | InvalidEmail | EmailAlreadyUsed | EmptyPassword err){
            System.err.println(err.toString());
        }
    }
}
