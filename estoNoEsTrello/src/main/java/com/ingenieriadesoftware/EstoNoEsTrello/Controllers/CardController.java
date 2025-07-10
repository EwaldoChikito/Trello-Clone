package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Classes.Card;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Classes.User;

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
        for (int i=0;i<usersList.size();i++)
        {
            if (usersList.get(i).getEmail().equals(user.getEmail()))
            {
                currentUser=usersList.get(i);
                UserJsonController.deleteUser(user.getEmail());
            }
        }
        
        // Buscar y eliminar la tarjeta por índice
        ArrayList<Card> cards = BlockController.findBlock(blockID,workSpaceId,currentUser).getCards();
        boolean cardFound = false;
        for (int i = 0; i < cards.size(); i++) {
            if (cards.get(i).getId().equals(cardID)) {
                cards.remove(i);
                cardFound = true;
                break;
            }
        }
        
        if (!cardFound) {
            System.out.println("Warning: Card with ID " + cardID + " not found in block " + blockID);
        }
        
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
        
        // Buscar y actualizar la tarjeta por índice
        ArrayList<Card> cards = BlockController.findBlock(blockID,workSpaceId,currentUser).getCards();
        boolean cardFound = false;
        for (int i = 0; i < cards.size(); i++) {
            if (cards.get(i).getId().equals(card.getId())) {
                Card oldCard = cards.get(i);
                oldCard.setName(card.getName());
                oldCard.setDescription(card.getDescription());
                oldCard.setCreationDate(card.getCreationDate());
                oldCard.setFinalDate(card.getFinalDate());
                cardFound = true;
                break;
            }
        }
        
        if (!cardFound) {
            System.out.println("Warning: Card with ID " + card.getId() + " not found in block " + blockID);
        }
        
        UserJsonController.saveUser(currentUser);
    }
}
