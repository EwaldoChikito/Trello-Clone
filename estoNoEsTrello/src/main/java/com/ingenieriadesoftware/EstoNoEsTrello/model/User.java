package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.util.Arrays;

public class User {
    private String email;
    private String password;
    private WorkSpace[] workspaces;

    public User(String email, String password) {
        this.email = email;
        this.password = password;
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

    public WorkSpace[] getWorkspaces() {
        return workspaces;
    }

    public void setWorkspaces() {
        this.workspaces = new WorkSpace[15];
    }

    @Override
    public String toString() {
        return "User{" +
                "email: " + email + '\'' +
                "Workspaces=" + Arrays.toString(workspaces) +
                '}';
    }

}