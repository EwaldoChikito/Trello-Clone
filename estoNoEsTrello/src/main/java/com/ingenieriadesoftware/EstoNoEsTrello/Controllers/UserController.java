package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.*;
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

    @GetMapping("/loadBlocks")
    public ResponseEntity<ArrayList<Block>> loadBlocks(@RequestParam("email") String email, @RequestParam("workspaceid") Long id) throws IOException {
        User user = new User().findUser(email);
        WorkSpace workSpace = WorkSpaceController.findWorkSpace(id, user);
        return new ResponseEntity<ArrayList<Block>>(workSpace.getBlocks(),HttpStatus.OK);

    }

    @GetMapping("/loadCards")
    public ResponseEntity<ArrayList<Card>> loadCards(@RequestParam("email") String email, @RequestParam("blockId") Long id, @RequestParam("workspaceid") Long workSpaceId) throws IOException {
        User user = new User().findUser(email);
        Block block = BlockController.findBlock(id, workSpaceId, user );
        return new ResponseEntity<ArrayList<Card>>(block.getCards(),HttpStatus.OK);

    }

    @PostMapping("/createWorkSpace")
    public ResponseEntity<Long> createWorkSpace(@RequestBody WorkSpace workSpace, @RequestParam("email") String email) throws IOException{
        User user = new User().findUser(email);

        WorkSpace workSpace1 = new WorkSpace(null, workSpace.getName(), workSpace.getDescription(), workSpace.getBlocks());
        workSpace1.setBlocks(new ArrayList<Block>());
        WorkSpaceController.addWorkSpace(workSpace1, user);

        return new ResponseEntity<Long>(workSpace1.getId(), HttpStatus.OK);
    }

    @PostMapping("/createBlock")
    public ResponseEntity<Long> createBlock(@RequestBody Block block, @RequestParam("email") String email, @RequestParam("workspaceid") Long workSpaceId) throws IOException{
        User user = new User().findUser(email);

        Block block1 = new Block(null, block.getName(), block.getCards());
        block1.setCards(new ArrayList<Card>());
//        WorkSpaceController.findWorkSpace(workSpaceId, user).getBlocks().add(block1);
        BlockController.addBlock(block1, user, workSpaceId);
        System.out.println("Block created with Name: " + block1.getName());
        return new ResponseEntity<Long>(block1.getId(), HttpStatus.OK);
    }

    @PostMapping("/createCard")
    public ResponseEntity<Long> createCard(@RequestBody Card card, @RequestParam("blockId") Long blockID, @RequestParam("email") String email, @RequestParam("workspaceid") Long workSpaceId) throws IOException{
        User user = new User().findUser(email);

//        Block block1 = new Block(null, block.getName(), block.getCards());
        Card card1 = new Card(null,card.getName(),card.getDescription(),card.getCreationDate(),card.getFinalDate());

        CardController.addCard(card1, user, blockID,workSpaceId);
        System.out.println("Card created with ID: " + card1.getId());
        return new ResponseEntity<Long>(card1.getId(), HttpStatus.OK);
    }

    @PostMapping("/deleteWorkSpace")
    public ResponseEntity<Long> deleteWorkSpace(@RequestParam("workspaceid") Long workSpaceId, @RequestParam("email") String email) throws IOException {
        User user = new User().findUser(email);

        WorkSpaceController.deleteWorkSpace(workSpaceId, user);
        System.out.println("WorkSpace eliminado con exito");
        return new ResponseEntity<Long>(HttpStatus.OK);

    }

    @PostMapping("/deleteBlock")
    public ResponseEntity<Long> deleteBlock(@RequestParam("blockId") Long blockID,@RequestParam("workspaceid") Long workSpaceId,@RequestParam("email") String email) throws IOException {
        User user = new User().findUser(email);
        BlockController.deleteBlock(blockID,workSpaceId, user);
        return new ResponseEntity<Long>(HttpStatus.OK);
    }

    @PostMapping("/deleteCard")
    public ResponseEntity<Long> deleteCard(@RequestParam("cardId") Long cardID,@RequestParam("blockId") Long blockID,@RequestParam("workspaceid") Long workSpaceId,@RequestParam("email") String email) throws IOException {
        User user = new User().findUser(email);
        CardController.deleteCard(cardID,blockID,workSpaceId, user);
        return new ResponseEntity<Long>(HttpStatus.OK);
    }

    @PostMapping("/updateCard")
    public ResponseEntity<Long> updateCard(@RequestBody Card card, @RequestParam("blockId") Long blockID, @RequestParam("workspaceid") Long workSpaceId, @RequestParam("email") String email) throws IOException {
        User user = new User().findUser(email);
        CardController.updateCard(card, blockID, workSpaceId, user);
        return new ResponseEntity<Long>(card.getId(), HttpStatus.OK);
    }

    @PostMapping("/updateBlock")
    public ResponseEntity<Long> updateBlock(@RequestBody Block block, @RequestParam("workspaceid") Long workSpaceId, @RequestParam("email") String email) throws IOException {
        User user = new User().findUser(email);
        BlockController.updateBlock(block, workSpaceId, user);
        return new ResponseEntity<Long>(block.getId(), HttpStatus.OK);
    }

    @PostMapping("/updateWorkSpace")
    public ResponseEntity<Long> updateWorkSpace(@RequestBody WorkSpace workSpace,@RequestParam("email") String email) throws IOException {
        User user = new User().findUser(email);
        WorkSpaceController.updateWorkSpace(workSpace, user);
        return new ResponseEntity<Long>(workSpace.getId(), HttpStatus.OK);
    }

    @PostMapping("/registro")
    public ResponseEntity<String> registro (@RequestBody User user) {
        if (user == null) {
            return ResponseEntity.badRequest().body("Datos de usuario no proporcionados");
        }
        if (Validation.emailValidation(user.getEmail())){
            if (!(Validation.isEmailAlreadyUsed(user.getEmail()))) {
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
        if (Validation.verifyLogIn(user.getEmail(), user.getPassword()))
            return new ResponseEntity<String>("Inicio de sesion valido", HttpStatus.OK);
        else
            return new ResponseEntity<String>("Datos invalidos", HttpStatus.BAD_REQUEST);
    }

    public static User findUser(String email) {
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
