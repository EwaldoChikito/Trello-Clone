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

//    public void registerUser (String email, String password){
//        ArrayList<User> usersList = new ArrayList<User>();
//        usersList = UserJsonController.findTotalUsers();
//        if (usersList == null){
//            usersList = new ArrayList<User>();
//        }
//        User newUser = new User(email,password);
//        usersList.add(newUser);
//        UserJsonController.saveUser(newUser);
//    }

    @GetMapping("/loadWorkSpaces")
    public ResponseEntity<ArrayList<WorkSpace>> loadWorkSpaces(@RequestParam("email") String email){
        User user = new User().findUser(email);
//        if(user.getWorkspaces().isEmpty()){
//            return new ResponseEntity<ArrayList<WorkSpace>>(user.getWorkspaces(),HttpStatus.BAD_REQUEST);
//        }
//        else{
//            return new ResponseEntity<ArrayList<WorkSpace>>(user.getWorkspaces(),HttpStatus.OK);
//        }
        return new ResponseEntity<ArrayList<WorkSpace>>(user.getWorkspaces(),HttpStatus.OK);
    }

//    @PostMapping("/createWorkSpace")
//    public ResponseEntity<String> createWorkSpace(@RequestBody WorkSpace workSpace, @RequestParam("email") String email) throws IOException{
//        User user = new User(email,"");
//
//        WorkSpaceController.addWorkSpace(workSpace, email);
//        return new ResponseEntity<String>("Espacio de Trabajo Agregado", HttpStatus.OK);
//    }

    @PostMapping("/createWorkSpace")
    public ResponseEntity<String> createWorkSpace(@RequestBody WorkSpace workSpace, @RequestParam("email") String email) throws IOException{
        User user = new User().findUser(email);

        WorkSpace workSpace1 = new WorkSpace(null, workSpace.getName(), workSpace.getDescription(), workSpace.getBlocks());
        WorkSpaceController.addWorkSpace(workSpace1, user);

        return new ResponseEntity<String>("Diseño agregado", HttpStatus.OK);
    }

    @PostMapping("/registro")
    public ResponseEntity<String> registro (@RequestBody User user) {
        if (user == null) {
            return ResponseEntity.badRequest().body("Datos de usuario no proporcionados");
        }
        if(!user.verifyEmail(user.getEmail()))
        {
            user.setWorkspaces(new ArrayList<WorkSpace>());
            UserJsonController.saveUser(user);
            return new ResponseEntity<String>("Datos Ingresados",HttpStatus.OK);
        }
        else
            return new ResponseEntity<String>("Correo Invalido",HttpStatus.CONFLICT);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        if (user.verifyLogIn(user.getEmail(), user.getPassword()))
            return new ResponseEntity<String>("Inicio de sesion valido", HttpStatus.OK);
        else
            return new ResponseEntity<String>("Datos invalidos", HttpStatus.BAD_REQUEST);
    }
}
