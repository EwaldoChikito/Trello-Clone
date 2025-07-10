package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Block;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;

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
        for (int i=0;i<usersList.size();i++)
        {
            if (usersList.get(i).getEmail().equals(user.getEmail()))
            {
                currentUser=usersList.get(i);
                UserJsonController.deleteUser(user.getEmail());
            }
        }
        
        // Buscar y eliminar el bloque por índice
        ArrayList<Block> blocks = WorkSpaceController.findWorkSpace(workSpaceId,currentUser).getBlocks();
        boolean blockFound = false;
        for (int i = 0; i < blocks.size(); i++) {
            if (blocks.get(i).getId().equals(blockID)) {
                blocks.remove(i);
                blockFound = true;
                break;
            }
        }
        
        if (!blockFound) {
            System.out.println("Warning: Block with ID " + blockID + " not found in workspace " + workSpaceId);
        }
        
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
        
        // Buscar y actualizar el bloque por índice
        ArrayList<Block> blocks = WorkSpaceController.findWorkSpace(workSpaceId,currentUser).getBlocks();
        boolean blockFound = false;
        for (int i = 0; i < blocks.size(); i++) {
            if (blocks.get(i).getId().equals(block.getId())) {
                Block oldBlock = blocks.get(i);
                oldBlock.setName(block.getName());
                blockFound = true;
                break;
            }
        }
        
        if (!blockFound) {
            System.out.println("Warning: Block with ID " + block.getId() + " not found in workspace " + workSpaceId);
        }
        
        UserJsonController.saveUser(currentUser);
    }
}

