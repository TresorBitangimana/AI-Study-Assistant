package org.tresor.backend.account;

public class User {

    private String username;
    private String password;
    private String id;

    public User(String username, String password){
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getId() {
        return id;
    }
}
