package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
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
        BlockController.findBlock(blockID,workSpaceId,currentUser).getCards().add(card);
        UserJsonController.saveUser(currentUser);
    }

    static public Card findCard(Long cardID,Long blockId, Long workSpaceId, User user) throws IOException {

        ArrayList<Card> cardArrayList = BlockController.findBlock(blockId,workSpaceId,user).getCards();
        for (int i=0;i<cardArrayList.size();i++) {
            if (cardArrayList.get(i).getId().equals(cardID)){
                return cardArrayList.get(i);
            }
        }
        return (new Card());
    }

    public static void deleteCard(Long cardID, Long blockID, Long workSpaceId, User user) throws IOException {
        ArrayList<User> usersList = UserJsonController.findTotalUsers();
        User currentUser = new User();
        Card card = CardController.findCard(cardID,blockID,workSpaceId,user);
        for (int i=0;i<usersList.size();i++)
        {
            if (usersList.get(i).getEmail().equals(user.getEmail()))
            {
                currentUser=usersList.get(i);
                UserJsonController.deleteUser(user.getEmail());
            }
        }
        BlockController.findBlock(blockID,workSpaceId,currentUser).getCards().remove(card);
        UserJsonController.saveUser(currentUser);
    }
}
