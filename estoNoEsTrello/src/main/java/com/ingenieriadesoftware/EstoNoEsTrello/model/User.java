package com.ingenieriadesoftware.EstoNoEsTrello.model;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;

import java.util.ArrayList;

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
        return workspaces;
    }

    public ArrayList<WorkSpace> getWorkspaces(String correo) {
        this.workspaces = findUser(correo).workspaces;
        if (workspaces==null){
            workspaces=new ArrayList<WorkSpace>();
        }
        return workspaces;
    }

    public void setWorkspaces(ArrayList<WorkSpace> workspaces) {
        this.workspaces = workspaces;
    }

    public User findUser(String email) {
        ArrayList<User> usersList = new ArrayList<User>();
        User userSelected= new User("","");
        usersList= UserJsonController.findTotalUsers();
        if (usersList == null){
            usersList = new ArrayList<User>();
        }
        for (int i=0;i<usersList.size();i++)
        {
            if (usersList.get(i).getEmail().equals(email))
                userSelected=usersList.get(i);
        }
        return userSelected;
    }
//    @Override
//    public String toString() {
//        return "User{" +
//                "email: " + email + '\'' +
//                "Workspaces=" + Arrays.toString(workspaces) +
//                '}';


}
