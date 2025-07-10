package com.ingenieriadesoftware.EstoNoEsTrello.Controllers;

import com.ingenieriadesoftware.EstoNoEsTrello.JsonControllers.UserJsonController;
import com.ingenieriadesoftware.EstoNoEsTrello.model.User;
import com.ingenieriadesoftware.EstoNoEsTrello.model.WorkSpace;

import java.io.IOException;
import java.util.ArrayList;

public class WorkSpaceController {

    public WorkSpaceController() {
    }

    static public void deleteWorkSpace(long workSpaceID, User user) throws IOException {
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
        
        // Buscar y eliminar el workspace por índice
        ArrayList<WorkSpace> workspaces = currentUser.getWorkspaces();
        boolean workspaceFound = false;
        for (int i = 0; i < workspaces.size(); i++) {
            if (workspaces.get(i).getId().equals(workSpaceID)) {
                workspaces.remove(i);
                workspaceFound = true;
                break;
            }
        }
        
        if (!workspaceFound) {
            System.out.println("Warning: WorkSpace with ID " + workSpaceID + " not found for user " + user.getEmail());
        }
        
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
        // Buscar y actualizar el workspace por índice
        ArrayList<WorkSpace> workspaces = currentUser.getWorkspaces();
        boolean found = false;
        for (int i = 0; i < workspaces.size(); i++) {
            if (workspaces.get(i).getId().equals(workSpace.getId())) {
                WorkSpace ws = workspaces.get(i);
                ws.setName(workSpace.getName());
                ws.setDescription(workSpace.getDescription());
                found = true;
                break;
            }
        }
        if (!found) {
            System.out.println("Warning: Workspace with ID " + workSpace.getId() + " not found for user " + user.getEmail());
        }
        UserJsonController.saveUser(currentUser);
    }
}
