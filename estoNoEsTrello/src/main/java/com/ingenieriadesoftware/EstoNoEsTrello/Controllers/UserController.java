package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Block;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;
import com.ingenieriadesoftware.EstoNoEsTrello.model.WorkSpace;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.ArrayList;

@RestController
@RequestMapping("/user")
public class UserController {

    public UserController() {
    }


    @GetMapping("/loadWorkSpaces")
    public ResponseEntity<ArrayList<WorkSpace>> loadWorkSpaces(@RequestParam("email") String email){
        User user = new User().findUser(email);
        return new ResponseEntity<ArrayList<WorkSpace>>(user.getWorkspaces(),HttpStatus.OK);
    }

    @PostMapping("/loadBlocks")
    public ResponseEntity<ArrayList<Block>> loadBlocks(@RequestBody Long id, @RequestParam("email") String email) throws IOException {
        User user = new User().findUser(email);
        WorkSpace workSpace = WorkSpaceController.findWorkSpace(id, user);
        return new ResponseEntity<ArrayList<Block>>(workSpace.getBlocks(),HttpStatus.OK);

    }

    @PostMapping("/createWorkSpace")
    public ResponseEntity<Long> createWorkSpace(@RequestBody WorkSpace workSpace, @RequestParam("email") String email) throws IOException{
        User user = new User().findUser(email);

        WorkSpace workSpace1 = new WorkSpace(null, workSpace.getName(), workSpace.getDescription(), workSpace.getBlocks());
        workSpace1.setBlocks(new ArrayList<Block>());
        WorkSpaceController.addWorkSpace(workSpace1, user);

        return new ResponseEntity<Long>(workSpace1.getId(), HttpStatus.OK);
    }

    @PostMapping("/registro")
    public ResponseEntity<String> registro (@RequestBody User user) {
        if (user == null) {
            return ResponseEntity.badRequest().body("Datos de usuario no proporcionados");
        }
        if (user.emailValidation(user.getEmail())){
            if (!(user.isEmailAlreadyUsed(user.getEmail()))) {
                user.setWorkspaces(new ArrayList<WorkSpace>());
                UserJsonController.saveUser(user);
                return new ResponseEntity<String>("Datos Ingresados", HttpStatus.OK);
            } else
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Correo ya registrado");
        }else
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo proporcionado no es de la ucab");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        if (user.verifyLogIn(user.getEmail(), user.getPassword()))
            return new ResponseEntity<String>("Inicio de sesion valido", HttpStatus.OK);
        else
            return new ResponseEntity<String>("Datos invalidos", HttpStatus.BAD_REQUEST);
    }

}
