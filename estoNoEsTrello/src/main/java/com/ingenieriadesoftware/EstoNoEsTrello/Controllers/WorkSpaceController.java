package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.Block;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;
import com.ingenieriadesoftware.EstoNoEsTrello.model.WorkSpace;

import java.io.IOException;
import java.util.ArrayList;

public class WorkSpaceController {

    public WorkSpaceController() {
    }

    static public void deleteWorkSpace(long workSpaceID, User user) throws IOException {
        ArrayList<User> usersList = UserJsonController.findTotalUsers();
        WorkSpace workSpace = WorkSpaceController.findWorkSpace(workSpaceID,user);
        User currentUser = new User();
        for (int i=0;i<usersList.size();i++)
        {
            if (usersList.get(i).getEmail().equals(user.getEmail()))
            {
                currentUser=usersList.get(i);
                UserJsonController.deleteUser(user.getEmail());
            }
        }
        currentUser.getWorkspaces().remove(workSpace);
        UserJsonController.saveUser(currentUser);
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
//        WorkSpace workSpacesAux = new WorkSpace();
        for (int i=0;i<workSpacesList.size();i++) {
            if (workSpacesList.get(i).getId().equals(id)){
                return workSpacesList.get(i);
            }
        }
        return (new WorkSpace());
    }

    public static void updateWorkSpace(WorkSpace workSpace, User user) throws IOException {
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
        WorkSpace oldWorkSpace = WorkSpaceController.findWorkSpace(workSpace.getId(),currentUser);
        oldWorkSpace.setName(workSpace.getName());
        UserJsonController.saveUser(currentUser);
    }
}
