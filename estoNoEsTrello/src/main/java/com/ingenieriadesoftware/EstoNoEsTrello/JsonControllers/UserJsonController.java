package com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Classes.User;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Classes.WorkSpace;

import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.io.IOException;
import java.io.StringWriter;

// Adaptador para LocalDate
class LocalDateAdapter implements JsonSerializer<LocalDate>, JsonDeserializer<LocalDate> {
    @Override
    public JsonElement serialize(LocalDate date, Type typeOfSrc, JsonSerializationContext context) {
        return new JsonPrimitive(date.format(DateTimeFormatter.ISO_LOCAL_DATE));
    }

    @Override
    public LocalDate deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        String value = json.getAsString();
        try {
            return LocalDate.parse(value, DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (Exception e) {
            // Intenta con dd/MM/yyyy si falla
            return LocalDate.parse(value, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        }
    }
}



public class UserJsonController extends User {

    private static final String USERS_JSON_PATH = "src/main/resources/JSONs/Users.json";

    public UserJsonController(String email, String password, ArrayList<WorkSpace> workspaces) {
        super(email, password, workspaces);
    }

    static public void saveUser(User user){
        try {
            Gson gson = new GsonBuilder().registerTypeAdapter(LocalDate.class, new LocalDateAdapter()).create();
            JsonReader reader = new JsonReader(new FileReader(USERS_JSON_PATH));
            User[] users = gson.fromJson(reader, User[].class);
            List<User> userList= new ArrayList<>(Arrays.asList(users));

            userList.add(user);

            FileWriter fw = new FileWriter(USERS_JSON_PATH);
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
            Gson gson = new GsonBuilder().registerTypeAdapter(LocalDate.class, new LocalDateAdapter()).create();
            JsonReader reader = new JsonReader(new FileReader(USERS_JSON_PATH));
            User[] users = gson.fromJson(reader, User[].class);
            return new ArrayList<>(Arrays.asList(users));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    static public void deleteUser(String email) throws IOException{
        Gson gson = new GsonBuilder().registerTypeAdapter(LocalDate.class, new LocalDateAdapter()).create();
        List<User> users = gson.fromJson(new FileReader(USERS_JSON_PATH), new TypeToken<List<User>>() {}.getType());
        // Eliminar el producto
        List<User> updatedClients = new ArrayList<>();
        for (User user : users) {
            if (!user.getEmail().equalsIgnoreCase(email)) {
                updatedClients.add(user);
            }
        }

        // Escribir el JSON actualizado
        try (FileWriter writer = new FileWriter(USERS_JSON_PATH)) {
            gson.toJson(updatedClients, writer);
        }
    }
}
