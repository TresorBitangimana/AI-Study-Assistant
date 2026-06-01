package org.tresor.backend.account;

import java.util.Map;

public class User {

    private String username;
    private String password;
    private String fullName;
    private String[] notesIds;
    private String[] flashCardsIds;
    private Map<String, String> flashCards;

    public User(String fullName, String username, String password) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
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
}
