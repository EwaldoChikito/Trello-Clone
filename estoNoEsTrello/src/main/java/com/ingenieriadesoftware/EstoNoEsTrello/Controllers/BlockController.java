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


    public static void addBlock(Block block, User user, Long workSpaceId) throws IOException {
//        ArrayList<Block> blockArrayList = WorkSpaceController.findWorkSpace(workSpaceId,user).getBlocks();
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
//        currentUser.getWorkspaces().add(workSpace);
        UserJsonController.saveUser(currentUser);

    }
}
