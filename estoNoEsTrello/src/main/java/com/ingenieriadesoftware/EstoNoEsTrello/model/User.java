package com.ingenieriadesoftware.EstoNoEsTrello.model;

import java.util.Arrays;

public class User {
    private String username;
    private String email;
    private WorkSpace[] workspaces;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
                "username: " + username +
                ", email: " + email + '\'' +
                "Workspaces=" + Arrays.toString(workspaces) +
                '}';
    }

}