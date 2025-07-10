package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Classes.Block;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Classes.User;

import java.io.IOException;
import java.util.ArrayList;

public class BlockController {

    public BlockController() {
    }

//        ArrayList<Block> blockArrayList = WorkSpaceController.findWorkSpace(workSpaceId,user).getBlocks();

    public static void addBlock(Block block, User user, Long workSpaceId) throws IOException {
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
        WorkSpaceController.findWorkSpace(workSpaceId,currentUser).getBlocks().add(block);
        UserJsonController.saveUser(currentUser);
    }

    static public Block findBlock(Long blockId, Long workSpaceId, User user) throws IOException {
        ArrayList<Block> blockArrayList = WorkSpaceController.findWorkSpace(workSpaceId,user).getBlocks();
        for (int i=0;i<blockArrayList.size();i++) {
            if (blockArrayList.get(i).getId().equals(blockId)){
                return blockArrayList.get(i);

            }
        }
        return (new Block());
    }

    public static void deleteBlock(Long blockID, Long workSpaceId, User user) throws IOException {
        ArrayList<User> usersList = UserJsonController.findTotalUsers();
        User currentUser = new User();
        Block block = BlockController.findBlock(blockID,workSpaceId,user);
        for (int i=0;i<usersList.size();i++)
        {
            if (usersList.get(i).getEmail().equals(user.getEmail()))
            {
                currentUser=usersList.get(i);
                UserJsonController.deleteUser(user.getEmail());
            }
        }
        WorkSpaceController.findWorkSpace(workSpaceId,currentUser).getBlocks().remove(block);
        UserJsonController.saveUser(currentUser);
    }

    public static void updateBlock(Block block, Long workSpaceId, User user) throws IOException {
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
        Block oldBlock = BlockController.findBlock(block.getId(),workSpaceId,currentUser);
        oldBlock.setName(block.getName());
        UserJsonController.saveUser(currentUser);
    }
}

