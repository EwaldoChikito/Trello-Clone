package com.ingenieriadesoftware.EstoNoEsTrello.model.Classes;
import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Exceptions.*;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Validation {

    public static boolean emailValidation(String email){
        Pattern pattern = Pattern.compile("[a-z]+\\.[0-9]{2}(@est.ucab.edu.ve)");
        Matcher matcher = pattern.matcher(email);
        return matcher.find();
    }

    public static boolean isEmailAlreadyUsed(String email){
        ArrayList<User> usersList = UserJsonController.findTotalUsers();
        boolean verificationResult = false;
        if(usersList == null){
            usersList = new ArrayList<User>();
        }
        for (int i=0; i<usersList.size();i++){
            if(usersList.get(i).getEmail().equals(email)){
                verificationResult = true;
            }
        }
        return verificationResult;
    }

    public static boolean isDataValid(String email, String password, LinkedList<User> usersList) throws InvalidEmail, InvalidPassword {
        for (User user : usersList) {
            if (user.getEmail().equals(email)) {
                if (user.getPassword().equals(password)){
                    return true;
                }
                throw new InvalidPassword();
            }
        }
        throw new InvalidEmail();
    }

    //BIG PROBLEM
    public static boolean verifyLogIn(String email, String password){
        ArrayList<User> usersList = UserJsonController.findTotalUsers();
        boolean verificationResult = false;
        if(usersList == null){
            usersList = new ArrayList<User>();
        }
        for (int i=0; i<usersList.size();i++){
            if(usersList.get(i).getEmail().equals(email) && usersList.get(i).getPassword().equals(password)){
                verificationResult = true;
            }
        }
        return verificationResult;
    }
}