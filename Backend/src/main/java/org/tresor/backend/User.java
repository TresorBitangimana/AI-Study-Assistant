package org.tresor.backend;

public class User {

    private String username;
    private String password;
    private final String id;

    public User(String username, String password, String id){
        this.username = username;
        this.password = password;
        this.id = id;
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
