package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;
import com.ingenieriadesoftware.EstoNoEsTrello.model.WorkSpace;

import java.io.IOException;
import java.util.ArrayList;

public class WorkSpaceController {

    public WorkSpaceController() {
    }

    static public void addWorkSpace(WorkSpace workSpace , User user) throws IOException {
        ArrayList<User> usersList = UserJsonController.findTotalUsers();
        User currentUser = new User();
        for (User u : usersList) {
            if (u.getEmail().equals(user.getEmail())) {
                ArrayList<WorkSpace> workspaces = u.getWorkspaces();
                if (workspaces == null) workspaces = new ArrayList<>();
                workspaces.add(workSpace);
                u.setWorkspaces(workspaces);
                UserJsonController.deleteUser(u.getEmail());
                UserJsonController.saveUser(u);
                break;
        for (int i=0;i<usersList.size();i++)
        {
            if (usersList.get(i).getEmail().equals(user.getEmail()))
            {
                currentUser=usersList.get(i);
                UserJsonController.deleteUser(user.getEmail());
            }
        }
        currentUser.getWorkspaces().add(workSpace);
        UserJsonController.saveUser(currentUser);
    }
}
