package org.tresor.backend.account;

//import org.bson.types.ObjectId;

import java.util.ArrayList;
//import java.util.List;

public class User {

    private String username;
    private String password;
    private String fullName;
//    private List<ObjectId> notesIdList;

    public User() {
    }

    public User(String fullName, String username, String password) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
//        notesIdList = new ArrayList<>();
    }

    public User(String fullName, String username) {
        this(fullName, username, null);
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
