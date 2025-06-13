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

    static public WorkSpace findWorkSpace(Long id, User user) throws IOException {
        ArrayList<WorkSpace> workSpacesList = user.getWorkspaces();
        WorkSpace workSpacesAux = new WorkSpace();
        for (int i=0;i<workSpacesList.size();i++) {
            if (workSpacesList.get(i).getId().equals(id)){
                workSpacesAux = workSpacesList.get(i);
                return workSpacesAux;
            }
        }
        return workSpacesAux;
    }
}
