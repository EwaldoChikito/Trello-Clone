package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;
import com.ingenieriadesoftware.EstoNoEsTrello.model.WorkSpace;

import java.io.IOException;
import java.util.ArrayList;

public class WorkSpaceController {

    public WorkSpaceController() {
    }

    static public void addWorkSpace(WorkSpace workSpace , String email) throws IOException {
        ArrayList<User> usersList = UserJsonController.findTotalUsers();
        User currentUser = new User();
        for (int i=0;i<usersList.size();i++)
        {
            if (usersList.get(i).getEmail().equals(email))
            {
                currentUser=usersList.get(i);
                UserJsonController.deleteUser(email);
            }
        }
        currentUser.getWorkspaces(email).add(workSpace);
        UserJsonController.saveUser(currentUser);
    }
}
