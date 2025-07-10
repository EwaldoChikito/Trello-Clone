package com.ingenieriadesoftware.EstoNoEsTrello.model;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class User {
    private String email;
    private String password;
    private ArrayList<WorkSpace> workspaces;

    public User(String email, String password, ArrayList<WorkSpace> workspaces) {
        this.email = email;
        this.workspaces = findUser(email).workspaces;

        if (workspaces == null){
            workspaces = new ArrayList<WorkSpace>();
        }
    }

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User() {
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ArrayList<WorkSpace> getWorkspaces() {
        if (this.workspaces == null){
            return workspaces = new ArrayList<WorkSpace>();
        }
        return workspaces;
    }

    public void setWorkspaces(ArrayList<WorkSpace> workspaces) {
        this.workspaces = workspaces;
    }
//Debe irse este metodo de acá
    public User findUser(String email) {
        ArrayList<User> usersList = UserJsonController.findTotalUsers();
        User userSelected = new User("","");
        if (usersList == null) {
            usersList = new ArrayList<User>();
        }
        for (int i = 0; i < usersList.size(); i++) {
            if (usersList.get(i).getEmail().equals(email))
                userSelected = usersList.get(i);
        }
        return userSelected;
    }

}