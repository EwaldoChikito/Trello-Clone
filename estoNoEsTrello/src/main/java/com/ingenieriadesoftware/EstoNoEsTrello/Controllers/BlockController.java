package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Block;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;
import com.ingenieriadesoftware.EstoNoEsTrello.model.WorkSpace;

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

    static public Block findBlock(Long id, User user, Long workSpaceId) throws IOException {
       ArrayList<Block> blockArrayList = WorkSpaceController.findWorkSpace(workSpaceId,user).getBlocks();
       Block blockAux = new Block();
        for (int i=0;i<blockArrayList.size();i++) {
            if (blockArrayList.get(i).getId().equals(id)){
                blockAux = blockArrayList.get(i);
                return blockAux;
            }
        }
        return blockAux;
    }
}
