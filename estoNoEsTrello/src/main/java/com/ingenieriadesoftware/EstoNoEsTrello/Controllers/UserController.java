package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import ch.qos.logback.core.net.server.Client;
import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;
import com.ingenieriadesoftware.EstoNoEsTrello.model.WorkSpace;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    public UserController() {
    }

    public void registerUser (String password, String email){
        ArrayList<User> usersList = new ArrayList<User>();
        usersList = UserJsonController.findTotalUsers();
        if (usersList == null){
            usersList = new ArrayList<User>();
        }
        User newUser = new User(password,email);
        usersList.add(newUser);
        UserJsonController.saveUser(newUser);
    }



    @PostMapping("/createWorkSpace")
    public ResponseEntity<String> createWorkSpace(@RequestBody WorkSpace workSpace, @RequestParam("email") String email) throws IOException{
        User user = new User("",email);

        WorkSpaceController.addWorkSpace(workSpace, email);
        return new ResponseEntity<String>("Espacio de Trabajo Agregado", HttpStatus.OK);
    }
}
