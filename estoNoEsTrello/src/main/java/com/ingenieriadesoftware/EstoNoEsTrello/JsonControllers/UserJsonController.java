package com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;
import com.ingenieriadesoftware.EstoNoEsTrello.model.WorkSpace;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.io.IOException;
import java.io.StringWriter;


public class UserJsonController extends User {

    public UserJsonController(String email, String password, ArrayList<WorkSpace> workspaces) {
        super(email, password, workspaces);
    }

    static public void saveUser(User user){
        try {
            Gson gson = new Gson();
            JsonReader reader = new JsonReader(new FileReader("C://Users//alber//Documents//GitHub//Trello-Clone//estoNoEsTrello//src//main//java//com//ingenieriadesoftware//EstoNoEsTrello//Json//user.json"));
            User[] users = gson.fromJson(reader, User[].class);
            List<User> userList= new ArrayList<>(Arrays.asList(users));

            userList.add(user);

            FileWriter fw = new FileWriter("C://Users//alber//Documents//GitHub//Trello-Clone//estoNoEsTrello//src//main//java//com//ingenieriadesoftware//EstoNoEsTrello//Json//user.json");
            StringWriter sw = new StringWriter();
            sw.write(gson.toJson(userList));
            fw.write(sw.toString());
            fw.close();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    static public ArrayList<User> findTotalUsers(){
        try {
            Gson gson = new Gson();
            JsonReader reader = new JsonReader(new FileReader("C://Users//alber//Documents//GitHub//Trello-Clone//estoNoEsTrello//src//main//java//com//ingenieriadesoftware//EstoNoEsTrello//Json//user.json"));
            reader.toString();
            User[] users = gson.fromJson(reader, User[].class);

            if (users == null || users.length == 0) {
                return new ArrayList<>(); // Retorna un ArrayList vacío
            }
            ArrayList<User> usersList = new ArrayList<>(Arrays.asList(users));

            return usersList;

        } catch (IOException e) {
            e.printStackTrace();
        }
        return  null;
    }

    static public void deleteUser(String email) throws IOException{
        Gson gson = new Gson();
        List<User> users = gson.fromJson(new FileReader("../Json/user.json"), new TypeToken<List<User>>() {}.getType());

        // Eliminar el producto
        List<User> updatedClients = new ArrayList<>();
        for (User user : users) {
            if (!user.getEmail().equalsIgnoreCase(email)) {
                updatedClients.add(user);
            }
        }

        // Escribir el JSON actualizado
        try (FileWriter writer = new FileWriter("../Json/user.json")) {
            gson.toJson(updatedClients, writer);
        }
    }
}
