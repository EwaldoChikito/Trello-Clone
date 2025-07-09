package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Block;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Card;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;
import com.ingenieriadesoftware.EstoNoEsTrello.model.WorkSpace;

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

    public static void updateCard(Card card, Long blockID, Long workSpaceId, User user) throws IOException {
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
        Card oldCard = CardController.findCard(card.getId(),blockID,workSpaceId,currentUser);
        oldCard.setName(card.getName());
        oldCard.setDescription(card.getDescription());
        oldCard.setCreationDate(card.getCreationDate());
        oldCard.setCreationDate(card.getFinalDate());
        UserJsonController.saveUser(currentUser);
    }
}
