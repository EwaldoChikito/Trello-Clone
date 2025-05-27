package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Block;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Card;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;

import java.io.IOException;
import java.util.ArrayList;

public class CardController {

    public CardController() {
    }

    public static void addCard(Card card, User user, Long blockID, Long workSpaceId) throws IOException {
        ArrayList<User> usersList = UserJsonController.findTotalUsers();
        User currentUser = new User();
        for (int i=0;i<usersList.size();i++)
        {
            if (usersList.get(i).getEmail().equals(user.getEmail()))
            {
                currentUser=usersList.get(i);
                UserJsonController.deleteUser(user.getEmail());
            }
        }
//        WorkSpaceController.findWorkSpace(workSpaceId,currentUser).getBlocks().add(block);
        BlockController.findBlock(blockID,user,workSpaceId).getCards().add(card);
        UserJsonController.saveUser(currentUser);
    }
}
