package com.ingenieriadesoftware.EstoNoEsTrello.model;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.stream.JsonReader;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.LinkedList;

public class UsersAdministrator {
    private LinkedList<User> users;
    final String FILE="src/main/java/com/ingenieriadesoftware/EstoNoEsTrello/JSONs/Users.json";

    public LinkedList<User> getUsers() {
        return users;
    }

    public void setUsers(LinkedList<User> users) {
        this.users = users;
    }

    public UsersAdministrator(String archive) {
        this.users = new LinkedList<>();
        pullUsers(archive);

    }

    public void pullUsers(String archive){
        try {
            Gson json = new Gson();
            JsonReader reader = new JsonReader(new FileReader(archive));
            User[] users= json.fromJson(reader,User[].class);
            reader.close();

            if (users==null){
                throw new JsonSyntaxException("Users-Array.json is empty or null");
            }

            this.users.addAll(Arrays.asList(users));

        } catch (IOException e){
            System.err.println("ERROR reading JSON files: "+e.getMessage());
        }catch (com.google.gson.JsonSyntaxException e){
            System.err.println("Json syntax error: "+e.getMessage());
        }
    }

    public void pushUsers(){
        try {
            new FileWriter(FILE, false).close();
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            FileWriter writer = new FileWriter(FILE);
            gson.toJson(users, writer);
            writer.close();

        }catch(Exception e){
            e.printStackTrace();
        }

    }

    public User giveUser(String username){
        int i=0;
        while (!username.equals(users.get(i).getEmail())){
            i++;
        }
        return users.get(i);
    }

}